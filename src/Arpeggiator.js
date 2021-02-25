import React, { useEffect, useState } from "react";
import * as Tone from 'tone'

export default function Arpeggiator() {

  const synth = new Tone.Synth();
  const gain = new Tone.Gain(0.7);
  synth.oscillator.type = 'triangle';
  gain.toDestination();
  synth.connect(gain);

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

  const chords =
      ['A0 C1 E1', 'F0 A0 C1', 'G0 B0 D1', 'D0 F0 A0', 'E0 G0 B0']
      .map(formatChords);

  const handleChord = (event) => {
    chordIdx = parseInt(event.target.value) - 1;
    setChordNum(chordIdx);
  }

  const onRepeat = (time) =>{
    //この関数の実行開始からの経過時間を引数に持つ
    let chord = chords[chordNum],
        note = chord[step % chord.length];
    synth.triggerAttackRelease(note, '16n', time);
    step++;
  }

  const [chordNum, setChordNum] = useState(0);
  const [loopid, setLoopid] = useState(0);

  let chordIdx = 0
  let step = 0;

  useEffect(() => {

    //const $inputs = document.querySelectorAll('input'),      
    

    // Tone.Transport.cancel();
    if(Tone.context.state === 'running') {
      console.log("running");
      Tone.Transport.clear(loopid);
    }
    
    console.log('chordIdx:',chordIdx);
    const id = Tone.Transport.scheduleRepeat(onRepeat, '16n');
    setLoopid(id);
    Tone.Transport.start();
    Tone.Transport.bpm.value = 90;

  }, [chordNum]);

  return (
    <>
      <input
        value="1"
        type="radio"
        name="chord"
        // eslint-disable-next-line no-undef
        onChange={handleChord}
      />
      <input
        value="2"
        type="radio"
        name="chord"
        // eslint-disable-next-line no-undef
        onChange={handleChord}
      />
    </>
  );
}
