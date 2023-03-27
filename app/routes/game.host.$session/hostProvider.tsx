import type { PropsWithChildren } from "react";
import { useCallback } from "react";
import { useEffect, useState } from "react";

import HostContext from "./hostContext";
import type {
  GameGuess,
  GameParticipant,
  GameRound,
  GameSession,
} from "~/models/types.client";
import { useChannel, useEvent } from "@harelpls/use-pusher";

interface HostProviderProps {
  session: GameSession;
}

function HostProvider({
  session,
  children,
}: PropsWithChildren<HostProviderProps>) {
  const [participants, setParticipants] = useState(session.participants);
  const [rounds, setRounds] = useState(session.rounds);
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const channel = useChannel(session.shortcode);

  const handleJoin = useCallback((message?: { data: GameParticipant }) => {
    if (message) {
      setParticipants((list) => list.concat([message.data]));
    }
  }, []);
  useEvent(channel, "join", handleJoin);

  useEffect(() => {
    setParticipants(session.participants);
    setRounds(session.rounds);
  }, [session]);
  useEffect(() => {
    if (!rounds.length || !rounds[rounds.length - 1].isActive) {
      setCurrentRound(null);
      return;
    }
    setCurrentRound(rounds[rounds.length - 1]);
  }, [rounds]);

  const handleGuess = useCallback((message?: { data: GameGuess }) => {
    if (message) {
      setCurrentRound((curRound) => {
        if (!curRound) return null;
        const { guesses, ...rest } = curRound;
        return {
          guesses: (guesses || []).concat([message.data]),
          ...rest,
        };
      });
    }
  }, []);
  useEvent(channel, "guess", handleGuess);

  const value = {
    participants,
    rounds,
    currentRound,
    session: session,
    roundCount: session.game.rounds,
  };
  return <HostContext.Provider value={value}>{children}</HostContext.Provider>;
}

export default HostProvider;
