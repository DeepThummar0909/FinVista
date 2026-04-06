/*
  Warnings:

  - Added the required column `maturityValue` to the `investment_fd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investment_fd" ADD COLUMN     "maturityValue" DOUBLE PRECISION NOT NULL;
