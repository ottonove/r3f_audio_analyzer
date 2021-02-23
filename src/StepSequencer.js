import React, { useEffect } from "react";
import * as Tone from 'tone'

export default function StepSequencer() {
    useEffect(() => {
      document.documentElement.addEventListener('mousedown', () => {
        if (Tone.context.state !== 'running') Tone.context.resume();
      });
        
      const synths = [
        new Tone.Synth(),
        new Tone.Synth(),
        new Tone.Synth()
      ];
      
      synths[0].oscillator.type = 'triangle';
      synths[1].oscillator.type = 'sine';
      synths[2].oscillator.type = 'sawtooth';
      
      const gain = new Tone.Gain(0.6);
      gain.toMaster();
      
      synths.forEach(synth => synth.connect(gain));
      
      const $rows = document.body.querySelectorAll('.seq'),
            notes = ['G5', 'E4', 'C3'];
      let index = 0;
      
      Tone.Transport.scheduleRepeat(loop, '8n');
      Tone.Transport.start();
      
      function loop(time) {
        let step = index % 8;
        for (let i = 0; i < $rows.length; i++) {
          let synth = synths[i],
              note = notes[i],
              $row = $rows[i],
              $input = $row.querySelector(`input:nth-child(${step + 1})`);
          if ($input.checked) {
            console.log('$rows:',$rows);
            console.log('i:',i);
            console.log(synth.oscillator.type);
            synth.triggerAttackRelease(note, '8n', time);
          }
        }
        index++;
      }
  
    },[]);
  
    return (
      <React.Fragment>
        <div className="seq">
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
        </div>
        <div  className="seq">
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
        </div>
        <div  className="seq">
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
          <input type="checkbox" />
        </div>
      </React.Fragment>
    );
  }
