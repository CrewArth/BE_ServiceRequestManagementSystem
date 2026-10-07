CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'ADMIN');
CREATE TYPE "Category" AS ENUM ('IT', 'MAINTENANCE', 'GENERAL');
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TYPE "RequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceRequest" (
  "id" TEXT NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "description" VARCHAR(2000) NOT NULL,
  "category" "Category" NOT NULL,
  "priority" "Priority" NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'OPEN',
  "overdue" BOOLEAN NOT NULL DEFAULT false,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchedulerState" (
  "key" TEXT NOT NULL,
  "lastSuccessfulRun" TIMESTAMP(3),
  CONSTRAINT "SchedulerState_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "ServiceRequest_ownerId_createdAt_idx" ON "ServiceRequest"("ownerId", "createdAt");
CREATE INDEX "ServiceRequest_status_createdAt_idx" ON "ServiceRequest"("status", "createdAt");
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
