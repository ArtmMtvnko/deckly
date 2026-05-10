-- CreateTable
CREATE TABLE "PinnedDeck" (
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "pinnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinnedDeck_pkey" PRIMARY KEY ("userId","deckId")
);

-- CreateIndex
CREATE INDEX "PinnedDeck_userId_idx" ON "PinnedDeck"("userId");

-- AddForeignKey
ALTER TABLE "PinnedDeck" ADD CONSTRAINT "PinnedDeck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedDeck" ADD CONSTRAINT "PinnedDeck_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
