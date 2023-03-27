import { useState } from "react";
import type { GameParticipant } from "~/models/types.client";
import useHost from "./useHost";

const SENIORITY_LABEL = {
  1: "junior",
  2: "midlevel",
  3: "senior",
};

function Entry({
  participant: { emoji, nickname, seniority, score },
}: {
  participant: GameParticipant;
}) {
  return (
    <div className="flex items-center gap-2 border border-0 border-b-2 py-1">
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
  const participants = useHost(({ participants }) => participants);
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
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-600/80 transition-all duration-500 ${overlayStyle}`}
        onClick={() => setIsVisible(false)}
      >
        <div
          className="flex h-1/2 w-1/2 flex-col items-stretch overflow-auto bg-white p-12"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="border border-0 border-b-2 pb-4 text-5xl">
            Highscore
          </h2>
          {ranking.map((participant) => (
            <Entry key={participant.id} participant={participant} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Highscore;
