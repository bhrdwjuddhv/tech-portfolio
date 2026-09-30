import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Replace with your image
// Served from /public. Update the size if you swap the image.
const cravingImg = { src: "/craving.png", width: 229, height: 229 };

const WIDTH = 320; // sticker width in px (height follows the image ratio)
const HEIGHT = Math.round((WIDTH * cravingImg.height) / cravingImg.width);

// The canvas is larger than the sticker so the ball can bulge past its edges
const CANVAS_W = Math.round(WIDTH * 1.5);
const CANVAS_H = Math.round(HEIGHT * 1.5);

const SEGMENTS = 160; // mesh density: more = finer creases, slower

const L = Math.sqrt(WIDTH * HEIGHT);
const BALL_RADIUS = 0.17 * L; // size of the crumpled ball (smaller = tighter ball)
const CRUMPLE_DEPTH = 0.15 * BALL_RADIUS; // how deep / sharp the creases are

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const NOISE = /* glsl */ `
// Simplex noise 3D (Ashima Arts / Ian McEwan, MIT)
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
   +i.y+vec4(0.0,i1.y,i2.y,1.0))
   +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float ridge(float n){ return pow(max(1.0-abs(n),0.0),1.7); }
`;

const VERTEX = /* glsl */ `
${NOISE}
uniform float uProgress;   // 0 = flat sheet, 1 = crumpled ball
uniform vec2  uSize;
uniform float uRadius;
uniform float uDepth;

varying vec2  vUv;
varying vec3  vView;
varying float vLocal;
varying float vF;
varying float vN;
varying float vFlip;

void main(){
  vec3 p = position;
  float L = sqrt(uSize.x * uSize.y);
  float rmax = 0.5 * length(uSize);
  float r = length(p.xy) / rmax;            // 0 at the centre, 1 at the corners

  // The centre crumples first, the edges follow
  const float SPREAD = 1.1;
  float local = clamp(uProgress * (1.0 + SPREAD) - r * SPREAD, 0.0, 1.0);
  float e = local * local * (3.0 - 2.0 * local);

  // Creases live in paper coordinates, so they stay attached to the paper
  vec3 q = vec3(p.xy / L, 3.7);
  float n1 = snoise(q * 2.4);
  float n2 = snoise(q * 5.2  + 7.0);
  float n3 = snoise(q * 11.0 + 13.0);
  float n4 = snoise(q * 21.0 + 19.0);
  float F = 0.5*ridge(n1) + 0.3*ridge(n2) + 0.15*ridge(n3) + 0.05*ridge(n4);

  // Patches of paper that get folded over and show their white back.
  // Fixed to the paper (like the creases) and only appear as it crumples.
  float flip = smoothstep(0.05, 0.30, snoise(q * 3.1 + 31.0));

  // Where this piece of paper ends up on the ball (centre → front, edges → back)
  vec2 d = p.xy / max(length(p.xy), 1e-4);
  float th = r * 3.0159;
  vec3 dir = vec3(sin(th) * d, cos(th));

  // Flat sheet only wrinkles mid-transition
  // Paper contracts in-plane while it wrinkles, so it visibly gets smaller
  vec3 flatP = vec3(p.xy * (1.0 - 0.3 * local),
                    (F - 0.45) * uDepth * sin(3.14159 * local) * 0.8);
  // Folded-over flaps stick out a little from the ball
  vec3 ballP = dir * (uRadius + (F - 0.45) * uDepth + flip * 0.22 * uRadius);
  vec3 pos = mix(flatP, ballP, e);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = mv.xyz;
  vUv = uv;
  vLocal = local;
  vF = F;
  vN = n1;
  vFlip = flip;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uTex;

varying vec2  vUv;
varying vec3  vView;
varying float vLocal;
varying float vF;
varying float vN;
varying float vFlip;

void main(){
  vec4 tex = texture2D(uTex, vUv);
  if (tex.a < 0.02) discard;

  // Per-facet normal → sharp, paper-like folds
  vec3 n = normalize(cross(dFdx(vView), dFdy(vView)));
  if (n.z < 0.0) n = -n;

  vec3 Ldir = normalize(vec3(-0.45, 0.65, 0.75));
  vec3 V = normalize(-vView);
  vec3 H = normalize(Ldir + V);

  float diff = max(dot(n, Ldir), 0.0);
  float spec = pow(max(dot(n, H), 0.0), 40.0) * 0.10;

  // Ambient occlusion in the valleys + a faint dark line along each crease
  float ao   = mix(1.0, 0.68 + 0.32 * vF, vLocal);
  float line = 1.0 - 0.16 * (1.0 - smoothstep(0.0, 0.05, abs(vN))) * vLocal;
  float lit  = (0.52 + 0.55 * diff) * ao * line;

  // Flat paper stays exactly as bright as the original image
  float amount = smoothstep(0.0, 0.2, vLocal);
  float shade  = mix(1.0, lit, amount);

  // The artwork is printed on one side only: wherever the paper is folded
  // over (or seen from behind) you see plain white paper
  float folded = vFlip * smoothstep(0.25, 0.6, vLocal);   // only once it is crumpling
  float back = gl_FrontFacing ? smoothstep(0.30, 0.40, folded) : 1.0;
  vec3 base = mix(tex.rgb, vec3(0.97, 0.97, 0.96), back);

  vec3 col = base * shade + spec * amount;
  gl_FragColor = vec4(col * tex.a, tex.a);
}
`;

const Dragable_Stickers = () => {
  const [origin, setOrigin] = useState("50% 50%");
  const hostRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 0 = flat, 1 = crumpled. One spring drives the whole transformation.
  const crumple = useSpring(0, { stiffness: 90, damping: 16, mass: 0.9 });

  // Drag deformation from your original
  // const rotate = useTransform(x, [-300, 0, 300], [-8, 0, 8]);
  const skewX = useTransform(x, [-300, 0, 300], [-4, 0, 4]);
  const scaleX = useTransform(x, [-300, 0, 300], [0.94, 1, 0.94]);
  const scaleY = useTransform(y, [-300, 0, 300], [0.96, 1, 0.96]);

  // Drag speed makes the paper (and ball) tilt in 3D
  const vx = useVelocity(x);
  const vy = useVelocity(y);
  const tiltY = useSpring(useTransform(vx, [-2500, 2500], [-0.9, 0.9]), {
    stiffness: 120,
    damping: 14,
  });
  const tiltX = useSpring(useTransform(vy, [-2500, 2500], [0.9, -0.9]), {
    stiffness: 120,
    damping: 14,
  });

  const shadow = useTransform(crumple, (v) => {
    const k = clamp01(v);
    return `drop-shadow(0 ${4 + k * 14}px ${8 + k * 14}px rgba(0,0,0,${0.15 + k * 0.15}))`;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(CANVAS_W, CANVAS_H);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // Camera distance chosen so the flat sheet is exactly WIDTH × HEIGHT px
    const fov = 30;
    const camera = new THREE.PerspectiveCamera(
      fov,
      CANVAS_W / CANVAS_H,
      10,
      5000,
    );
    camera.position.z =
      CANVAS_H / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2));

    const scene = new THREE.Scene();

    const uniforms = {
      uProgress: { value: 0 },
      uSize: { value: new THREE.Vector2(WIDTH, HEIGHT) },
      uRadius: { value: BALL_RADIUS },
      uDepth: { value: CRUMPLE_DEPTH },
      uTex: { value: null },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      side: THREE.DoubleSide,
      transparent: true,
      premultipliedAlpha: true,
    });

    const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, SEGMENTS, SEGMENTS);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    scene.add(mesh);

    let dirty = true;
    let raf = 0;

    const texture = new THREE.TextureLoader().load(cravingImg.src, (tex) => {
      tex.colorSpace = THREE.NoColorSpace; // keep the artwork's colours untouched
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.uTex.value = tex;
      mesh.visible = true;
      dirty = true;
    });

    const update = () => {
      const p = crumple.get();
      const k = clamp01(p);
      uniforms.uProgress.value = p;
      mesh.rotation.y = tiltY.get() * (0.25 + 0.75 * k) + k * 0.45;
      mesh.rotation.x = tiltX.get() * (0.25 + 0.75 * k) - k * 0.28;
      dirty = true;
    };

    const unsubs = [
      crumple.on("change", update),
      tiltX.on("change", update),
      tiltY.on("change", update),
    ];

    const tick = () => {
      if (dirty) {
        renderer.render(scene, camera);
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      unsubs.forEach((u) => u());
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [crumple, tiltX, tiltY]);

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${px}% ${py}%`);
  };

  return (
    <motion.div
      drag
      onDragStart={() => crumple.set(1)}
      onDragEnd={() => crumple.set(0)}
      onMouseEnter={handleMouseEnter}
      style={{
        x,
        y,
        skewX,
        scaleX,
        scaleY,
        transformOrigin: origin,
        width: WIDTH,
        height: HEIGHT,
        filter: shadow,
      }}
      whileHover={{ scale: 1.01 }}
      whileDrag={{ scale: 1.04 }}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 12 }}
      transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.6 }}
      className="relative cursor-grab touch-none select-none active:cursor-grabbing"
    >
      <div
        ref={hostRef}
        className="pointer-events-none absolute"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          left: -(CANVAS_W - WIDTH) / 2,
          top: -(CANVAS_H - HEIGHT) / 2,
        }}
      />
    </motion.div>
  );
};

export default Dragable_Stickers;
