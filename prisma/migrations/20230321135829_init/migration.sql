-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rounds" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortcode" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" TEXT NOT NULL,
    CONSTRAINT "Session_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "round" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Round_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "seniority" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Participant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "participantId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    CONSTRAINT "Guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Guess_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
