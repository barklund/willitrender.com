import { memo, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const MemoSquare = memo(Square);

function App() {
  // eslint-disable-next-line no-unused-vars
  const [counter, setCounter] = useState(0);
  return (
    <main>
      <Go onClick={() => setCounter(1)} />
      <Squares>
        <MemoSquare property={{}}>A</MemoSquare>
        <MemoSquare property={5}>B</MemoSquare>
        <MemoSquare property={() => undefined}>C</MemoSquare>
        <MemoSquare property>D</MemoSquare>
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

export default App;
