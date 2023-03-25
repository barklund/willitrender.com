import { createContext, memo, useContext, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const Context = createContext(0);

const MemoSquare = memo(Square);

function App() {
  return (
    <main>
      <ContextProvider>
        <GoWrapper />
        <Squares>
          <LeftSquares />
          <RightSquare />
        </Squares>
      </ContextProvider>
    </main>
  );
}

function ContextProvider({ children }) {
  const [counter, setCounter] = useState(0);
  const value = { counter, setCounter };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

function GoWrapper() {
  const { setCounter } = useContext(Context);
  return <Go onClick={() => setCounter((v) => v + 1)} />;
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

function LeftSquares() {
  const { counter, setCounter } = useContext(Context);
  return (
    <>
      <MemoSquare>A</MemoSquare>
      <MemoSquare counter={counter}>B</MemoSquare>
      <MemoSquare callback={setCounter}>C</MemoSquare>
    </>
  );
}
function RightSquare() {
  const { setCounter } = useContext(Context);
  return <Square callback={setCounter}>D</Square>;
}

export default App;
