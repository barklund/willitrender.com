/*
  Warnings:

  - Added the required column `explanation` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "round" INTEGER NOT NULL,
    "repoName" TEXT NOT NULL,
    "seconds" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    CONSTRAINT "Exercise_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("correct", "gameId", "id", "repoName", "round", "seconds") SELECT "correct", "gameId", "id", "repoName", "round", "seconds" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
