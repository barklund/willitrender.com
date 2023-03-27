import type { Game } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Game } from "@prisma/client";

export function getGames() {
  return prisma.game.findMany({
    select: { id: true, name: true, rounds: true },
  });
}

export function startGame(gameId: Game["id"]) {
  const shortcode = makeid(4);
  return prisma.session.create({
    data: { gameId, shortcode },
  });
}

function makeid(length: number) {
  let result = "";
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
