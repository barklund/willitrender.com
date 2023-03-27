import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import { useEventSource } from "remix-utils";
import { getParticipantSession, guess } from "~/models/session.server";
import { emitter } from "~/services/emitter.server";
import Browser from "./browser";
import CurrentGuess from "./currentGuess";
import Rounds from "./rounds";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css",
    },
  ];
}

export async function loader({ params }: LoaderArgs) {
  const sessionId = params.session;
  const participantId = params.participant;
  if (!sessionId || !participantId) {
    return redirect("/game/join");
  }
  const data = await getParticipantSession({ sessionId, participantId });
  return json(data);
}

export async function action({ params, request }: ActionArgs) {
  const body = await request.formData();
  const roundId = String(body.get("roundId"));
  const participantId = String(params.participant);
  const answer = parseInt(String(body.get("answer")));
  const newGuess = await guess({ roundId, participantId, answer });
  emitter.emit("guess", newGuess);
  return json({ guess: newGuess });
}

export default function Guess() {
  const { session, participant, rounds } = useLoaderData<typeof loader>();
  const [gameRounds, setGameRounds] = useState(rounds);
  const [currentRound, setCurrentRound] = useState(() => {
    const lastRound = rounds[rounds.length - 1];
    return lastRound?.isActive ? lastRound : null;
  });
  const latestRound = useEventSource("/sse/participant", { event: "round" });
  useEffect(() => setGameRounds(rounds), [rounds]);
  useEffect(() => {
    if (latestRound) {
      const parsedRound = JSON.parse(latestRound);
      setCurrentRound(
        parsedRound.isActive || parsedRound.correct === null
          ? parsedRound
          : null
      );
      setGameRounds((list) => [
        ...list.filter(({ id }) => id !== parsedRound.id),
        parsedRound,
      ]);
    }
  }, [latestRound]);
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
