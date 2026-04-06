-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('FD', 'SIP', 'MUTUAL_FUNDS', 'STOCKS', 'CRYPTO');

-- CreateTable
CREATE TABLE "investments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "InvestmentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_fd" (
    "id" TEXT NOT NULL,
    "fdName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_fd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_sip" (
    "id" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "investment_sip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_mutual_fund" (
    "id" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "investmentDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "investment_mutual_fund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_stock" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "buyPrice" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_crypto" (
    "id" TEXT NOT NULL,
    "coinName" TEXT NOT NULL,
    "buyPrice" DECIMAL(65,30) NOT NULL,
    "quantity" DECIMAL(65,30) NOT NULL,
    "walletName" TEXT NOT NULL,

    CONSTRAINT "investment_crypto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "investments_userId_idx" ON "investments"("userId");

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_fd" ADD CONSTRAINT "investment_fd_id_fkey" FOREIGN KEY ("id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_sip" ADD CONSTRAINT "investment_sip_id_fkey" FOREIGN KEY ("id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_mutual_fund" ADD CONSTRAINT "investment_mutual_fund_id_fkey" FOREIGN KEY ("id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_stock" ADD CONSTRAINT "investment_stock_id_fkey" FOREIGN KEY ("id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_crypto" ADD CONSTRAINT "investment_crypto_id_fkey" FOREIGN KEY ("id") REFERENCES "investments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
