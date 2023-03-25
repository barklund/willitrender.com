import { Suspense } from "react";

import { Go, Square } from "./components";
import "./App.css";

let eventualSquareResolver = null;
const eventualSquarePromise = new Promise((resolve) => {
  eventualSquareResolver = () => {
    eventualSquarePromise.status = "fulfilled";
    resolve();
  };
});
function EventualSquare({ children }) {
  if (eventualSquarePromise.status !== "fulfilled") {
    throw eventualSquarePromise;
  }
  return <Square>{children}</Square>;
}

function App() {
  return (
    <main>
      <Go onClick={() => eventualSquareResolver()} />
      <Squares>
        <SuspendedSquares />
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

function SuspendedSquares() {
  return (
    <>
      <Suspense
        fallback={
          <>
            <Square>A</Square>
            <Square>B</Square>
            <Square>C</Square>
            <Square>D</Square>
          </>
        }
      >
        <Square>A</Square>
        <EventualSquare>B</EventualSquare>
        <Square>C</Square>
        <EventualSquare>D</EventualSquare>
      </Suspense>
    </>
  );
}

export default App;
