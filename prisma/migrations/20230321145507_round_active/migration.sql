-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Round" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "round" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    "sessionId" TEXT NOT NULL,
    CONSTRAINT "Round_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Round" ("createdAt", "expiresAt", "id", "round", "sessionId") SELECT "createdAt", "expiresAt", "id", "round", "sessionId" FROM "Round";
DROP TABLE "Round";
ALTER TABLE "new_Round" RENAME TO "Round";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
