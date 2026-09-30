import { useEffect, useRef, useState } from "react";
import sprites from "./sprites.json";

// A small robot that follows the cursor, plus a charging dock (bottom-right) it can be
// sent to. Rendered on one <canvas> driven by requestAnimationFrame; all animation state
// lives in plain variables, so React only re-renders when the pet docks/undocks.
// Sprite strips + sprites.json come from `npm run pet:sprites`.

// Per-frame durations (ms). Looping animations wrap; the rest play once.
const DURATIONS = {
  idle: [700, 500, 140, 500], // breathe in, breathe out, blink (short), settle
  walk: [130, 130, 130, 130],
  run: [75, 75, 75, 75],
  sleep: [900, 900, 900],
  happy: [120, 130, 200, 360], // surprised, arms up, jump + sparkles, happy landing
  teleportOut: [90, 90, 110, 150],
  teleportIn: [110, 100, 100, 240],
  charge: [1100, 800, 180, 800], // docked: the idle breathing, slowed right down
};
const SHEET_OF = { charge: "idle" }; // animations that reuse another sprite strip
const LOOPING = new Set(["idle", "walk", "run", "sleep", "charge"]);
const FLIPPABLE = new Set(["walk", "run"]); // drawn facing right; mirrored when moving left

const OFFSET_X = 24; // how far the pet trails behind the cursor (px)
const OFFSET_Y = 18; // feet sit a little below the cursor, so it walks beside it
const FOLLOW = 5; // easing strength (higher = snappier)
const WALK_SPEED = 30; // px/s of pet movement to start walking…
const RUN_SPEED = 450; // …and to start running
const LOOK_FOR = 2500; // ms after the cursor stops: keep looking at it
const SLEEP_AFTER = 10000; // ms without cursor movement before dozing off
const TELEPORT_DISTANCE = 480; // cursor this far away -> teleport instead of chasing
const TELEPORT_COOLDOWN = 12000;
const RANDOM_TELEPORT_MS = [35000, 70000]; // occasional playful teleport while idle
const FADE_MS = 120; // cross-fade between different animations
// The robot's body around its anchor (feet centre), in CSS px: hovering here makes it happy.
const HIT = { halfW: 20, top: 46, bottom: 4 };
const HOVER_DELAY = 120; // ms the cursor must rest on the robot (a fast sweep across it doesn't count)
const PET_REPLAY_MS = 1200; // keep "petting" (moving over it) to replay the happy animation
// Look frames: 0 left, 1 slightly left, 2 slightly right, 3 right; boundaries in px of cursor dx.
const LOOK_EDGES = [-40, 0, 40];
const LOOK_HYSTERESIS = 8; // must cross a boundary by this much, so jitter can't flip the head

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const DOCK_KEY = "pet:docked"; // remembers a docked pet across reloads
const readDocked = () => {
  try {
    return localStorage.getItem(DOCK_KEY) === "1";
  } catch {
    return false;
  }
};
const storeDocked = (docked) => {
  try {
    localStorage.setItem(DOCK_KEY, docked ? "1" : "0");
  } catch {
    /* storage blocked: docking just won't persist */
  }
};

function startPet(canvas, { dock, startDocked, onDockChange }) {
  const { density, cell, anchor, sheets } = sprites;
  const ctx = canvas.getContext("2d");
  const images = {};
  let dpr = 0;
  let raf = 0;
  let stopped = false;

  const s = {
    visible: false,
    x: 0,
    y: 0,
    speed: 0,
    facing: 1,
    offsetX: -OFFSET_X,
    mouse: { x: 0, y: 0, lastMove: 0 },
    anim: "idle",
    frame: 0,
    frameTime: 0,
    done: false,
    action: null, // "happy" | "teleportOut" | "teleportIn" while a one-shot plays
    teleportJitter: null,
    teleportTo: null, // exact landing spot for the next teleport (the dock)
    docked: false,
    docking: false,
    dockAt: { x: 0, y: 0 }, // where the robot's feet go in the dock (client px)
    lastTeleport: -Infinity,
    happyStarted: 0,
    hoverSince: 0,
    nextRandomTeleport: 0,
    fade: null, // { anim, frame, flip, t } of the outgoing animation
    drawnKey: "",
  };

  function sizeCanvas() {
    const next = window.devicePixelRatio || 1;
    if (next === dpr) return;
    dpr = next;
    canvas.width = Math.round(cell.w * dpr);
    canvas.height = Math.round(cell.h * dpr);
    canvas.style.width = `${cell.w}px`;
    canvas.style.height = `${cell.h}px`;
    ctx.imageSmoothingEnabled = true; // strips are 2x; this only ever downsamples
    ctx.imageSmoothingQuality = "high";
    s.drawnKey = "";
  }

  const flipFor = (anim) => FLIPPABLE.has(anim) && s.facing < 0;

  function setAnim(anim, frame = 0) {
    const flip = flipFor(anim);
    if (anim === s.anim && frame === s.frame && flip === flipFor(s.anim))
      return;
    // Snap between frames of the same animation (that's what sprites do); fade between
    // different animations, and between look poses, so nothing jumps.
    if (anim !== s.anim || anim === "look")
      s.fade = { anim: s.anim, frame: s.frame, flip: flipFor(s.anim), t: 0 };
    s.anim = anim;
    canvas.dataset.anim = anim; // visible in devtools, handy when tuning
    s.frame = frame;
    s.frameTime = 0;
    s.done = false;
  }

  function advance(dtMs) {
    const d = DURATIONS[s.anim];
    if (!d || s.done) return;
    s.frameTime += dtMs;
    while (s.frameTime >= d[s.frame]) {
      s.frameTime -= d[s.frame];
      if (s.frame + 1 < d.length) s.frame++;
      else if (LOOPING.has(s.anim)) s.frame = 0;
      else {
        s.done = true;
        break;
      }
    }
  }

  function lookFrame(dx) {
    const next = LOOK_EDGES.filter((edge) => dx >= edge).length;
    if (s.anim !== "look" || Math.abs(next - s.frame) !== 1) return next;
    const edge = LOOK_EDGES[Math.min(next, s.frame)]; // boundary between current and next pose
    return Math.abs(dx - edge) < LOOK_HYSTERESIS ? s.frame : next;
  }

  function startAction(name, now) {
    s.action = name;
    setAnim(name);
    if (name === "teleportOut") s.lastTeleport = now;
    if (name === "happy") s.happyStarted = now;
  }

  function blit(anim, frame, flip) {
    const sw = cell.w * density;
    const sh = cell.h * density;
    ctx.save();
    if (flip) {
      ctx.translate(canvas.width, 0); // cell is symmetric around the anchor, so it stays put
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      images[SHEET_OF[anim] ?? anim],
      frame * sw,
      0,
      sw,
      sh,
      0,
      0,
      canvas.width,
      canvas.height,
    );
    ctx.restore();
  }

  function draw() {
    const flip = flipFor(s.anim);
    const fadeT = s.fade ? Math.min(1, s.fade.t / FADE_MS) : 1;
    const key = `${s.anim}:${s.frame}:${flip}:${s.fade ? s.fade.anim + s.fade.frame + fadeT.toFixed(2) : ""}`;
    if (key === s.drawnKey) return; // nothing changed since the last paint
    s.drawnKey = key;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (s.fade) {
      ctx.globalAlpha = 1 - fadeT;
      blit(s.fade.anim, s.fade.frame, s.fade.flip);
      ctx.globalAlpha = fadeT;
    }
    blit(s.anim, s.frame, flip);
    ctx.globalAlpha = 1;
  }

  function place() {
    // round to device pixels so the sprite never lands between pixels (no blur)
    const px = Math.round((s.x - anchor.x) * dpr) / dpr;
    const py = Math.round((s.y - anchor.y) * dpr) / dpr;
    canvas.style.transform = `translate3d(${px}px, ${py}px, 0)`;
  }

  let last = performance.now();
  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dtMs = Math.min(now - last, 50); // tab was hidden / slow frame: don't leap
    last = now;
    if (!s.visible) return;
    const dt = dtMs / 1000;

    // Trail behind the cursor on the side it's coming from (eased, so a turn isn't a jump);
    // near a window edge use the other side, so it never ends up under the cursor.
    let side = -s.facing * OFFSET_X;
    if (s.mouse.x + side - anchor.x < 0) side = OFFSET_X;
    else if (s.mouse.x + side + (cell.w - anchor.x) > innerWidth)
      side = -OFFSET_X;
    s.offsetX += (side - s.offsetX) * (1 - Math.exp(-8 * dt));
    // keep the whole robot on screen, even with the cursor at the window edge
    const tx = clamp(
      s.mouse.x + s.offsetX,
      anchor.x,
      innerWidth - (cell.w - anchor.x),
    );
    const ty = clamp(
      s.mouse.y + OFFSET_Y,
      anchor.y,
      innerHeight - (cell.h - anchor.y),
    );
    const sinceMove = now - s.mouse.lastMove;
    const hovering =
      Math.abs(s.mouse.x - s.x) < HIT.halfW &&
      s.mouse.y > s.y - HIT.top &&
      s.mouse.y < s.y + HIT.bottom;
    if (!hovering) s.hoverSince = 0;
    else if (!s.hoverSince) s.hoverSince = now;

    advance(dtMs);
    if (s.fade && (s.fade.t += dtMs) >= FADE_MS) s.fade = null;

    if (s.action) {
      // One-shots hold the pet in place until they finish.
      if (s.done) {
        if (s.action === "teleportOut") {
          const j = s.teleportJitter;
          const to = s.teleportTo ?? {
            x: tx + (j ? j.x : 0),
            y: ty + (j ? j.y : 0),
          };
          s.x = to.x;
          s.y = to.y;
          s.teleportJitter = s.teleportTo = null;
          s.speed = 0;
          startAction("teleportIn", now);
        } else if (s.action === "teleportIn" && s.docking) {
          // landed on the charging platform
          s.docking = false;
          s.docked = true;
          s.action = null;
          setAnim("charge");
          onDockChange(true);
        } else if (s.action === "happy" && hovering) {
          // still being hovered: hold the happy landing pose, replay while "petted"
          if (s.mouse.lastMove > s.happyStarted + PET_REPLAY_MS)
            startAction("happy", now);
        } else {
          s.action = null;
          s.nextRandomTeleport = now + rand(...RANDOM_TELEPORT_MS);
        }
      }
    } else if (s.docked) {
      // charging: stays put in the dock, ignores the cursor
      s.x = s.dockAt.x;
      s.y = s.dockAt.y;
      if (s.anim !== "charge") setAnim("charge");
    } else if (hovering && now - s.hoverSince > HOVER_DELAY) {
      startAction("happy", now); // cursor is on the robot
    } else if (
      Math.hypot(tx - s.x, ty - s.y) > TELEPORT_DISTANCE &&
      now - s.lastTeleport > TELEPORT_COOLDOWN
    ) {
      startAction("teleportOut", now); // too far to chase: blink over instead
    } else {
      const a = 1 - Math.exp(-FOLLOW * dt);
      const nx = s.x + (tx - s.x) * a;
      const ny = s.y + (ty - s.y) * a;
      const vx = (nx - s.x) / dt;
      const inst = Math.hypot(nx - s.x, ny - s.y) / dt;
      s.speed += (inst - s.speed) * (1 - Math.exp(-10 * dt));
      s.x = nx;
      s.y = ny;
      if (Math.abs(vx) > 20) s.facing = Math.sign(vx);

      const moving = s.anim === "walk" || s.anim === "run";
      if (s.speed > (s.anim === "run" ? RUN_SPEED * 0.7 : RUN_SPEED))
        setAnim("run", s.anim === "run" ? s.frame : 0);
      else if (s.speed > (moving ? WALK_SPEED * 0.5 : WALK_SPEED))
        setAnim("walk", s.anim === "walk" ? s.frame : 0);
      else if (sinceMove < LOOK_FOR) {
        // Standing still: turn head/eyes toward the cursor.
        setAnim("look", lookFrame(s.mouse.x - s.x));
      } else if (sinceMove < SLEEP_AFTER) {
        if (s.anim !== "idle") setAnim("idle");
        if (
          now > s.nextRandomTeleport &&
          now - s.lastTeleport > TELEPORT_COOLDOWN
        ) {
          // occasional trick: vanish and pop back in a little way off, then wander back
          s.teleportJitter = { x: rand(-70, 70), y: rand(-30, 20) };
          startAction("teleportOut", now);
        }
      } else if (s.anim !== "sleep") setAnim("sleep");
    }

    place();
    draw();
  }

  function onMove(e) {
    if (e.pointerType === "touch") return;
    s.mouse.x = e.clientX;
    s.mouse.y = e.clientY;
    s.mouse.lastMove = performance.now();
    if (!s.visible && images.teleportIn) {
      // first sighting: materialise next to the cursor
      show(e.clientX - OFFSET_X, e.clientY + OFFSET_Y);
      startAction("teleportIn", s.mouse.lastMove);
    }
  }

  function show(x, y) {
    s.visible = true;
    s.x = x;
    s.y = y;
    canvas.style.visibility = "visible";
    s.nextRandomTeleport = performance.now() + rand(...RANDOM_TELEPORT_MS);
  }

  function dockPoint() {
    const r = dock.getBoundingClientRect();
    return { x: r.left + sprites.dock.slot.x, y: r.top + sprites.dock.slot.y };
  }

  // Dock click: send the pet to charge, or (if it's charging) let it out.
  function toggleDock() {
    const now = performance.now();
    if (s.docked) {
      s.docked = false;
      onDockChange(false);
      s.mouse.lastMove = now; // look around / follow right away instead of dozing
      startAction("happy", now); // pops out of the charger
      return;
    }
    if (s.docking || s.action === "teleportOut" || s.action === "teleportIn")
      return;
    s.docking = true;
    s.dockAt = dockPoint();
    if (!s.visible) {
      show(s.dockAt.x, s.dockAt.y);
      startAction("teleportIn", now);
    } else {
      s.teleportTo = s.dockAt; // blink out here, materialise on the platform
      startAction("teleportOut", now);
    }
  }

  function onResize() {
    sizeCanvas(); // also covers being dragged to a screen with another pixel ratio
    s.dockAt = dockPoint();
  }

  function onDown(e) {
    if (e.pointerType === "touch" || !s.visible || s.docked) return;
    if (e.target.closest?.("[data-pet-dock]")) return; // the dock handles its own clicks
    if (
      s.action === "teleportOut" ||
      s.action === "teleportIn" ||
      s.action === "happy"
    )
      return;
    startAction("happy", performance.now());
  }

  // Preload + decode every strip before showing anything.
  Promise.all(
    Object.entries(sheets).map(([name, { src }]) => {
      const img = new Image();
      img.src = src;
      images[name] = img;
      return img.decode();
    }),
  )
    .then(() => {
      if (stopped) return;
      sizeCanvas();
      if (startDocked) {
        s.dockAt = dockPoint();
        show(s.dockAt.x, s.dockAt.y);
        s.docked = true;
        setAnim("charge");
      }
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("resize", onResize);
      raf = requestAnimationFrame(tick);
    })
    .catch(() => {}); // sprites missing: no pet, nothing else affected

  return {
    toggleDock,
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    },
  };
}

// Mouse/trackpad only (no touch-only devices), and not for reduced-motion users.
const petAllowed = () =>
  typeof matchMedia === "function" &&
  matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CursorPet() {
  const canvasRef = useRef(null);
  const dockRef = useRef(null);
  const petRef = useRef(null);
  const [enabled] = useState(petAllowed);
  const [docked, setDocked] = useState(readDocked);

  useEffect(() => {
    if (!enabled) return;
    const pet = startPet(canvasRef.current, {
      dock: dockRef.current,
      startDocked: readDocked(),
      onDockChange: (d) => {
        setDocked(d);
        storeDocked(d);
      },
    });
    petRef.current = pet;
    return pet.stop;
  }, [enabled]);

  if (!enabled) return null;
  const { dock } = sprites;
  const label = docked ? "Take me with you" : "Click to charge pet";

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2147483000] select-none"
        style={{ visibility: "hidden", willChange: "transform" }}
      />
      {/* Charging dock. Sits just under the pet's canvas, so a docked pet draws on top of it. */}
      <button
        ref={dockRef}
        type="button"
        data-pet-dock
        aria-label={label}
        onClick={() => petRef.current?.toggleDock()}
        className="group fixed right-3 bottom-3 z-[2147482999] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70"
        style={{ width: dock.w, height: dock.h }}
      >
        <img
          src={dock.src}
          alt=""
          width={dock.w}
          height={dock.h}
          draggable={false}
          className={`block select-none ${docked ? "pet-dock-charging" : "pet-dock-empty"}`}
        />
        <span
          role="tooltip"
          className="pointer-events-none absolute right-0 bottom-full mb-1.5 translate-y-1 whitespace-nowrap rounded-full bg-neutral-900 px-2.5 py-1 font-sans text-[11px] font-medium text-white opacity-0 shadow-sm transition duration-150 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-white dark:text-neutral-900"
        >
          {docked ? "⚡ " : ""}
          {label}
        </span>
      </button>
    </>
  );
}
