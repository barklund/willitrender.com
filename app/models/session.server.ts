import type { Guess, Participant, Round, Session } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Session, Participant, Guess } from "@prisma/client";

export function getHostSession(id: Session["id"]) {
  return prisma.session.findFirst({
    select: {
      id: true,
      rounds: {
        select: {
          id: true,
          round: true,
          correct: true,
          isActive: true,
          createdAt: true,
          expiresAt: true,
          guesses: {
            select: { participantId: true, answer: true, roundId: true },
          },
        },
      },
      participants: {
        select: {
          id: true,
          emoji: true,
          nickname: true,
          score: true,
          seniority: true,
        },
      },
      createdAt: true,
      shortcode: true,
      game: true,
    },
    where: { id },
  });
}

export async function getParticipantSession({
  sessionId,
  participantId,
}: {
  sessionId: Session["id"];
  participantId: Participant["id"];
}) {
  const response = await prisma.session.findFirst({
    select: {
      id: true,
      rounds: {
        select: {
          id: true,
          round: true,
          isActive: true,
          correct: true,
          createdAt: true,
          expiresAt: true,
        },
      },
      createdAt: true,
      shortcode: true,
      game: true,
      participants: {
        select: {
          id: true,
          nickname: true,
          emoji: true,
          seniority: true,
          score: true,
          guesses: true,
        },
        where: { id: participantId },
      },
    },
    where: { id: sessionId },
  });
  if (!response) throw "Unknown session";
  const { participants, rounds, ...session } = response;
  const participant = participants[0];
  return { session, participant, rounds };
}

export async function joinSession({
  nickname,
  emoji,
  seniority,
  shortcode,
}: Pick<Participant, "nickname" | "emoji" | "seniority"> & {
  shortcode: Session["shortcode"];
}) {
  const session = await prisma.session.findFirst({
    select: { id: true },
    where: { shortcode },
  });
  if (!session) throw "Bad shortcode";
  return prisma.participant.create({
    data: {
      nickname,
      emoji,
      seniority,
      session: { connect: { id: session.id } },
    },
    include: {
      session: {},
    },
  });
}

export async function startRound(sessionId: Session["id"]) {
  const session = await prisma.session.findFirst({
    select: {
      rounds: true,
      game: {
        select: { exercises: { select: { round: true, seconds: true } } },
      },
    },
    where: { id: sessionId },
  });
  if (!session) {
    throw "Error";
  }
  const newRoundNumber = session.rounds.length + 1;
  const exercise = session.game.exercises.find(
    ({ round }) => round === newRoundNumber
  );
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + (exercise?.seconds || 60));
  return prisma.round.create({
    data: {
      round: session.rounds.length + 1,
      expiresAt,
      session: { connect: { id: sessionId } },
    },
  });
}

export async function guess({
  roundId,
  participantId,
  answer,
}: Pick<Guess, "roundId" | "participantId" | "answer">) {
  return prisma.guess.create({
    data: {
      answer,
      round: { connect: { id: roundId } },
      participant: { connect: { id: participantId } },
    },
  });
}

export async function endRound(roundId: Round["id"]) {
  return await prisma.round.update({
    data: { isActive: false },
    where: { id: roundId },
  });
}

export async function scoreRound(id: Round["id"]) {
  const round = await prisma.round.findFirst({
    select: {
      round: true,
      session: {
        select: {
          game: {
            select: { exercises: { select: { round: true, correct: true } } },
          },
        },
      },
    },
    where: { id },
  });
  if (!round) throw "No round";
  const exercise = round.session.game.exercises.find(
    (exercise) => round.round === exercise.round
  );
  if (!exercise) throw "No exercise";
  const scoredRound = await prisma.round.update({
    select: {
      correct: true,
      id: true,
      round: true,
      isActive: true,
      guesses: {
        select: {
          id: true,
          answer: true,
          participant: { select: { id: true, seniority: true } },
        },
      },
    },
    data: { correct: exercise.correct },
    where: { id },
  });

  const deltaScorePerPlayer: {
    id: Participant["id"];
    increment: Participant["score"];
  }[] = scoredRound.guesses.map(({ participant, answer }) => ({
    id: participant.id,
    increment: calculateScore(answer, exercise.correct, participant.seniority),
  }));

  await Promise.all(
    deltaScorePerPlayer.map(({ id, increment }) =>
      prisma.participant.update({
        data: { score: { increment } },
        where: { id },
      })
    )
  );

  return scoredRound;
}

function calculateScore(answer: number, correct: number, seniority: number) {
  const correctBits = ~(answer ^ correct) & 15;
  const factor = seniority <= 1 ? 30 : seniority === 2 ? 25 : 20;
  return countSetBits(correctBits) * factor;
}

function countSetBits(n: number) {
  let count = 0;
  while (n) {
    n &= n - 1;
    count++;
  }
  return count;
}
