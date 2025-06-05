import './ProgressBar.css'
import AnimatedNumber from './AnimatedNumber'
import { useEffect, useRef, useState } from 'react';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  },[value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

export default function ProgressBar({ progress }) {
    const percentage = `${(progress * 100).toFixed(1)}%`;
    var newVal = progress * 100;
    var oldVal = usePrevious(progress * 100);


    if (usePrevious(progress)) {
        console.log("updated!");
    }
    
    return (
        <>
        <div className="pbar-container">
            <div className="pbar-progress" style={{ width: percentage }}>
            </div>
        </div>
        <AnimatedNumber style={{ left: percentage }} className='pbar-text' from={oldVal} to={newVal} text="% "/>
        </>
    )
}
