/*
  Warnings:

  - Made the column `caption` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "caption" SET NOT NULL,
ALTER COLUMN "photo" DROP NOT NULL;
