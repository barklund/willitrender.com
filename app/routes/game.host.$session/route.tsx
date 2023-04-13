import { useLoaderData } from "@remix-run/react";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { PusherProvider } from "@harelpls/use-pusher";

import {
  endRound,
  getHostSession,
  replayRound,
  scoreRound,
  startRound,
} from "~/models/session.server";
import Actions from "./actions";
import BetweenRounds from "./betweenRounds";
import CurrentRound from "./currentRound";
import Highscore from "./highscore";
import HostProvider from "./hostProvider";
import Participants from "./participants";
import Rounds from "./rounds";
import { sendRound } from "~/services/pusher.server";
import PrizeDraw from "./prizeDraw";

export const meta: V2_MetaFunction = () => [{ title: "Hosting - Will it render?" }];

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
  const pusherClientKey = process.env.PUSHER_CLIENT_KEY;
  return json({ session, pusherClientKey });
}

export async function action({ params, request }: ActionArgs) {
  const body = await request.formData();
  const action = body.get("action");
  switch (action) {
    case "start":
      const newRound = await startRound(params.session!);
      await sendRound(newRound.session.shortcode, newRound);
      return json({ round: newRound });
    case "end":
      const endedRound = await endRound(String(body.get("roundId")));
      await sendRound(endedRound.session.shortcode, endedRound);
      return json({ round: endedRound });
    case "score":
      const scoredRound = await scoreRound(String(body.get("roundId")));
      await sendRound(scoredRound.session.shortcode, scoredRound);
      return json({ round: scoredRound });
    case "replay":
      const replayedRound = await replayRound(String(body.get("roundId")));
      await sendRound(replayedRound.shortcode, replayedRound);
      return json({ round: replayedRound });
    default:
      return json({ error: `unknown action: "${action}"` });
  }
}

export default function Host() {
  const { session, pusherClientKey } = useLoaderData<typeof loader>();
  if (!session) {
    return null;
  }
  const pusherConfig = { clientKey: pusherClientKey, cluster: "eu" };
  return (
    <PusherProvider {...pusherConfig}>
      <HostProvider session={session}>
        <main className="flex h-full w-full flex-col justify-between gap-4">
          <Rounds />
          <Highscore />
          <PrizeDraw />
          <BetweenRounds />
          <CurrentRound />
          <Actions />
          <Participants />
        </main>
      </HostProvider>
    </PusherProvider>
  );
}
