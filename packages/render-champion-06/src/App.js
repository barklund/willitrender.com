import { memo, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const MemoSquare = memo(Square);

function App() {
  const [counter, setCounter] = useState(0);
  return (
    <main>
      <Go onClick={() => setCounter(1)} />
      <Squares>
        <MemoSquare counter={counter}>A</MemoSquare>
        <MemoSquare>B</MemoSquare>
        <MemoSquare>C</MemoSquare>
        <MemoSquare>D</MemoSquare>
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

export default App;
