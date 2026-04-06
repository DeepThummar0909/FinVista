/*
  Warnings:

  - You are about to drop the column `interestRate` on the `investment_fd` table. All the data in the column will be lost.
  - You are about to drop the column `maturityValue` on the `investment_fd` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "investment_fd" DROP COLUMN "interestRate",
DROP COLUMN "maturityValue";

-- AlterTable
ALTER TABLE "investment_sip" ALTER COLUMN "amount" DROP NOT NULL;
