# Database Backup Script for QR Gate Access System (PowerShell)
# This script handles both direct PostgreSQL connections and Dockerized environments.

$BackupDir = "backups"
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir/db_backup_$Timestamp.sql"

Write-Host "--- Starting QR Gate Database Backup ---" -ForegroundColor Cyan

# Check if Docker container is running
$DockerRunning = docker ps --filter "name=qrgat-db" --format "{{.Names}}"
if ($DockerRunning -eq "qrgat-db") {
    Write-Host "Docker container 'qrgat-db' found. Performing Docker dump..." -ForegroundColor Yellow
    docker exec qrgat-db pg_dump -U postgres qrgat_db > $BackupFile
} else {
    Write-Host "Docker container not found or not running. Attempting direct pg_dump..." -ForegroundColor Yellow
    
    # Try to get DATABASE_URL from .env
    if (Test-Path ".env") {
        $EnvFile = Get-Content ".env" | ConvertFrom-StringData
        $DbUrl = $EnvFile.DATABASE_URL
        if ($DbUrl) {
            pg_dump $DbUrl > $BackupFile
        } else {
            Write-Host "DATABASE_URL not found in .env" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host ".env file not found." -ForegroundColor Red
        exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup Success! File: $BackupFile" -ForegroundColor Green
    # Summary
    $Size = (Get-Item $BackupFile).Length / 1KB
    Write-Host "Backup Size: $Size KB" -ForegroundColor Gray
} else {
    Write-Host "Backup Failed. Please check your PostgreSQL tools or Docker status." -ForegroundColor Red
}

Write-Host "--- Process Finished ---" -ForegroundColor Cyan
