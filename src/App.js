import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Sphere, PositionalAudio, OrbitControls } from "@react-three/drei";
import { Sampler } from "tone";
// import A1 from "../public/sounds/001-sibutomo.mp3";
// import A1 from "./001-sibutomo.mp3";
import A1 from "./cat2.wav";

function Analyzer({ sound }) {
  // <Analyzer /> will not run before everything else in the suspense block is resolved.
  // That means <PositionalAudio/>, which executes async, is ready by the time we're here.
  // The next frame (useEffect) is guaranteed(!) to access positional-audios ref.
  const mesh = useRef();
  const analyser = useRef();
  useEffect(
    () => void (analyser.current = new THREE.AudioAnalyser(sound.current, 32)),
    [sound]
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

function ToneSampler() {
  // const [isLoaded, setLoaded] = useState(false);
  const sampler = useRef(null);

  useEffect(() => {
    sampler.current = new Sampler(
      { A1 },
      {
        onload: () => {
          // setLoaded(true);
          sampler.current.triggerAttack("A1");
        }
      }
    ).toDestination();
  }, []);

  // const handleClick = () => sampler.current.triggerAttack("A1");

  return (
    <React.Fragment />
  );
}

export default function App() {
  return (
    <ToneSampler />
  );
}
