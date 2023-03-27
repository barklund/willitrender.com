import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils";

import HostContext from "./hostContext";
import type { GameRound, GameSession } from "~/models/types.client";

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
  const lastParticipant = useEventSource("/sse/host", {
    event: "join",
  });
  useEffect(() => {
    setParticipants(session.participants);
    setRounds(session.rounds);
  }, [session]);
  useEffect(() => {
    if (lastParticipant) {
      setParticipants((list) => list.concat([JSON.parse(lastParticipant)]));
    }
  }, [lastParticipant]);
  useEffect(() => {
    if (!rounds.length || !rounds[rounds.length - 1].isActive) {
      setCurrentRound(null);
      return;
    }
    setCurrentRound(rounds[rounds.length - 1]);
  }, [rounds]);
  const lastGuess = useEventSource("/sse/host", {
    event: "guess",
  });
  useEffect(() => {
    if (lastGuess) {
      setCurrentRound((curRound) => {
        if (!curRound) return null;
        const { guesses, ...rest } = curRound;
        return {
          guesses: (guesses || []).concat([JSON.parse(lastGuess)]),
          ...rest,
        };
      });
    }
  }, [lastGuess]);

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
