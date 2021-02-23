import React, { useEffect } from "react";
import * as Tone from 'tone'

export default function Arpeggiator() {
    useEffect(() => {
      document.documentElement.addEventListener('mousedown', () => {
        if (Tone.context.state !== 'running') Tone.context.resume();
      });
          
    },[]);
  
    return (
      <React.Fragment>
        
      </React.Fragment>
    );
  }
