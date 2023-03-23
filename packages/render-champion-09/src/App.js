import { memo, useReducer } from "react";

import { Go, Square } from "./components";
import "./App.css";

const MemoSquare = memo(Square);

function App() {
  // eslint-disable-next-line no-unused-vars
  const [counter, dispatch] = useReducer(
    (state, value) => state + value - 1,
    0
  );
  return (
    <main>
      <Go onClick={() => dispatch(1)} />
      <Squares>
        <MemoSquare counter={counter}>A</MemoSquare>
        <Square>B</Square>
        <MemoSquare counter={counter}>C</MemoSquare>
        <MemoSquare>D</MemoSquare>
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

export default App;
