import { Form, useLoaderData } from "@remix-run/react";
import type { ActionArgs, V2_MetaFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getGames, startGame } from "~/models/game.server";

export const meta: V2_MetaFunction = () => [{ title: "Starting - Will it render?" }];

export async function loader() {
  const games = await getGames();
  return json({ games });
}

export async function action({ request }: ActionArgs) {
  const body = await request.formData();
  const gameId = body.get("game");
  if (typeof gameId !== "string") {
    return json({ error: "Missing game id" });
  }
  const session = await startGame(gameId);
  return redirect(`/game/host/${session.id}`);
}

export default function StartGame() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <main className="flex h-full flex-col items-center justify-center gap-4">
      <img src="/willitrender_logo.png" className="w-1/2" alt="Logo" />
      <Form
        method="post"
        className="flex w-1/4 flex-col  border border-purple-400 p-4"
      >
        {loaderData.games.map(({ id }) => (
          <input type="hidden" name="game" value={id} key={id} />
        ))}
        <button className="bg-purple-500 py-2 text-3xl text-white">
          Start
        </button>
      </Form>
    </main>
  );
}
