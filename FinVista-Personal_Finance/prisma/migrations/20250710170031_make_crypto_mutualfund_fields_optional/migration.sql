-- AlterTable
ALTER TABLE "investment_crypto" ALTER COLUMN "buyPrice" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "investment_mutual_fund" ALTER COLUMN "amount" DROP NOT NULL;
