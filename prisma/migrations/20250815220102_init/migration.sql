-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'GHOSTED');

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "url" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'APPLIED',
    "source" TEXT,
    "location" TEXT,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);
