import React, { useEffect, useState } from "react";

const Counter = () => {
  const [ count, setCount ] = useState(0);

  // 偶数の時にlogを出力したい
  const outputEvenNumber = () => {
    /* if (count % 2 === 0) {
      console.log(count);
    } */
    console.log(count);
  };

  const hoge = () => {
    console.log(count);
  }

  useEffect(
    () => {
      outputEvenNumber();
    },
    [hoge, outputEvenNumber]
  );

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>カウント</button>
    </div>
  );
};

export default Counter;
