-- AlterTable
ALTER TABLE "PublicDeck" ADD COLUMN     "ratingsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DeckDownload" (
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeckDownload_pkey" PRIMARY KEY ("userId","deckId")
);

-- CreateTable
CREATE TABLE "DeckRating" (
    "userId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeckRating_pkey" PRIMARY KEY ("userId","deckId")
);

-- AddForeignKey
ALTER TABLE "DeckDownload" ADD CONSTRAINT "DeckDownload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckDownload" ADD CONSTRAINT "DeckDownload_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRating" ADD CONSTRAINT "DeckRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckRating" ADD CONSTRAINT "DeckRating_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
