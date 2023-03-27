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
  const handleRoundUpdate = useCallback((message?: { data: GameRound }) => {
    if (message) {
      const latestRound = message.data;
      setCurrentRound(
        latestRound.isActive || latestRound.correct === null
          ? latestRound
          : null
      );
      setGameRounds((list) => [
        ...list.filter(({ id }) => id !== latestRound.id),
        latestRound,
      ]);
    }
  }, []);
  const channel = useChannel(session.shortcode);
  useEvent(channel, "round", handleRoundUpdate);

  useEffect(() => setGameRounds(rounds), [rounds]);

  return (
    <main className="flex h-full flex-col items-center gap-4">
      <Rounds
        participant={participant}
        rounds={gameRounds}
        roundCount={session.game.rounds}
      />
      {!currentRound && (
        <h2 className="text-4xl">Please wait for next round...</h2>
      )}
      <Browser currentRound={currentRound} />
      <CurrentGuess participant={participant} currentRound={currentRound} />
    </main>
  );
}
