-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'GATE_OFFICER', 'VIEWER');

-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('STUDENT', 'STAFF', 'FACULTY', 'EXTERNAL', 'GUEST');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "GateDirection" AS ENUM ('IN', 'OUT', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "GateStatus" AS ENUM ('ACTIVE', 'MAINTENANCE', 'DISABLED');

-- CreateEnum
CREATE TYPE "QrPurpose" AS ENUM ('ENTRY', 'EXIT');

-- CreateEnum
CREATE TYPE "AccessSource" AS ENUM ('QR_CODE', 'ID_CARD', 'MANUAL');

-- CreateEnum
CREATE TYPE "AccessDecision" AS ENUM ('ALLOWED', 'DENIED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('QR_SCANNER', 'KIOSK', 'ID_CARD_READER', 'MOBILE');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "IdCardReadStatus" AS ENUM ('SUCCESS', 'PARTIAL', 'FAILED', 'TIMEOUT');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_zh" TEXT NOT NULL,
    "address" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gates" (
    "id" UUID NOT NULL,
    "gate_code" VARCHAR(20) NOT NULL,
    "name_th" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_zh" TEXT NOT NULL,
    "branch_id" UUID NOT NULL,
    "direction" "GateDirection" NOT NULL DEFAULT 'BIDIRECTIONAL',
    "status" "GateStatus" NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "member_no" VARCHAR(30) NOT NULL,
    "citizen_id" VARCHAR(13),
    "first_name_th" TEXT NOT NULL,
    "last_name_th" TEXT NOT NULL,
    "first_name_en" TEXT,
    "last_name_en" TEXT,
    "first_name_zh" TEXT,
    "last_name_zh" TEXT,
    "email" TEXT,
    "phone" VARCHAR(20),
    "member_type" "MemberType" NOT NULL DEFAULT 'GUEST',
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "expire_date" DATE,
    "photo" BYTEA,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_tokens" (
    "id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "member_id" UUID NOT NULL,
    "purpose" "QrPurpose" NOT NULL DEFAULT 'ENTRY',
    "issued_date" DATE NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "qr_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_policies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "ttl_seconds" INTEGER NOT NULL DEFAULT 86400,
    "one_time_use" BOOLEAN NOT NULL DEFAULT false,
    "max_uses_per_day" INTEGER NOT NULL DEFAULT 10,
    "daily_start_time" VARCHAR(5),
    "daily_end_time" VARCHAR(5),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "access_events" (
    "id" UUID NOT NULL,
    "gate_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "qr_token_id" UUID,
    "direction" "GateDirection" NOT NULL,
    "source" "AccessSource" NOT NULL DEFAULT 'QR_CODE',
    "decision" "AccessDecision" NOT NULL,
    "reason_code" VARCHAR(50),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "metadata" JSONB,
    "scanned_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "access_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_registry" (
    "id" UUID NOT NULL,
    "device_code" VARCHAR(30) NOT NULL,
    "name" TEXT NOT NULL,
    "gate_id" UUID NOT NULL,
    "device_type" "DeviceType" NOT NULL,
    "secret_hash" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "last_seen_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_registry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "id_card_sessions" (
    "id" UUID NOT NULL,
    "member_id" UUID,
    "citizen_id" VARCHAR(13) NOT NULL,
    "full_name_th" TEXT NOT NULL,
    "full_name_en" TEXT,
    "birth_date" DATE,
    "address" TEXT,
    "photo_read" BOOLEAN NOT NULL DEFAULT false,
    "device_id" UUID,
    "status" "IdCardReadStatus" NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "id_card_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(50) NOT NULL,
    "resource" VARCHAR(50) NOT NULL,
    "resource_id" TEXT,
    "data_before" JSONB,
    "data_after" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");

-- CreateIndex
CREATE UNIQUE INDEX "gates_gate_code_key" ON "gates"("gate_code");

-- CreateIndex
CREATE INDEX "gates_branch_id_created_at_idx" ON "gates"("branch_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "members_member_no_key" ON "members"("member_no");

-- CreateIndex
CREATE UNIQUE INDEX "members_citizen_id_key" ON "members"("citizen_id");

-- CreateIndex
CREATE INDEX "members_member_no_idx" ON "members"("member_no");

-- CreateIndex
CREATE INDEX "members_citizen_id_idx" ON "members"("citizen_id");

-- CreateIndex
CREATE UNIQUE INDEX "qr_tokens_token_hash_key" ON "qr_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "qr_tokens_member_id_issued_date_idx" ON "qr_tokens"("member_id", "issued_date");

-- CreateIndex
CREATE INDEX "qr_tokens_expires_at_idx" ON "qr_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "qr_policies_name_key" ON "qr_policies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "access_events_qr_token_id_key" ON "access_events"("qr_token_id");

-- CreateIndex
CREATE INDEX "access_events_gate_id_scanned_at_idx" ON "access_events"("gate_id", "scanned_at");

-- CreateIndex
CREATE INDEX "access_events_member_id_scanned_at_idx" ON "access_events"("member_id", "scanned_at");

-- CreateIndex
CREATE INDEX "access_events_scanned_at_idx" ON "access_events"("scanned_at");

-- CreateIndex
CREATE UNIQUE INDEX "device_registry_device_code_key" ON "device_registry"("device_code");

-- CreateIndex
CREATE INDEX "device_registry_gate_id_idx" ON "device_registry"("gate_id");

-- CreateIndex
CREATE INDEX "id_card_sessions_citizen_id_read_at_idx" ON "id_card_sessions"("citizen_id", "read_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_resource_created_at_idx" ON "audit_logs"("resource", "created_at");

-- AddForeignKey
ALTER TABLE "gates" ADD CONSTRAINT "gates_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_tokens" ADD CONSTRAINT "qr_tokens_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_events" ADD CONSTRAINT "access_events_gate_id_fkey" FOREIGN KEY ("gate_id") REFERENCES "gates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_events" ADD CONSTRAINT "access_events_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "access_events" ADD CONSTRAINT "access_events_qr_token_id_fkey" FOREIGN KEY ("qr_token_id") REFERENCES "qr_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_registry" ADD CONSTRAINT "device_registry_gate_id_fkey" FOREIGN KEY ("gate_id") REFERENCES "gates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_card_sessions" ADD CONSTRAINT "id_card_sessions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "id_card_sessions" ADD CONSTRAINT "id_card_sessions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "device_registry"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
