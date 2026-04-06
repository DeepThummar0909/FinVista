/*
  Warnings:

  - You are about to alter the column `amount` on the `investment_mutual_fund` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `investment_sip` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `buyPrice` on the `investment_stock` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `quantity` on the `investment_stock` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `investments` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the `investment_crypto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `investment_fd` table without a default value. This is not possible if the table is not empty.
  - Added the required column `interestRate` to the `investment_fd` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `investment_mutual_fund` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `investment_sip` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "investment_crypto" DROP CONSTRAINT "investment_crypto_id_fkey";

-- AlterTable
ALTER TABLE "investment_fd" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "interestRate" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "investment_mutual_fund" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "investment_sip" ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "investment_stock" ALTER COLUMN "buyPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "investments" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "investment_crypto";
