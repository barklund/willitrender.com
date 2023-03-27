-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "seniority" INTEGER NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Participant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Participant" ("emoji", "id", "nickname", "score", "seniority", "sessionId") SELECT "emoji", "id", "nickname", "score", "seniority", "sessionId" FROM "Participant";
DROP TABLE "Participant";
ALTER TABLE "new_Participant" RENAME TO "Participant";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
