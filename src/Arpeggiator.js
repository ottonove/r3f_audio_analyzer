import React, { useEffect, useState } from "react";
import * as Tone from 'tone'

export default function Arpeggiator() {

  const synth = new Tone.Synth();
  const gain = new Tone.Gain(0.7);
  synth.oscillator.type = 'triangle';
  gain.toDestination();
  synth.connect(gain);
  Tone.Transport.bpm.value = 90;

  const formatChords = (chordString) => {
    let chord = chordString.split(' ');
    let arr = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < chord.length; j++) {
        let noteOct = chord[j].split(''),
            note = noteOct[0];
        let oct = (noteOct[1] === '0') ? i + 4 : i + 5;
        note += oct;
        arr.push(note);
      }
    }
    return arr;
  }

  const chords = [
    'A0 C1 E1',
    'F0 A0 C1',
    'G0 B0 D1',
    'D0 F0 A0',
    'E0 G0 B0'
  ].map(formatChords);

  const handleChord = (event) => {
    chordIdx = parseInt(event.target.value) - 1;
    setChordNum(chordIdx);
  }

  const [chordNum, setChordNum] = useState(0);

  let chordIdx = 0
  let step = 0;

  useEffect(() => {
    const onRepeat = (time) =>{
      //この関数の実行開始からの経過時間を引数に持つ
      let chord = chords[chordNum],
          note = chord[step % chord.length];
      synth.triggerAttackRelease(note, '16n', time);
      step++;
    }
    Tone.Transport.cancel();
    Tone.Transport.scheduleRepeat(onRepeat, '16n');
    Tone.Transport.start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chordNum]);

  return (
    <>
      {[1,2,3,4,5].map((num, index) => (
        <input
          value={num}
          key={index}
          type="radio"
          name="chord"
          onChange={handleChord}
        />  
      ))}
    </>
  );
}
