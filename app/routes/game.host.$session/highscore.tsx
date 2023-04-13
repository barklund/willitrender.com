import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import type { GameParticipant } from "~/models/types.client";
import useHost from "./useHost";

const SENIORITY_LABEL = {
  1: "junior",
  2: "midlevel",
  3: "senior",
};

function Entry({
  participant: { emoji, nickname, seniority, score },
  position,
  isGameOver,
}: {
  participant: GameParticipant;
  position: number;
  isGameOver: boolean;
}) {
  const color = isGameOver
    ? (() => {
        switch (position) {
          case 0:
            return "bg-[#AF9500] text-white";
          case 1:
            return "bg-[#B4B4B4] text-white";
          case 2:
            return "bg-[#AD8A56] text-white";
          default:
            return "";
        }
      })()
    : "";
  return (
    <div
      className={`flex items-center gap-2 border border-0 border-b-2 p-1 ${color}`}
    >
      <span className="text-2xl">
        {emoji} {nickname}
      </span>
      <small className="relative top-1">
        ({SENIORITY_LABEL[seniority as 1 | 2 | 3]})
      </small>
      <span className="flex-grow text-right text-2xl tabular-nums">
        {score.toLocaleString("da")} points
      </span>
    </div>
  );
}

function Highscore() {
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
  const isGameOver =
    rounds.length === roundCount && typeof window !== "undefined";
  const ranking = participants.slice();
  ranking.sort((a, b) => b.score - a.score);
  const overlayStyle = isVisible
    ? "opacity-100"
    : "opacity-0 pointer-events-none";
  return (
    <>
      <button
        className="absolute top-16 right-4 border bg-blue-200 p-1 text-3xl"
        onClick={() => setIsVisible(true)}
      >
        🥇
      </button>
      {isActive && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-600/80 transition-all duration-500 ${overlayStyle}`}
          onClick={() => setIsVisible(false)}
        >
          <div
            className="flex h-1/2 w-1/2 flex-col items-stretch overflow-auto bg-white p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {isGameOver &&  (
              <ReactConfetti
                width={window?.innerWidth}
                height={window?.innerHeight}
              />
            )}
            <h2 className="border border-0 border-b-2 pb-4 text-5xl">
              Highscore
            </h2>
            {ranking.map((participant, pos) => (
              <Entry
                key={participant.id}
                participant={participant}
                position={pos}
                isGameOver={isGameOver}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Highscore;
