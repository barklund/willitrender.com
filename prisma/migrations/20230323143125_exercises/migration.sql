-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "round" INTEGER NOT NULL,
    "repoName" TEXT NOT NULL,
    "seconds" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    CONSTRAINT "Exercise_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
