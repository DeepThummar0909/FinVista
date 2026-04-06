/*
  Warnings:

  - Added the required column `interestRate` to the `investment_fd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maturityValue` to the `investment_fd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investment_fd" ADD COLUMN     "interestRate" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "maturityValue" DECIMAL(65,30) NOT NULL;
