import { useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [counter, setCounter] = useState(0);
  return (
    <main>
      <Go onClick={() => setCounter((v) => v + 1)} />
      <Squares>
        <LeftSquares />
        <RightSquares />
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

function LeftSquares() {
  const CustomSquare = ({ children }) => <Square>{children}</Square>;
  return (
    <>
      <CustomSquare>A</CustomSquare>
      <CustomSquare>B</CustomSquare>
    </>
  );
}

function RightSquares() {
  const CustomSquare = Square;
  return (
    <>
      <CustomSquare>C</CustomSquare>
      <CustomSquare>D</CustomSquare>
    </>
  );
}
export default App;
