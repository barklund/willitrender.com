/* eslint-disable react-hooks/exhaustive-deps */
import { memo, useCallback, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const MemoSquare = memo(Square);

function App() {
  // eslint-disable-next-line no-unused-vars
  const [counter, setCounter] = useState(0);
  const callbackA = useCallback(() => setCounter(1));
  const callbackB = useCallback(() => setCounter(2), []);
  const callbackC = useCallback(() => setCounter(4), [setCounter]);
  const callbackD = useCallback(() => setCounter(3), [counter]);
  return (
    <main>
      <Go onClick={() => setCounter(1)} />
      <Squares>
        <MemoSquare callback={callbackA}>A</MemoSquare>
        <MemoSquare callback={callbackB}>B</MemoSquare>
        <MemoSquare callback={callbackC}>C</MemoSquare>
        <MemoSquare callback={callbackD}>D</MemoSquare>
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

export default App;
