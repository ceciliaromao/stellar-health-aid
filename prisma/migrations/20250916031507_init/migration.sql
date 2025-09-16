-- CreateEnum
CREATE TYPE "public"."ChainType" AS ENUM ('stellar');

-- CreateEnum
CREATE TYPE "public"."WalletType" AS ENUM ('custodial', 'smart');

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chainType" "public"."ChainType" NOT NULL,
    "walletType" "public"."WalletType" NOT NULL,
    "address" TEXT NOT NULL,
    "walletLocator" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "crossmintUserId" TEXT NOT NULL,
    "passkeyContractId" TEXT,
    "passkeyKeyIdBase64" TEXT,
    "passkeyPublicKey" TEXT,
    "deployStatus" TEXT NOT NULL DEFAULT 'none',
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AppTxn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletLocator" TEXT NOT NULL,
    "crossmintTransactionId" TEXT NOT NULL,
    "chain" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" DECIMAL(78,0) NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppTxn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_address_key" ON "public"."Wallet"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_walletLocator_key" ON "public"."Wallet"("walletLocator");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_crossmintUserId_key" ON "public"."User"("crossmintUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_passkeyContractId_key" ON "public"."User"("passkeyContractId");

-- CreateIndex
CREATE UNIQUE INDEX "AppTxn_crossmintTransactionId_key" ON "public"."AppTxn"("crossmintTransactionId");

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
