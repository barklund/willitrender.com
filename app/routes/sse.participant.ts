import type { LoaderArgs } from "@remix-run/node";
import type { Round } from "@prisma/client";
import { eventStream } from "remix-utils";

import { emitter } from "~/services/emitter.server";

export async function loader({ request }: LoaderArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(round: Round) {
      send({ event: "round", data: JSON.stringify(round) });
    }

    emitter.on("round", handle);

    return function clear() {
      emitter.off("round", handle);
    };
  });
}
