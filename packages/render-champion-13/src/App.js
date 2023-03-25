import { createContext, useContext, useState } from "react";

import { Go, Square } from "./components";
import "./App.css";

const Context = createContext(0);

function App() {
  return (
    <main>
      <ContextProvider>
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
  return (
    <Context.Provider value={counter}>
      <Go onClick={() => setCounter((v) => v + 1)} />
      {children}
    </Context.Provider>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

function LeftSquares() {
  const counter = useContext(Context);
  return (
    <>
      <Square>A</Square>
      <Square counter={counter}>B</Square>
      <Square>C</Square>
    </>
  );
}
function RightSquare() {
  return <Square>D</Square>;
}

export default App;
