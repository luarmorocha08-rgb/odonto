"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

function Environment() {
  const gl = useThree((state) => state.gl);
  const texture = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return env;
  }, [gl]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <primitive object={texture} attach="environment" />;
}

function Pearl() {
  const mesh = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Mesh>(null);

  useFrame(({ clock, pointer }, delta) => {
    const t = clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.position.y = Math.sin(t * 0.8) * 0.08;
      // Acompanha o cursor de forma muito sutil
      mesh.current.rotation.y = THREE.MathUtils.damp(mesh.current.rotation.y, pointer.x * 0.5 + t * 0.15, 2, delta);
      mesh.current.rotation.x = THREE.MathUtils.damp(mesh.current.rotation.x, -pointer.y * 0.3, 2, delta);
    }
    if (orbit.current) orbit.current.rotation.z = t * 0.12;
  });

  return (
    <group>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial
          color="#F4EDEA"
          roughness={0.16}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
          sheen={1}
          sheenColor="#D8CBC6"
          sheenRoughness={0.4}
          iridescence={0.45}
          iridescenceIOR={1.35}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh ref={orbit} rotation={[1.25, 0.2, 0]}>
        <torusGeometry args={[1.65, 0.004, 8, 200]} />
        <meshBasicMaterial color="#6F5D59" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

/** Pérola 3D decorativa — símbolo do sorriso e do cuidado delicado. */
export default function PearlScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.4], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <Environment />
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff6f2" />
      <pointLight position={[-3, -2, 2]} intensity={6} color="#a18d89" />
      <Pearl />
    </Canvas>
  );
}
