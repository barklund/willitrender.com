import type { LoaderArgs } from "@remix-run/node";
import type { Guess, Participant } from "@prisma/client";
import { eventStream } from "remix-utils";

import { emitter } from "~/services/emitter.server";

export async function loader({ request }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    function handleGuess(guess: Guess) {
      send({ event: "guess", data: JSON.stringify(guess) });
    }

    function handleJoin(participant: Participant) {
      console.log("Somebody joined, dispatching to host", participant);
      send({ event: "join", data: JSON.stringify(participant) });
    }

    emitter.on("guess", handleGuess);
    emitter.on("join", handleJoin);

    return function clear() {
      emitter.off("guess", handleGuess);
      emitter.off("join", handleJoin);
    };
  });
}
