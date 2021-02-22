import React, { useEffect } from "react";
import * as Tone from 'tone'

export default function StepSequencer() {
    useEffect(() => {
      Tone.Transport.bpm.value = 180;
  
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
        [{ note: "A#4" }, { note: "C5" }]
      ];
  
      //シーケンサーインスタンス
      const melody_sequence = new Tone.Sequence(
        (time, { note }) => {
          melody_synth.triggerAttackRelease(note);
        },
        melody_score,
        "4n"
      ).start();
  
      //演奏のリピートをfalseに
      melody_sequence.loop = false;
  
    },[]);
  
    const musicStart = () => {
      if(Tone.context.state === 'suspended') {
        Tone.context.resume()
        .then(() => {
          Tone.Transport.start();
        });
      } else {
        Tone.Transport.start();
      }
    }
  
    const musicStop = () => {
      Tone.Transport.stop();
    }
  
    return (
      <div>
        <button onClick={musicStart}>start</button>
        <button onClick={musicStop}>stop</button>
      </div>
    );
  }