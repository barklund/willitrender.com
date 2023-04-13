import { useEffect, useMemo, useRef, useState } from "react";
import ReactConfetti from "react-confetti";
import useHost from "./useHost";

const WINNERS = 3;

function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function PrizeDraw() {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => void setIsActive(typeof window !== "undefined"), []);
  const { participants, rounds, roundCount } = useHost(
    ({ participants, rounds, roundCount }) => ({
      participants,
      rounds,
      roundCount,
    }),
    true
  );
  const isGameOver = rounds.length === roundCount && isActive;
  const [draw, setDraw] = useState(0);

  const { wheelParticipants, winners } = useMemo(() => {
    const copy = participants.filter(({ email }) => email);
    if (copy.length % 2 === 1) {
      copy.push({
        nickname: "",
        emoji: "🚫",
        email: "",
        id: "a",
        seniority: 1,
        score: 0,
      });
    }
    const valids = shuffle(
      copy
        .map((participant, position) => ({ ...participant, position }))
        .filter(({ nickname }) => nickname)
    );
    const winners = valids.slice(0, WINNERS);
    return { wheelParticipants: copy, winners };
  }, [participants]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinStart = useRef(0);
  const currentAngle = useRef(0);
  const targetAngle = useRef(0);
  const startSpin = () => {
    setIsSpinning(true);
    spinStart.current = new Date().getTime();
    targetAngle.current =
      (1-winners[draw].position / wheelParticipants.length) * 360 + 360;
  };
  const wheelRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    if (isSpinning) {
      const spin = () => {
        currentAngle.current += Math.min(
          4,
          (targetAngle.current - currentAngle.current) * 0.02
        );
        if (Math.abs(targetAngle.current - currentAngle.current) < 1) {
          setIsSpinning(false);
          setDraw((d) => d + 1);
          clearInterval(i);
          currentAngle.current = targetAngle.current % 360;
        }
        if (wheelRef.current) {
          wheelRef.current.setAttribute(
            "transform",
            `rotate(${currentAngle.current} 500 500)`
          );
        }
      };
      const i = setInterval(spin, 12);
      return () => clearInterval(i);
    }
  }, [isSpinning]);
  if (!isGameOver) return null;
  const overlayStyle = isVisible
    ? "opacity-100"
    : "opacity-0 pointer-events-none";
  const dashArray = `calc(${
    1 / wheelParticipants.length
  } * 3.14 * 450) calc(3.142 * 450)`;
  const textRotation = `rotate(${(1 / wheelParticipants.length / 2) * 360})`;
  const getSliceRotation = (index: number) =>
    `translate(500,500) rotate(${
      (1 / wheelParticipants.length) * (index-0.5) * 360 - 90
    })`;
  const canSpin = draw < WINNERS && !isSpinning;
  return (
    <>
      <button
        className="absolute top-28 right-4 border bg-purple-200 p-1 text-3xl"
        onClick={() => setIsVisible(true)}
      >
        🎰
      </button>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-600/80 transition-all duration-500 ${overlayStyle}`}
        onClick={() => setIsVisible(false)}
      >
        <div
          className="flex h-[1200px] w-[1100px] flex-col items-stretch overflow-auto bg-white p-12"
          onClick={(e) => e.stopPropagation()}
        >
          {draw === WINNERS && <ReactConfetti width={window.innerWidth} height={window.innerHeight} />}
          <svg className="mx-auto h-[800px] w-[800px]" viewBox="0 0 1000 1000">
            <circle r="450" cx="500" cy="500" fill="bisque" />
            <path
              d="M 492 5 h 8 v 20 h 8 l -16 16 l -16 -16 h 8 v -20 Z"
              fill="black"
            />
            <g ref={wheelRef}>
              {wheelParticipants.map(({ nickname, emoji }, index) => (
                <g key={nickname} transform={getSliceRotation(index)}>
                  <circle
                    r="225"
                    cx="0"
                    cy="0"
                    fill="transparent"
                    stroke={index % 2 === 0 ? "pink" : "bisque"}
                    strokeWidth="450"
                    strokeDasharray={dashArray}
                  />
                  <g transform={textRotation}>
                    <text textAnchor="end" x="440" y="0" fontSize="24">
                      {emoji} {nickname}
                    </text>
                  </g>
                </g>
              ))}
            </g>
          </svg>
          <button
            className={`w-full border border-gray-300 p-8 text-6xl ${
              canSpin
                ? "cursor-pointer bg-[hotpink] text-white"
                : "bg-white text-gray-300"
            }`}
            disabled={!canSpin}
            onClick={startSpin}
          >
            Spin!
          </button>
          <h3 className="mt-4 text-4xl">Winners:</h3>
          {winners.slice(0, draw).map(({ emoji, nickname }) => (
            <p key={nickname}>
              {emoji} {nickname}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

export default PrizeDraw;
