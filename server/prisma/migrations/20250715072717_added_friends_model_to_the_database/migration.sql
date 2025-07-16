-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "request_to" INTEGER NOT NULL,
    "request_by" INTEGER NOT NULL,
    "pending" BOOLEAN NOT NULL DEFAULT true,
    "accepted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_request_to_fkey" FOREIGN KEY ("request_to") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_request_by_fkey" FOREIGN KEY ("request_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
