import { memo, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const MemoSquare = memo(Square);

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isReversed, setReversed] = useState(false);
  return (
    <main>
      <Go onClick={() => setReversed(true)} />
      <Squares>
        <SubSquares isReversed={isReversed}>
          <LeftSquares isReversed={isReversed} />
        </SubSquares>
        <SubSquares isReversed={isReversed}>
          <RightSquares isReversed={isReversed} />
        </SubSquares>
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}
function SubSquares({ children, isReversed }) {
  return (
    <div
      className="squares"
      style={isReversed ? { flexDirection: "row-reverse" } : {}}
    >
      {children}
    </div>
  );
}

function LeftSquares({ isReversed }) {
  const values = ["A", "B"];
  if (isReversed) values.reverse();
  return values.map((v) => <MemoSquare key={Math.random()}>{v}</MemoSquare>);
}

function RightSquares({ isReversed }) {
  const values = ["C", "D"];
  if (isReversed) values.reverse();
  return values.map((v) => <MemoSquare key={0}>{v}</MemoSquare>);
}
export default App;
