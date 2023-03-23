import { Go, Square } from "./components";
import "./App.css";

function App() {
  return (
    <main>
      <Go />
      <Squares>
        <Square>A</Square>
        <Square>B</Square>
        <Square>C</Square>
        <Square>D</Square>
      </Squares>
    </main>
  );
}

function Squares({ children }) {
  return <div className="squares">{children}</div>;
}

export default App;
