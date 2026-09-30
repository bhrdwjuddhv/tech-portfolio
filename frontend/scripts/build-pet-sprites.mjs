// Turns the raw AI-generated pet sheets in public/pet/*.webp into small, evenly
// spaced sprite strips the cursor pet can play back without jitter.
//
//   npm run pet:sprites
//
// The raw sheets place frames at uneven spacing and put the robot's "ground"
// at different heights per sheet. For every frame this script:
//   1. finds the frame's columns (splits at the emptiest columns),
//   2. finds where the treads touch the ground (lowest well-filled row),
//   3. centres the frame horizontally on its treads,
// then scales every sheet by the SAME factor and writes strips where each frame
// sits in a fixed-size cell with a shared anchor point (treads centre, ground).
// The charging dock (dock.webp) is cropped and scaled to DOCK.cssWidth.
// Output: public/pet/sprites/<name>.webp + src/components/Pet/sprites.json
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const SRC = "public/pet";
const OUT = "public/pet/sprites";
const MANIFEST = "src/components/Pet/sprites.json";

// name -> [source file, frame count]
const SHEETS = {
  idle: ["idle.webp", 4],
  walk: ["walk.webp", 4],
  run: ["run.webp", 4],
  look: ["look-toward-cursor.webp", 4],
  sleep: ["sleep.webp", 3],
  happy: ["happy.webp", 4],
  teleportOut: ["teleportanimation.webp", 4],
  teleportIn: ["teleportarrival.webp", 4],
};

// slot = where the robot's feet (tread centre, ground) sit in the dock, in dock.webp source px.
// Found by overlaying the idle frame on the dock; nudge it if the dock art changes.
const DOCK = { file: "dock.webp", cssWidth: 76, slot: { x: 765, y: 885 } };

const ROBOT_CSS_HEIGHT = 46; // on-screen height of the robot (idle pose), in CSS px
const DENSITY = 2; // strips are rendered at 2x: crisp on 1x-2x screens (touch devices, often 3x, don't show the pet)
const SOLID = 64; // alpha at/above this counts as "character" for measuring
const HAZE = 12; // alpha below this is background-removal haze -> made fully transparent

async function load(file) {
  const { data, info } = await sharp(`${SRC}/${file}`)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < HAZE) data[i] = 0;
    else if (data[i] >= 248) data[i] = 255;
  }
  return { data, w: info.width, h: info.height };
}

const alphaAt = (img, x, y) => img.data[(y * img.w + x) * 4 + 3];

function columnMass(img) {
  const mass = new Float64Array(img.w);
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++) if (alphaAt(img, x, y) >= SOLID) mass[x]++;
  return mass;
}

// Split points: for each boundary, the emptiest column near the evenly-spaced guess.
function splitFrames(img, n) {
  const mass = columnMass(img);
  const cuts = [0];
  for (let k = 1; k < n; k++) {
    const guess = (k * img.w) / n;
    const lo = Math.round(guess - (0.35 * img.w) / n);
    const hi = Math.round(guess + (0.35 * img.w) / n);
    let best = lo;
    for (let x = lo; x <= hi; x++) if (mass[x] < mass[best]) best = x;
    // centre of the empty run containing `best`, so gaps split down the middle
    let a = best,
      b = best;
    while (a > lo && mass[a - 1] === mass[best]) a--;
    while (b < hi && mass[b + 1] === mass[best]) b++;
    cuts.push(Math.round((a + b) / 2));
  }
  cuts.push(img.w);
  return cuts.slice(0, -1).map((x0, i) => ({ x0, x1: cuts[i + 1] }));
}

// Per-frame measurements in source pixels.
function measure(img, { x0, x1 }) {
  const width = x1 - x0;
  let top = -1,
    bottom = -1;
  const rowFill = [];
  for (let y = 0; y < img.h; y++) {
    let c = 0;
    for (let x = x0; x < x1; x++) if (alphaAt(img, x, y) >= SOLID) c++;
    rowFill.push(c / width);
  }
  // ground = lowest row that's substantially filled (ignores stray particles below)
  for (let y = img.h - 1; y >= 0; y--)
    if (rowFill[y] > 0.15) {
      bottom = y;
      break;
    }
  for (let y = 0; y < img.h; y++)
    if (rowFill[y] > 0.02) {
      top = y;
      break;
    }

  // horizontal centre = alpha-weighted centroid of the tread band (bottom ~25% of the robot)
  const centroid = (y0, y1) => {
    let sum = 0,
      mass = 0;
    for (let y = Math.max(0, y0); y <= y1; y++)
      for (let x = x0; x < x1; x++) {
        const a = alphaAt(img, x, y);
        if (a >= SOLID) {
          sum += x * a;
          mass += a;
        }
      }
    return mass > 0 ? { cx: sum / mass, mass } : null;
  };
  const band =
    bottom >= 0 && top >= 0
      ? centroid(bottom - 0.25 * (bottom - top), bottom)
      : null;
  const cx =
    band && band.mass > 2000
      ? band.cx
      : (centroid(0, img.h - 1)?.cx ?? (x0 + x1) / 2);

  // tight content box (anything visible)
  let bx0 = x1,
    bx1 = x0,
    by0 = img.h,
    by1 = 0;
  for (let y = 0; y < img.h; y++)
    for (let x = x0; x < x1; x++)
      if (alphaAt(img, x, y) > 0) {
        if (x < bx0) bx0 = x;
        if (x > bx1) bx1 = x;
        if (y < by0) by0 = y;
        if (y > by1) by1 = y;
      }
  return {
    top,
    bottom,
    cx,
    box: { x0: bx0, x1: bx1 + 1, y0: by0, y1: by1 + 1 },
  };
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

const sheets = {};
for (const [name, [file, count]] of Object.entries(SHEETS)) {
  const img = await load(file);
  const frames = splitFrames(img, count).map((f) => ({
    ...f,
    ...measure(img, f),
  }));
  // One ground line per sheet (the lowest tread row), so in-sheet hops/bounces survive
  // while every sheet ends up standing on the same line.
  const ground = Math.max(
    ...frames.filter((f) => f.bottom >= 0).map((f) => f.bottom),
  );
  sheets[name] = { file, img, frames, ground };
}

// One scale for every sheet, from the idle robot's height.
const idleHeights = sheets.idle.frames.map((f) => f.bottom - f.top);
const scale = (ROBOT_CSS_HEIGHT * DENSITY) / median(idleHeights);

// Cell = union of all frames' content, relative to the anchor (tread centre, ground).
let left = 0,
  right = 0,
  up = 0,
  down = 0;
for (const { frames, ground } of Object.values(sheets))
  for (const f of frames) {
    left = Math.max(left, f.cx - f.box.x0);
    right = Math.max(right, f.box.x1 - f.cx);
    up = Math.max(up, ground - f.box.y0);
    down = Math.max(down, f.box.y1 - ground);
  }
// Everything rounded up to whole CSS pixels (multiples of DENSITY) so frames land on the pixel grid.
const toGrid = (px) => Math.ceil(px / DENSITY) * DENSITY;
const halfW = toGrid(Math.max(left, right) * scale + 2); // symmetric, so flipping keeps the anchor
const anchor = { x: halfW, y: toGrid(up * scale + 2) };
const cell = { w: halfW * 2, h: anchor.y + toGrid(down * scale + 2) };

await mkdir(OUT, { recursive: true });
const manifest = {
  density: DENSITY,
  cell: { w: cell.w / DENSITY, h: cell.h / DENSITY },
  anchor: { x: anchor.x / DENSITY, y: anchor.y / DENSITY },
  sheets: {},
};

for (const [name, { img, frames, ground }] of Object.entries(sheets)) {
  const layers = [];
  for (const [i, f] of frames.entries()) {
    const { x0, x1, y0, y1 } = f.box;
    const w = x1 - x0,
      h = y1 - y0;
    const sw = Math.max(1, Math.round(w * scale)),
      sh = Math.max(1, Math.round(h * scale));
    const crop = await sharp(img.data, {
      raw: { width: img.w, height: img.h, channels: 4 },
    })
      .extract({ left: x0, top: y0, width: w, height: h })
      .resize(sw, sh, { kernel: "lanczos3" })
      .png()
      .toBuffer();
    layers.push({
      input: crop,
      left: i * cell.w + Math.round(anchor.x - (f.cx - x0) * scale),
      top: Math.round(anchor.y - (ground - y0) * scale),
    });
  }
  await sharp({
    create: {
      width: cell.w * frames.length,
      height: cell.h,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(layers)
    .webp({ quality: 92, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(`${OUT}/${name}.webp`);
  manifest.sheets[name] = {
    src: `/pet/sprites/${name}.webp`,
    frames: frames.length,
  };
  console.log(
    `${name.padEnd(12)} frames at x=${frames.map((f) => f.x0).join(",")}  ground=${ground}`,
  );
}

{
  const img = await load(DOCK.file);
  let x0 = img.w,
    x1 = 0,
    y0 = img.h,
    y1 = 0;
  for (let y = 0; y < img.h; y++)
    for (let x = 0; x < img.w; x++)
      if (alphaAt(img, x, y) > 0) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  const w = x1 - x0 + 1,
    h = y1 - y0 + 1;
  const outW = DOCK.cssWidth * DENSITY;
  const outH = Math.round((h * outW) / w / DENSITY) * DENSITY;
  const s = outW / w;
  await sharp(img.data, { raw: { width: img.w, height: img.h, channels: 4 } })
    .extract({ left: x0, top: y0, width: w, height: h })
    .resize(outW, outH, { kernel: "lanczos3", fit: "fill" })
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toFile(`${OUT}/dock.webp`);
  manifest.dock = {
    src: "/pet/sprites/dock.webp",
    w: DOCK.cssWidth,
    h: outH / DENSITY,
    slot: {
      x: Math.round(((DOCK.slot.x - x0) * s) / DENSITY),
      y: Math.round(((DOCK.slot.y - y0) * s) / DENSITY),
    },
  };
  console.log("dock", manifest.dock);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `cell ${manifest.cell.w}x${manifest.cell.h} css px, anchor`,
  manifest.anchor,
  `-> ${OUT}, ${MANIFEST}`,
);
