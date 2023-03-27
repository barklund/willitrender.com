import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import {
  endRound,
  getHostSession,
  scoreRound,
  startRound,
} from "~/models/session.server";
import { emitter } from "~/services/emitter.server";
import Actions from "./actions";
import BetweenRounds from "./betweenRounds";
import CurrentRound from "./currentRound";
import Highscore from "./highscore";
import HostProvider from "./hostProvider";
import Participants from "./participants";
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
  if (!params.session) {
    throw "Unknown session";
  }
  const session = await getHostSession(params.session);
  return json({ session });
}

export async function action({ params, request }: ActionArgs) {
  const body = await request.formData();
  const action = body.get("action");
  switch (action) {
    case "start":
      const newRound = await startRound(params.session!);
      emitter.emit("round", newRound);
      return json({ round: newRound });
    case "end":
      const endedRound = await endRound(String(body.get("roundId")));
      emitter.emit("round", endedRound);
      return json({ round: endedRound });
    case "score":
      const scoredRound = await scoreRound(String(body.get("roundId")));
      emitter.emit("round", scoredRound);
      return json({ round: scoredRound });
    default:
      return json({ error: `unknown action: "${action}"` });
  }
}

export default function Host() {
  const { session } = useLoaderData<typeof loader>();
  if (!session) {
    return null;
  }
  return (
    <HostProvider session={session}>
      <main className="flex h-full w-full flex-col justify-between gap-4">
        <Rounds />
        <Highscore />
        <BetweenRounds />
        <CurrentRound />
        <Actions />
        <Participants />
      </main>
    </HostProvider>
  );
}
