import React, { useEffect, useState } from "react";
import * as Tone from 'tone'

export default function Arpeggiator() {

  // DOWN THE LINE THIS WILL MAKE THINGS EASIER
  function formatChords(chordString) {
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

  const [chordNum, setChordNum] = useState(0);
  const [loopid, setLoopid] = useState(0);
  
  useEffect(() => {

    console.log('chord:', chordNum);

    const $inputs = document.querySelectorAll('input'),
    chords = [
      'A0 C1 E1', 'F0 A0 C1', 'G0 B0 D1',
      'D0 F0 A0', 'E0 G0 B0'
    ].map(formatChords);
      
    let chordIdx = 0,
        step = 0;
  
    const synth = new Tone.Synth();
    const gain = new Tone.Gain(0.7);
    synth.oscillator.type = 'triangle';
    gain.toDestination();
    synth.connect(gain);
  
    Array.from($inputs).forEach($input => {
      $input.addEventListener('change', () => {
        // console.log('$input.value:', $input.value);
        if ($input.checked) handleChord($input.value);
      })
    });
  
    function handleChord(valueString) {
      chordIdx = parseInt(valueString) - 1;
      setChordNum(chordIdx);
    }
  
    function onRepeat(time) {
      //この関数の実行開始からの経過時間を引数に持つ
      let chord = chords[chordNum],
          note = chord[step % chord.length];
      synth.triggerAttackRelease(note, '16n', time);
      step++;
    }

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

  },
  [chordNum]
  );

  return (
    <React.Fragment>
      <input id="chord-1" value="1" type="radio" name="chord" />
      <input id="chord-2" value="2" type="radio" name="chord" />
      <input id="chord-3" value="3" type="radio" name="chord" />
      <input id="chord-4" value="4" type="radio" name="chord" />
      <input id="chord-5" value="5" type="radio" name="chord" />
    </React.Fragment>
  );
}
