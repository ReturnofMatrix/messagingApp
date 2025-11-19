/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `caption` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "content",
ADD COLUMN     "caption" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL;
