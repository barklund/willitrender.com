/*
  Warnings:

  - You are about to drop the column `correct` on the `Guess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN "correct" INTEGER;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer" INTEGER NOT NULL,
    "participantId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    CONSTRAINT "Guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Guess_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("answer", "id", "participantId", "roundId") SELECT "answer", "id", "participantId", "roundId" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
