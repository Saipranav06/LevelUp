-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "profileImage" TEXT,
    "hunterScore" INTEGER NOT NULL DEFAULT 0,
    "hunterRank" TEXT NOT NULL DEFAULT 'E-RANK',
    "hunterExp" INTEGER NOT NULL DEFAULT 0,
    "hunterLevel" INTEGER NOT NULL DEFAULT 1,
    "skillsCount" INTEGER NOT NULL DEFAULT 0,
    "resumeAnalysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
