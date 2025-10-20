

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'government', 'fleet_owner', 'fisherman');

-- CreateEnum
CREATE TYPE "VesselStatus" AS ENUM ('active', 'inactive', 'maintenance', 'decommissioned');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('valid', 'expired', 'suspended');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('planned', 'approved', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('synced', 'pending', 'conflict');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('online', 'offline', 'error');

-- CreateEnum
CREATE TYPE "ZoneType" AS ENUM ('eez', 'territorial', 'restricted', 'fishing_ground', 'protected');

-- CreateEnum
CREATE TYPE "ViolationType" AS ENUM ('boundary_cross', 'restricted_zone', 'prohibited_area');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('weather', 'storm', 'boundary_violation', 'vms_offline', 'logbook_missing', 'document_expiry');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('info', 'warning', 'critical');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('pending', 'sent', 'failed', 'read');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('ios', 'android', 'web');

-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('create', 'update', 'delete');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('pending', 'synced', 'conflict', 'failed');

-- CreateEnum
CREATE TYPE "EventSeverity" AS ENUM ('info', 'warning', 'error', 'critical');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('compliant', 'warning', 'non_compliant');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vessels" (
    "id" UUID NOT NULL,
    "vessel_code" VARCHAR(20) NOT NULL,
    "vessel_name" VARCHAR(100),
    "owner_id" UUID NOT NULL,
    "vessel_type" VARCHAR(50),
    "length_meters" DECIMAL(5,2),
    "gross_tonnage" DECIMAL(8,2),
    "engine_power_hp" INTEGER,
    "build_year" INTEGER,
    "registration_port" VARCHAR(100),
    "imo_number" VARCHAR(20),
    "vms_device_id" VARCHAR(50),
    "status" "VesselStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "certificate_type" VARCHAR(50) NOT NULL,
    "certificate_number" VARCHAR(50),
    "issue_date" DATE,
    "expiry_date" DATE,
    "issuing_authority" VARCHAR(100),
    "document_url" TEXT,
    "status" "CertificateStatus" NOT NULL DEFAULT 'valid',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew" (
    "id" UUID NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "citizen_id" VARCHAR(20),
    "date_of_birth" DATE,
    "phone" VARCHAR(20),
    "address" TEXT,
    "role_on_vessel" VARCHAR(50),
    "certification_number" VARCHAR(50),
    "photo_url" TEXT,
    "id_document_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_certificates" (
    "id" UUID NOT NULL,
    "crew_id" UUID NOT NULL,
    "certificate_type" VARCHAR(50) NOT NULL,
    "certificate_number" VARCHAR(50),
    "issue_date" DATE,
    "expiry_date" DATE,
    "issuing_authority" VARCHAR(100),
    "document_url" TEXT,
    "status" "CertificateStatus" NOT NULL DEFAULT 'valid',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "trip_code" VARCHAR(30),
    "departure_port" VARCHAR(100),
    "departure_time" TIMESTAMPTZ NOT NULL,
    "expected_return_time" TIMESTAMPTZ,
    "actual_return_time" TIMESTAMPTZ,
    "trip_status" "TripStatus" NOT NULL DEFAULT 'planned',
    "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'pending',
    "approved_by" UUID,
    "approval_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crew_assignments" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "crew_id" UUID NOT NULL,
    "role" VARCHAR(50),
    "join_date" DATE NOT NULL,
    "leave_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crew_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fishing_logs" (
    "id" UUID NOT NULL,
    "trip_id" UUID NOT NULL,
    "log_time" TIMESTAMPTZ NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "geom" TEXT,
    "gps_accuracy_meters" DECIMAL(6,2),
    "species_code" VARCHAR(10),
    "catch_weight_kg" DECIMAL(10,2) NOT NULL,
    "fishing_method" VARCHAR(50),
    "depth_meters" INTEGER,
    "water_temperature_c" DECIMAL(4,1),
    "photo_url" TEXT,
    "notes" TEXT,
    "sync_status" "SyncStatus" NOT NULL DEFAULT 'pending',
    "client_timestamp" TIMESTAMPTZ,
    "server_timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fishing_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "species" (
    "code" VARCHAR(10) NOT NULL,
    "species_name" VARCHAR(100) NOT NULL,
    "scientific_name" VARCHAR(150),
    "category" VARCHAR(50),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "vms_data" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "trip_id" UUID,
    "timestamp" TIMESTAMPTZ NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "geom" TEXT,
    "gps_accuracy_meters" DECIMAL(6,2),
    "speed_knots" DECIMAL(5,2),
    "heading_degrees" INTEGER,
    "signal_quality" INTEGER,
    "device_status" "DeviceStatus" NOT NULL DEFAULT 'online',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vms_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geofence_zones" (
    "id" UUID NOT NULL,
    "zone_name" VARCHAR(100) NOT NULL,
    "zone_type" "ZoneType" NOT NULL,
    "country_code" CHAR(2),
    "geom" TEXT NOT NULL,
    "regulations" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "effective_date" DATE,
    "expiry_date" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "geofence_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boundary_violations" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "trip_id" UUID,
    "zone_id" UUID NOT NULL,
    "violation_time" TIMESTAMPTZ NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "geom" TEXT,
    "violation_type" "ViolationType" NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'medium',
    "alert_sent" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_by" UUID,
    "acknowledged_at" TIMESTAMPTZ,
    "resolution_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "boundary_violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_reports" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "report_period_start" DATE NOT NULL,
    "report_period_end" DATE NOT NULL,
    "total_trips" INTEGER NOT NULL DEFAULT 0,
    "total_violations" INTEGER NOT NULL DEFAULT 0,
    "logbook_compliance_rate" DECIMAL(5,2),
    "vms_uptime_rate" DECIMAL(5,2),
    "boundary_compliance_rate" DECIMAL(5,2),
    "overall_score" DECIMAL(5,2),
    "status" "ComplianceStatus" NOT NULL DEFAULT 'compliant',
    "generated_by" UUID NOT NULL,
    "generated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "report_file_url" TEXT,

    CONSTRAINT "compliance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "trip_id" UUID,
    "document_type" VARCHAR(50) NOT NULL,
    "document_number" VARCHAR(50),
    "file_url" TEXT NOT NULL,
    "file_name" VARCHAR(255),
    "file_size_bytes" BIGINT,
    "mime_type" VARCHAR(100),
    "submitted_by" UUID NOT NULL,
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "DocumentStatus" NOT NULL DEFAULT 'pending',
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMPTZ,
    "review_notes" TEXT,
    "expiry_date" DATE,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approval_requests" (
    "id" UUID NOT NULL,
    "document_id" UUID,
    "trip_id" UUID,
    "request_type" VARCHAR(50) NOT NULL,
    "requested_by" UUID NOT NULL,
    "request_time" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_to" UUID,
    "priority" "RequestPriority" NOT NULL DEFAULT 'normal',
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "decision_time" TIMESTAMPTZ,
    "decision_by" UUID,
    "decision_notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "alert_type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'warning',
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "alert_time" TIMESTAMPTZ NOT NULL,
    "expiry_time" TIMESTAMPTZ,
    "is_acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_by" UUID,
    "acknowledged_at" TIMESTAMPTZ,
    "action_taken" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "alert_id" UUID,
    "notification_type" VARCHAR(50),
    "title" VARCHAR(200),
    "body" TEXT,
    "sent_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_status" "DeliveryStatus" NOT NULL DEFAULT 'pending',
    "read_at" TIMESTAMPTZ,
    "device_token_id" UUID,
    "platform" "Platform",

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "device_token" VARCHAR(255) NOT NULL,
    "platform" "Platform" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_data" (
    "id" UUID NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "geom" TEXT,
    "forecast_time" TIMESTAMPTZ NOT NULL,
    "temperature_c" DECIMAL(4,1),
    "wind_speed_kmh" DECIMAL(5,2),
    "wind_direction_degrees" INTEGER,
    "wave_height_m" DECIMAL(4,2),
    "precipitation_mm" DECIMAL(6,2),
    "weather_condition" VARCHAR(50),
    "visibility_km" DECIMAL(5,2),
    "data_source" VARCHAR(50),
    "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storm_tracking" (
    "id" UUID NOT NULL,
    "storm_name" VARCHAR(50),
    "storm_category" INTEGER,
    "center_latitude" DECIMAL(10,8) NOT NULL,
    "center_longitude" DECIMAL(11,8) NOT NULL,
    "geom" TEXT,
    "radius_km" DECIMAL(6,2),
    "max_wind_speed_kmh" DECIMAL(6,2),
    "forecast_path" TEXT,
    "tracking_time" TIMESTAMPTZ NOT NULL,
    "data_source" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storm_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_queue" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID,
    "operation" "Operation" NOT NULL,
    "payload" JSONB NOT NULL,
    "client_timestamp" TIMESTAMPTZ NOT NULL,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "sync_status" "QueueStatus" NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "synced_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "offline_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "vessel_id" UUID NOT NULL,
    "sync_time" TIMESTAMPTZ NOT NULL,
    "records_uploaded" INTEGER NOT NULL DEFAULT 0,
    "records_downloaded" INTEGER NOT NULL DEFAULT 0,
    "conflicts_detected" INTEGER NOT NULL DEFAULT 0,
    "sync_duration_ms" INTEGER,
    "device_info" JSONB,
    "app_version" VARCHAR(20),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" UUID,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" INET,
    "user_agent" TEXT,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" UUID NOT NULL,
    "setting_key" VARCHAR(100) NOT NULL,
    "setting_value" JSONB NOT NULL,
    "description" TEXT,
    "updated_by" UUID,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_logs" (
    "id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "severity" "EventSeverity" NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "source" VARCHAR(100),
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "vessels_vessel_code_key" ON "vessels"("vessel_code");

-- CreateIndex
CREATE UNIQUE INDEX "crew_citizen_id_key" ON "crew"("citizen_id");

-- CreateIndex
CREATE UNIQUE INDEX "trips_trip_code_key" ON "trips"("trip_code");

-- CreateIndex
CREATE UNIQUE INDEX "crew_assignments_trip_id_crew_id_key" ON "crew_assignments"("trip_id", "crew_id");

-- CreateIndex
CREATE INDEX "vms_data_vessel_id_timestamp_idx" ON "vms_data"("vessel_id", "timestamp");

-- CreateIndex
CREATE INDEX "alerts_vessel_id_alert_time_idx" ON "alerts"("vessel_id", "alert_time");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_device_token_key" ON "device_tokens"("device_token");

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_user_id_device_token_key" ON "device_tokens"("user_id", "device_token");

-- CreateIndex
CREATE INDEX "weather_data_forecast_time_idx" ON "weather_data"("forecast_time");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_timestamp_idx" ON "audit_logs"("user_id", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_setting_key_key" ON "system_settings"("setting_key");

-- CreateIndex
CREATE INDEX "event_logs_timestamp_idx" ON "event_logs"("timestamp");

-- CreateIndex
CREATE INDEX "event_logs_event_type_idx" ON "event_logs"("event_type");

-- AddForeignKey
ALTER TABLE "vessels" ADD CONSTRAINT "vessels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_certificates" ADD CONSTRAINT "crew_certificates_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_assignments" ADD CONSTRAINT "crew_assignments_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_assignments" ADD CONSTRAINT "crew_assignments_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fishing_logs" ADD CONSTRAINT "fishing_logs_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fishing_logs" ADD CONSTRAINT "fishing_logs_species_code_fkey" FOREIGN KEY ("species_code") REFERENCES "species"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fishing_logs" ADD CONSTRAINT "fishing_logs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vms_data" ADD CONSTRAINT "vms_data_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vms_data" ADD CONSTRAINT "vms_data_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boundary_violations" ADD CONSTRAINT "boundary_violations_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boundary_violations" ADD CONSTRAINT "boundary_violations_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boundary_violations" ADD CONSTRAINT "boundary_violations_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "geofence_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boundary_violations" ADD CONSTRAINT "boundary_violations_acknowledged_by_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_reports" ADD CONSTRAINT "compliance_reports_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_reports" ADD CONSTRAINT "compliance_reports_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_decision_by_fkey" FOREIGN KEY ("decision_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_acknowledged_by_fkey" FOREIGN KEY ("acknowledged_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_device_token_id_fkey" FOREIGN KEY ("device_token_id") REFERENCES "device_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_queue" ADD CONSTRAINT "offline_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offline_queue" ADD CONSTRAINT "offline_queue_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_vessel_id_fkey" FOREIGN KEY ("vessel_id") REFERENCES "vessels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
