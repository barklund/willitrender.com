import type { Game, Guess, Participant, Round, Session } from "@prisma/client";

export type GameGuess = Omit<Guess, "id">;
export interface GameParticipant
  extends Omit<Participant, "sessionId" | "session"> {
  guesses?: GameGuess[];
}
export interface GameRound
  extends Omit<Round, "sessionId" | "session" | "createdAt" | "expiresAt"> {
  guesses?: GameGuess[];
  createdAt: string;
  expiresAt: string;
}
export interface GameSession extends Omit<Session, "gameId" | "createdAt"> {
  participants: GameParticipant[];
  rounds: GameRound[];
  createdAt: string;
  game: Game;
}

export interface HostContextType {
  currentRound: GameRound | null;
  roundCount: number;
  rounds: GameRound[];
  participants: GameParticipant[];
  session: GameSession;
}
