/*
  Warnings:

  - A unique constraint covering the columns `[liked_by,post_id]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Likes_liked_by_post_id_key" ON "Likes"("liked_by", "post_id");
