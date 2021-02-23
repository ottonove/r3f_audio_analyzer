import React, { useEffect, useState } from "react";
import * as Tone from 'tone'

export default function Arpeggiator() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    document.documentElement.addEventListener('mousedown', () => {
      if (started) return;

      setStarted(true);
    
      const $inputs = document.querySelectorAll('input'),
            chords = [
              'A0 C1 E1', 'F0 A0 C1', 'G0 B0 D1',
              'D0 F0 A0', 'E0 G0 B0'
            ].map(formatChords);
      console.log('コーズ:', chords);
      /*
      0: (6) ["A4", "C5", "E5", "A5", "C6", "E6"]
      1: (6) ["F4", "A4", "C5", "F5", "A5", "C6"]
      2: (6) ["G4", "B4", "D5", "G5", "B5", "D6"]
      3: (6) ["D4", "F4", "A4", "D5", "F5", "A5"]
      4: (6) ["E4", "G4", "B4", "E5", "G5", "B5"]
      */
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
    },{once:true});
  });

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
