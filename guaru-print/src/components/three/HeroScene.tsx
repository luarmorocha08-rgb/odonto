"use client";
/* eslint-disable react-hooks/immutability, react-hooks/purity -- buffers do three.js são gerados e mutados quadro a quadro, fora do ciclo de render do React */

import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * "Da ideia à impressão" — cena do hero.
 *
 * 1. Partículas ciano/magenta/amarelo flutuam no escuro.
 * 2. Elas convergem e desenham o letreiro "GUARU PRINT".
 * 3. Uma placa luminosa (ACM + acrílico) surge atrás, com reflexos de
 *    estúdio (Lightformers locais — nenhum HDR externo é baixado).
 * 4. A câmera se aproxima e a cena passa a reagir ao mouse.
 *
 * Toda a sequência dura ~3,2 s, mas o conteúdo da página já está acessível
 * desde o primeiro quadro (o texto não depende da cena).
 */

const CMY = [new THREE.Color("#00AEEF"), new THREE.Color("#E52B91"), new THREE.Color("#F7E500")];
const SIGN_W = 5.2;
const SIGN_H = 1.9;

/** Família real da Montserrat carregada pelo next/font. */
function displayFont() {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-montserrat").trim();
  return family || "Montserrat";
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Amostra pontos de um texto desenhado em canvas 2D → posições 3D. */
function sampleText(count: number) {
  const canvas = document.createElement("canvas");
  const w = 520;
  const h = 190;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 800 92px ${displayFont()}, Arial Black, sans-serif`;
  ctx.fillText("GUARU", w / 2, h * 0.3);
  ctx.fillText("PRINT", w / 2, h * 0.76);
  const data = ctx.getImageData(0, 0, w, h).data;
  const filled: [number, number][] = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) filled.push([x, y]);
    }
  }
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y] = filled[Math.floor(Math.random() * filled.length)] ?? [w / 2, h / 2];
    out[i * 3] = (x / w - 0.5) * SIGN_W * 0.86;
    out[i * 3 + 1] = -(y / h - 0.5) * SIGN_H * 0.8;
    out[i * 3 + 2] = 0.16 + Math.random() * 0.04;
  }
  return out;
}

/** Textura do letreiro (letras-caixa iluminadas sobre ACM). */
function makeSignTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 374;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#151519");
  g.addColorStop(1, "#060608");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `italic 800 150px ${displayFont()}, Arial Black, sans-serif`;
  ctx.shadowColor = "rgba(255,255,255,0.85)";
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("GUARU", canvas.width / 2, canvas.height * 0.3);
  ctx.fillText("PRINT", canvas.width / 2, canvas.height * 0.76);
  // Gotas CMY da marca
  const drops: [string, number, number, number][] = [
    ["#00AEEF", 0.86, 0.17, 34],
    ["#E52B91", 0.9, 0.12, 28],
    ["#F7E500", 0.895, 0.25, 28],
  ];
  ctx.globalCompositeOperation = "screen";
  for (const [c, x, y, r] of drops) {
    ctx.shadowColor = c;
    ctx.shadowBlur = 24;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(canvas.width * x, canvas.height * y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function Particles({ count, progress }: { count: number; progress: React.RefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const { start, target, colors, seeds } = useMemo(() => {
    const start = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      start[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      start[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      start[i * 3 + 2] = r * Math.cos(phi) - 2;
      const c = CMY[i % 3];
      colors.set([c.r, c.g, c.b], i * 3);
      seeds[i] = Math.random();
    }
    return { start, target: sampleText(count), colors, seeds };
  }, [count]);

  const positions = useMemo(() => start.slice(), [start]);

  const settled = useRef(false);

  useFrame(({ clock }) => {
    const geo = points.current?.geometry;
    if (!geo || settled.current) return;
    const p = progress.current ?? 0;
    if (p >= 1) settled.current = true;
    const t = clock.elapsedTime;
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      // Cada partícula chega num momento ligeiramente diferente (movimento orgânico).
      const local = easeInOut(THREE.MathUtils.clamp((p - seeds[i] * 0.35) / 0.65, 0, 1));
      const wobble = (1 - local) * 0.25;
      const ix = i * 3;
      positions[ix] = THREE.MathUtils.lerp(start[ix], target[ix], local) + Math.sin(t * 0.7 + i) * wobble;
      positions[ix + 1] = THREE.MathUtils.lerp(start[ix + 1], target[ix + 1], local) + Math.cos(t * 0.6 + i * 1.3) * wobble;
      positions[ix + 2] = THREE.MathUtils.lerp(start[ix + 2], target[ix + 2], local);
    }
    attr.array.set(positions);
    attr.needsUpdate = true;
    const mat = points.current!.material as THREE.PointsMaterial;
    // Quando a placa acende, as partículas viram "brilho" e somem.
    mat.opacity = p < 0.8 ? 1 : 1 - ((p - 0.8) / 0.2) * 0.85;
    mat.size = THREE.MathUtils.lerp(0.055, 0.03, p);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation size={0.05} />
    </points>
  );
}

function Sign({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const face = useRef<THREE.MeshStandardMaterial>(null);
  const body = useRef<THREE.MeshPhysicalMaterial>(null);
  const glow = useRef<THREE.PointLight>(null);
  const texture = useMemo(() => makeSignTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    const p = progress.current ?? 0;
    const reveal = THREE.MathUtils.clamp((p - 0.62) / 0.38, 0, 1);
    const e = easeInOut(reveal);
    if (group.current) {
      group.current.scale.setScalar(0.92 + e * 0.08);
      group.current.visible = reveal > 0;
    }
    if (face.current) {
      face.current.opacity = e;
      face.current.emissiveIntensity = e * 0.75;
    }
    if (body.current) body.current.opacity = e;
    if (glow.current) glow.current.intensity = e * 6;
  });

  return (
    <group ref={group} visible={false}>
      <RoundedBox args={[SIGN_W + 0.3, SIGN_H + 0.3, 0.22]} radius={0.06} smoothness={4} position={[0, 0, -0.02]}>
        <meshPhysicalMaterial ref={body} color="#1a1a1f" metalness={0.9} roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} transparent opacity={0} />
      </RoundedBox>
      <mesh position={[0, 0, 0.095]}>
        <planeGeometry args={[SIGN_W, SIGN_H]} />
        <meshStandardMaterial ref={face} map={texture} emissiveMap={texture} emissive="#ffffff" emissiveIntensity={0} roughness={0.35} metalness={0.1} transparent opacity={0} />
      </mesh>
      {/* Lâmina de acrílico com reflexo */}
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[SIGN_W, SIGN_H]} />
        <meshPhysicalMaterial transparent opacity={0.12} roughness={0.05} metalness={0} clearcoat={1} color="#ffffff" />
      </mesh>
      <pointLight ref={glow} position={[0, 0, 1.2]} color="#ffffff" intensity={0} distance={6} />
      {/* Fixações */}
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * (SIGN_W / 2 - 0.2), SIGN_H / 2 + 0.55, -0.2]}>
          <cylinderGeometry args={[0.018, 0.018, 1.1, 8]} />
          <meshStandardMaterial color="#3a3a44" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Rig({ progress, pointer }: { progress: React.RefObject<number>; pointer: React.RefObject<{ x: number; y: number }> }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, delta) => {
    const p = progress.current ?? 0;
    const m = pointer.current ?? { x: 0, y: 0 };
    // Câmera: começa afastada e "revela" o resultado.
    const z = THREE.MathUtils.lerp(12, 8.4, easeInOut(p));
    target.set(m.x * 0.9, m.y * 0.5 + 0.1, z);
    camera.position.lerp(target, 1 - Math.pow(0.001, delta));
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene({ count, pointer, reduced }: { count: number; pointer: React.RefObject<{ x: number; y: number }>; reduced: boolean }) {
  const progress = useRef(reduced ? 1 : 0);
  const tilt = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!reduced) progress.current = Math.min(1, progress.current + delta / 3.2);
    if (tilt.current) {
      const m = pointer.current ?? { x: 0, y: 0 };
      tilt.current.rotation.y = THREE.MathUtils.lerp(tilt.current.rotation.y, m.x * 0.35, 0.06);
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, -m.y * 0.18, 0.06);
      tilt.current.position.y = reduced ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.06;
    }
  });
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[-4, -1, 3]} intensity={18} color="#00AEEF" distance={12} />
      <pointLight position={[4, 1.5, 2]} intensity={14} color="#E52B91" distance={12} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 1.2, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[4, 6, 1]} color="#00AEEF" />
        <Lightformer form="rect" intensity={2.5} position={[5, 0, 2]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} color="#E52B91" />
        <Lightformer form="ring" intensity={1.5} position={[0, -3, 3]} scale={2} color="#F7E500" />
      </Environment>
      <group ref={tilt}>
        <Particles count={count} progress={progress} />
        <Sign progress={progress} />
      </group>
      <Rig progress={progress} pointer={pointer} />
    </>
  );
}

export default function HeroScene({ quality, reduced, active }: { quality: "high" | "low"; reduced: boolean; active: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced]);

  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 12], fov: 40 }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <Scene count={quality === "high" ? 4200 : 1600} pointer={pointer} reduced={reduced} />
    </Canvas>
  );
}
