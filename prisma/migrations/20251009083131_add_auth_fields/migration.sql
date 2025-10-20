/*
  Warnings:

  - A unique constraint covering the columns `[refresh_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refresh_token" VARCHAR(255),
ADD COLUMN     "reset_password_expires" TIMESTAMPTZ,
ADD COLUMN     "reset_password_token" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "users_refresh_token_key" ON "users"("refresh_token");
