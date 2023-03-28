import { Form } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import type { GameRound } from "~/models/types.client";
import useHost from "./useHost";

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes.toFixed(0).padStart(2, "0")}:${sec
    .toFixed(0)
    .padStart(2, "0")}`;
}

function Countdown({ currentRound }: { currentRound: GameRound }) {
  const expireTime = new Date(currentRound.expiresAt);
  const createTime = new Date(currentRound.createdAt);
  const nowTime = new Date();
  const timeOrig = getSecondsBetween(createTime, expireTime);
  const [timeLeft, setTimeLeft] = useState(
    getSecondsBetween(nowTime, expireTime)
  );
  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft((v) => Math.max(0, v - 50)),
      50
    );
    return () => clearInterval(interval);
  }, []);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (timeLeft === 0 && ref.current) {
      ref.current.form?.submit();
    }
  });
  const relativeLeft = timeLeft / timeOrig;
  const color =
    timeLeft < 5000 && timeLeft % 400 > 200 ? "bg-red-400" : "bg-green-400";
  return (
    <div className="relative flex border p-2">
      <button ref={ref} className="relative z-10 flex-grow text-xl uppercase">
        {formatSeconds(timeLeft / 1000)}
      </button>
      <div
        className={`absolute inset-0 ${color}`}
        style={{ right: `${relativeLeft * 100}%` }}
      />
    </div>
  );
}

function getSecondsBetween(a: Date, b: Date) {
  const timeA = a.getTime();
  const timeB = b.getTime();
  return Math.abs(timeA - timeB);
}

function Actions() {
  const { rounds, currentRound, roundCount, replayRound } = useHost(
    ({ rounds, currentRound, roundCount, replayRound }) => ({
      rounds,
      currentRound,
      roundCount,
      replayRound,
    }),
    true
  );
  const lastRound = rounds[rounds.length - 1];
  const isLastRoundScored = !rounds.length || lastRound.correct !== null;
  const isGameDone =
    rounds.length === roundCount && rounds[roundCount - 1].correct !== null;
  if (replayRound) return null;
  return (
    <Form method="post" className="flex flex-col gap-2 px-4">
      {currentRound ? (
        <>
          <input type="hidden" name="action" value="end" />
          <input type="hidden" name="roundId" value={currentRound?.id} />
          <Countdown currentRound={currentRound} />
        </>
      ) : isLastRoundScored ? (
        isGameDone ? (
          <h2 className="text-center text-5xl">Game over!</h2>
        ) : (
          <>
            <input type="hidden" name="action" value="start" />
            <button className="border p-2 text-3xl uppercase">
              Round {rounds.length + 1}
            </button>
          </>
        )
      ) : (
        <>
          <input type="hidden" name="action" value="score" />
          <input
            type="hidden"
            name="roundId"
            value={rounds[rounds.length - 1].id}
          />
          <button className="border p-2 text-xl uppercase">
            Score last round
          </button>
        </>
      )}
    </Form>
  );
}

export default Actions;
