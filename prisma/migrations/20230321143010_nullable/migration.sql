-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guess" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer" INTEGER NOT NULL,
    "correct" INTEGER,
    "participantId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    CONSTRAINT "Guess_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Guess_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Guess" ("answer", "correct", "id", "participantId", "roundId") SELECT "answer", "correct", "id", "participantId", "roundId" FROM "Guess";
DROP TABLE "Guess";
ALTER TABLE "new_Guess" RENAME TO "Guess";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
