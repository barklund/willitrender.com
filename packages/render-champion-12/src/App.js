import { createContext, useContext, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const Context = createContext(0);

function App() {
  // eslint-disable-next-line no-unused-vars
  const [counter, setCounter] = useState(0);
  return (
    <main>
      <Context.Provider value={counter}>
        <Go onClick={() => setCounter((v) => v + 1)} />
        <Squares>
          <LeftSquares />
          <RightSquare />
        </Squares>
      </Context.Provider>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

function LeftSquares() {
  return (
    <>
      <Square>A</Square>
      <Square>B</Square>
      <Square>C</Square>
    </>
  );
}
function RightSquare() {
  const counter = useContext(Context);
  return <Square counter={counter}>D</Square>;
}

export default App;
