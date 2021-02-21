import * as THREE from "three";
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Sphere, PositionalAudio, OrbitControls } from "@react-three/drei";
import { Sampler } from "tone";
// import A1 from "../public/sounds/001-sibutomo.mp3";
// import A1 from "./001-sibutomo.mp3";
import A1 from "./cat2.wav";
import * as Tone from 'tone'


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
  // const sampler = useRef(null);

  useEffect(() => {
    /* sampler.current = new Sampler(
      { A1 },
      {
        onload: () => {
          // setLoaded(true);
          sampler.current.triggerAttack("A1");
        }
      }
    ).toDestination(); */
    //BPM
    Tone.Transport.bpm.value = 240;

    //シンセサイザーインスタンス
    const melody_synth = new Tone.Synth().toDestination();

    // 楽譜データ
    const melody_score = [
      //note(音名) nullは休符
      [{ note: "C5" }, { note: "C5" }],
      [{ note: "C5" }, { note: "C5" }],
      [null, null],
      [{ note: "G#4" }, null],
      [null, { note: "A#4" }],
      [null, null],
      [{ note: "C5" }, null],
      [{ note: "A#4" }, { note: "C5" }],
    ];

    //シーケンサーインスタンス
    const melody_sequence = new Tone.Sequence(
      (time, { note }) => {
        melody_synth.triggerAttackRelease(note);
      },
      melody_score,
      "3n"
    ).start();

    //演奏のリピートをfalseに
    melody_sequence.loop = false;

    //シンセサイザーインスタンス
    // const bass_synth = new Tone.Synth().toDestination();

    // 楽譜データ
    // const bass_score = [
    //   //note(音名) nullは休符
    //   [{ note: "C5" }, { note: "B4" }],
    //   [{ note: "A#4" }, { note: "A4" }],
    //   [null, { note: "G4" }],
    //   [null, { note: "A#4" }],
    //   [null, { note: "A4" }]
    // ];

    //シーケンサーインスタンス
    // const bass_sequence = new Tone.Sequence(
    //   (time, { note }) => {
    //     bass_synth.triggerAttackRelease(note);
    //   },
    //   bass_score,
    //   "4n"
    // ).start();

    //演奏のリピートをfalseに
    // bass_sequence.loop = false;
  },[]);

  // const handleClick = () => sampler.current.triggerAttack("A1");
  const handleClick = () => {
    Tone.context.resume()
      .then(() => {
        console.log(Tone.context.state);
        Tone.Transport.start();
      });
  }

  return (
    <div>
      <button onClick={handleClick}>start</button>
    </div>
  );
}

export default function App() {
  return (
    <ToneSampler />
  );
}
