import { PusherProvider } from "@harelpls/use-pusher";
import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/server-runtime";
import { getParticipantSession, guess } from "~/models/session.server";
import { sendGuess } from "~/services/pusher.server";
import GuessProvider from "./guessProvider";

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
  const pusherClientKey = process.env.PUSHER_CLIENT_KEY;
  return json({ ...data, pusherClientKey });
}

export async function action({ params, request }: ActionArgs) {
  const body = await request.formData();
  const roundId = String(body.get("roundId"));
  const participantId = String(params.participant);
  const answer = parseInt(String(body.get("answer")));
  const newGuess = await guess({ roundId, participantId, answer });
  await sendGuess(newGuess.participant.session.shortcode, newGuess);
  return json({ guess: newGuess });
}

export default function Guess() {
  const { session, participant, rounds, pusherClientKey } =
    useLoaderData<typeof loader>();
  const pusherConfig = { clientKey: pusherClientKey, cluster: "eu" };
  return (
    <PusherProvider {...pusherConfig}>
      <GuessProvider
        session={session}
        participant={participant}
        rounds={rounds}
      />
    </PusherProvider>
  );
}
