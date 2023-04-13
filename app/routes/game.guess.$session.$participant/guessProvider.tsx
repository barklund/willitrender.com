import { useChannel, useEvent } from "@harelpls/use-pusher";
import { useCallback, useEffect, useState } from "react";

import type {
  GameParticipant,
  GameRound,
  GameSession,
} from "~/models/types.client";
import Browser from "./browser";
import CurrentGuess from "./currentGuess";
import Rounds from "./rounds";

interface GuessProviderProps {
  session: Omit<GameSession, "participants" | "rounds">;
  participant: GameParticipant;
  rounds: GameRound[];
}

export default function GuessProvider({
  session,
  participant,
  rounds,
}: GuessProviderProps) {
  const [gameRounds, setGameRounds] = useState(rounds);
  const [currentRound, setCurrentRound] = useState(() => {
    const lastRound = rounds[rounds.length - 1];
    return lastRound?.isActive ? lastRound : null;
  });
  const [replayRound, setReplayRound] = useState<GameRound | null>(null);
  const handleRoundUpdate = useCallback((message?: { data: GameRound }) => {
    if (message) {
      const latestRound = message.data;
      setCurrentRound(
        latestRound.isActive || latestRound.correct === null
          ? latestRound
          : null
      );
      setReplayRound(latestRound.explanation ? latestRound : null);
      setGameRounds((list) =>
        list.map((round) => (round.id !== latestRound.id ? round : latestRound))
      );
    }
  }, []);
  const channel = useChannel(session.shortcode);
  useEvent(channel, "round", handleRoundUpdate);

  useEffect(() => setGameRounds(rounds), [rounds]);

  const gameOver = rounds.length === session.game.rounds;

  return (
    <main className="flex h-full flex-col items-stretch gap-2 md:items-center md:gap-4 bg-[#efefef]">
      <Rounds
        participant={participant}
        rounds={gameRounds}
        roundCount={session.game.rounds}
        replayRound={replayRound || undefined}
      />
      {!currentRound && !replayRound && (
        <div className="flex flex-grow flex-col items-center justify-center gap-6">
          <h2 className="text-2xl md:text-4xl">
            {gameOver ? "Game over!" : "Please wait for next round..."}
          </h2>
          {gameOver && (
            <>
              <p>Feedback: <a
                  href="https://form.jotform.com/morten.barklund/render-cphreact"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  Please fill this form
                </a>
              </p>
              <p>
                Twitter:{" "}
                <a
                  href="https://twitter.com/barklund"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  @barklund
                </a>
              </p>
              <p>
                LinkedIn:{" "}
                <a
                  href="https://linkedin.com/in/barklund"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  barklund
                </a>
              </p>
              <div className="flex items-end gap-6">
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="/books/rq2e_cover.jpeg"
                    className="max-w-[20vw]"
                    alt=""
                  />
                  <a
                    href="https://reactquickly.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    React Quickly
                  </a>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="/books/jrr_cover.png"
                    className="max-w-[20vw]"
                    alt=""
                  />
                  <a
                    href="https://reactlikea.pro"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    Job-Ready React
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <Browser currentRound={replayRound || currentRound} />
      <CurrentGuess
        participant={participant}
        currentRound={replayRound || currentRound}
        isDone={!!replayRound}
      />
    </main>
  );
}
