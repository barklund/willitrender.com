import type { Guess, Participant, Round, Session } from "@prisma/client";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: String(process.env.PUSHER_APP_ID),
  key: String(process.env.PUSHER_CLIENT_KEY),
  secret: String(process.env.PUSHER_API_SECRET),
  cluster: "eu",
  useTLS: true,
});

export function sendGuess(shortcode: Session["shortcode"], data: Guess) {
  pusher.trigger(shortcode, "guess", { data });
}

export function sendRound(shortcode: Session["shortcode"], data: Round) {
  pusher.trigger(shortcode, "round", { data });
}

export function sendJoin(shortcode: Session["shortcode"], data: Participant) {
  pusher.trigger(shortcode, "join", { data });
}
