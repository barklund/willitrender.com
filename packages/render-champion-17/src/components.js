import { useEffect, useRef, useState } from "react";

export function Go({ onClick }) {
  const [clicked, setClicked] = useState(false);
  const handleClick = (e) => {
    setClicked(true);
    onClick?.(e);
  };
  return (
    <button
      className={`go ${clicked ? "go--clicked" : ""}`}
      onClick={handleClick}
    >
      {clicked ? "GONE" : "GO!"}
    </button>
  );
}

export function Square({ children, ...props }) {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
  });
  return (
    <div className={`square square--${renderCount.current}`} {...props}>
      {children}
    </div>
  );
}
