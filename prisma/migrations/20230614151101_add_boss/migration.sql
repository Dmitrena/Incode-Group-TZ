-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bossId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
