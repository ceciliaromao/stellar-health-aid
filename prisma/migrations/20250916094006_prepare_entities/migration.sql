/*
  Warnings:

  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleSub]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publicKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletContractId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "accountStatus" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "googleSub" TEXT,
ADD COLUMN     "publicKey" TEXT,
ADD COLUMN     "secretKeyCiphertext" TEXT,
ADD COLUMN     "walletContractId" TEXT,
ALTER COLUMN "crossmintUserId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Wallet";

-- DropEnum
DROP TYPE "public"."ChainType";

-- DropEnum
DROP TYPE "public"."WalletType";

-- CreateTable
CREATE TABLE "public"."ProviderRegistry" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "adminPublicKey" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'testnet',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Provider" (
    "id" TEXT NOT NULL,
    "registryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "walletPublicKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderRegistry_contractId_key" ON "public"."ProviderRegistry"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_walletPublicKey_key" ON "public"."Provider"("walletPublicKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleSub_key" ON "public"."User"("googleSub");

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "public"."User"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletContractId_key" ON "public"."User"("walletContractId");

-- AddForeignKey
ALTER TABLE "public"."Provider" ADD CONSTRAINT "Provider_registryId_fkey" FOREIGN KEY ("registryId") REFERENCES "public"."ProviderRegistry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
