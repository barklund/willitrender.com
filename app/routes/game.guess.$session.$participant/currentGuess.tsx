import { Form } from "@remix-run/react";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import type { GameParticipant, GameRound } from "~/models/types.client";

function Toggle({
  answer,
  bit,
  onFlip,
  children,
}: PropsWithChildren<{
  answer: number;
  bit: number;
  onFlip: (bit: number) => void;
}>) {
  const color = answer & bit ? "bg-green-800 text-white" : "";
  return (
    <button
      className={`flex-grow border p-4 md:p-8 text-2xl md:text-4xl ${color}`}
      onClick={() => onFlip(bit)}
    >
      {children}
    </button>
  );
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${minutes.toFixed(0).padStart(2, "0")}:${sec
    .toFixed(0)
    .padStart(2, "0")}`;
}

interface CountdownProps extends ComponentPropsWithoutRef<"button"> {
  currentRound: GameRound;
}

function Countdown({ currentRound, ...rest }: CountdownProps) {
  const { disabled = false } = rest;
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
  const relativeLeft = timeLeft / timeOrig;
  const color =
    timeLeft < 5000 && timeLeft % 400 > 200 ? "bg-red-700" : "bg-green-700";
  return (
    <div className={`relative flex border ${disabled ? "text-gray-300" : "text-white bg-black"}`}>
      <button
        className="relative z-10 flex-grow md:text-xl uppercase p-2"
        {...rest}
      >
        {disabled ? 'Submission closed' : `Submit (time left: ${formatSeconds(timeLeft / 1000)})`}
      </button>
      {!disabled && (
        <div
          className={`absolute inset-0 ${color}`}
          style={{ right: `${relativeLeft * 100}%` }}
        />
      )}
    </div>
  );
}

function getSecondsBetween(a: Date, b: Date) {
  const timeA = a.getTime();
  const timeB = b.getTime();
  return Math.abs(timeA - timeB);
}

export default function CurrentGuess({
  currentRound,
  participant,
  isDone = false,
}: {
  participant: GameParticipant;
  currentRound: GameRound | null;
  isDone?: boolean;
}) {
  const currentGuess = participant.guesses?.find(
    ({ roundId }) => roundId === currentRound?.id
  );
  const [answer, setAnswer] = useState(currentGuess?.answer || 0);
  useEffect(
    () => void (currentGuess && setAnswer(currentGuess.answer)),
    [currentGuess]
  );
  const lastRoundId = useRef<string>(currentRound?.id || null);
  useEffect(() => {
    if (lastRoundId.current !== currentRound?.id && !isDone) {
      setAnswer(0);
    }
  }, [currentRound, isDone]);
  if (!currentRound) {
    return null;
  }
  const flip = (bit: number) => setAnswer((v) => v ^ bit);
  const canGuess = currentRound?.isActive && !currentGuess;
  return (
    <div className="m-2 md:m-8 flex md:w-[600px] flex-col gap-2 md:gap-4 items-stretch">
      <div className="flex gap-2 md:gap-4">
        <Toggle answer={answer} bit={8} onFlip={flip}>
          A
        </Toggle>
        <Toggle answer={answer} bit={4} onFlip={flip}>
          B
        </Toggle>
        <Toggle answer={answer} bit={2} onFlip={flip}>
          C
        </Toggle>
        <Toggle answer={answer} bit={1} onFlip={flip}>
          D
        </Toggle>
      </div>
      <Form method="post" className="flex flex-col gap-2 border p-4">
        <input type="hidden" name="roundId" value={currentRound.id} />
        <input type="hidden" name="answer" value={answer} className="border" />
        <Countdown currentRound={currentRound} disabled={!canGuess} />
      </Form>
    </div>
  );
}
