/*
  Warnings:

  - A unique constraint covering the columns `[request_by,request_to]` on the table `Friends` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePic" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Friends_request_by_request_to_key" ON "Friends"("request_by", "request_to");
