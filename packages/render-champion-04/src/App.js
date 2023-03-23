import { useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

function Wrapper({ children }) {
  // eslint-disable-next-line no-unused-vars
  const [counter, setCounter] = useState(0);
  return (
    <main>
      <Go onClick={() => setCounter(1)} />
      {children}
    </main>
  );
}

function App() {
  return (
    <Wrapper>
      <Squares>
        <Square>A</Square>
        <Square>B</Square>
        <Square>C</Square>
        <Square>D</Square>
      </Squares>
    </Wrapper>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

export default App;
