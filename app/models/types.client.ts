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
  explanation?: string;
}
export interface GameSession extends Omit<Session, "gameId" | "createdAt"> {
  participants: GameParticipant[];
  rounds: GameRound[];
  createdAt: string;
  game: Game;
}

export interface HostContextType {
  currentRound: GameRound | null;
  replayRound: GameRound | null;
  setReplayRound: (round: GameRound) => void;
  roundCount: number;
  rounds: GameRound[];
  participants: GameParticipant[];
  session: GameSession;
}
