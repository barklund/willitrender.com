import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

function App() {
  const left = useRef();
  const right = useRef();
  return (
    <main>
      <Go
        onClick={() => {
          left.current?.click();
          right.current?.click();
        }}
      />
      ;
      <Squares>
        <LeftSquares ref={left} />
        <RightSquares ref={right} />
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

function LeftSquares(props) {
  const ref = useRef();
  const [counter, setCounter] = useState(0);
  useImperativeHandle(
    ref,
    () => ({
      click: () => setCounter((v) => v + 1),
    }),
    []
  );
  return (
    <>
      <Square counter={counter}>A</Square>
      <Square>B</Square>
    </>
  );
}

const RightSquares = forwardRef(function RightSquares(props, ref) {
  const [counter, setCounter] = useState(0);
  useImperativeHandle(
    ref,
    () => ({
      click: () => setCounter((v) => v + 1),
    }),
    []
  );
  return (
    <>
      <Square counter={counter}>C</Square>
      <Square>D</Square>
    </>
  );
});

export default App;
