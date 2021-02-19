import * as THREE from "three";
import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Sphere, PositionalAudio, OrbitControls } from "@react-three/drei";

function Analyzer({ sound }) {
  // <Analyzer /> will not run before everything else in the suspense block is resolved.
  // That means <PositionalAudio/>, which executes async, is ready by the time we're here.
  // The next frame (useEffect) is guaranteed(!) to access positional-audios ref.
  const mesh = useRef();
  const analyser = useRef();
  useEffect(
    () => void (analyser.current = new THREE.AudioAnalyser(sound.current, 32)),
    []
  );
  useFrame(() => {
    if (analyser.current) {
      const data = analyser.current.getAverageFrequency();
      mesh.current.material.color.setRGB(data / 100, 0, 0);
      mesh.current.scale.x = mesh.current.scale.y = mesh.current.scale.z =
        (data / 100) * 2;
    }
  });
  return (
    <Sphere ref={mesh} args={[1, 64, 64]}>
      <meshBasicMaterial />
    </Sphere>
  );
}

function PlaySound({ url }) {
  // This component creates a suspense block, blocking execution until
  // all async tasks (in this case PositionAudio) have been resolved.
  const sound = useRef();
  return (
    <Suspense fallback={null}>
      <PositionalAudio url={url} ref={sound} />
      <Analyzer sound={sound} />
    </Suspense>
  );
}

export default function App() {
  return (
    <Canvas concurrent camera={{ position: [0, 0, 5], far: 50 }}>
      <PlaySound url="sounds/2.mp3" />
      <OrbitControls />
    </Canvas>
  );
}
