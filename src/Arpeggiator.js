import React, { useEffect, useState } from "react";
import * as Tone from 'tone'

export default function Arpeggiator() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    document.documentElement.addEventListener('mousedown', () => {
      if (Tone.context.state !== 'running') Tone.context.resume();
    });

    document.documentElement.addEventListener('mousedown', () => {
      if (started) return;
      setStarted(true);
    
      const $inputs = document.querySelectorAll('input'),
            chords = [
              'A0 C1 E1', 'F0 A0 C1', 'G0 B0 D1',
              'D0 F0 A0', 'E0 G0 B0'
            ].map(formatChords);
      console.log(chords);
      var chordIdx = 0,
          step = 0;
    
      const synth = new Tone.Synth();
      const gain = new Tone.Gain(0.7);
      synth.oscillator.type = 'sine';
      gain.toDestination();
      synth.connect(gain);
    
      Array.from($inputs).forEach($input => {
        $input.addEventListener('change', () => {
          if ($input.checked) handleChord($input.value);
        })
      });
    
      function handleChord(valueString) {
        chordIdx = parseInt(valueString) - 1;
      }
    
      Tone.Transport.scheduleRepeat(onRepeat, '16n');
      Tone.Transport.start();
      Tone.Transport.bpm.value = 90;
    
      function onRepeat(time) {
        let chord = chords[chordIdx],
            note = chord[step % chord.length];
        synth.triggerAttackRelease(note, '16n', time);
        step++;
      }
    
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
    });
  });

  return (
    <React.Fragment>
      
    </React.Fragment>
  );
}
