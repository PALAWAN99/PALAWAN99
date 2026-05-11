# Database Backup Script for QR Gate Access System
# Supports both SQLite and PostgreSQL

$BackupDir = "backups"
if (!(Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$EnvFile = Get-Content ".env" | ConvertFrom-StringData
$DbUrl = $EnvFile.DATABASE_URL

Write-Host "--- Database Backup Started ---" -ForegroundColor Cyan

if ($DbUrl.StartsWith("file:")) {
    # SQLite Backup
    $DbFile = $DbUrl.Substring(5).Replace("./", "")
    $BackupFile = "$BackupDir/backup_sqlite_$Timestamp.db"
    if (Test-Path $DbFile) {
        Copy-Item $DbFile $BackupFile
        Write-Host "SQLite backup created: $BackupFile" -ForegroundColor Green
    } else {
        Write-Host "SQLite database file not found at $DbFile" -ForegroundColor Red
    }
} elseif ($DbUrl.StartsWith("postgresql://") -or $DbUrl.StartsWith("postgres://")) {
    # PostgreSQL Backup
    $BackupFile = "$BackupDir/backup_postgres_$Timestamp.sql"
    Write-Host "Attempting PostgreSQL backup using pg_dump..." -ForegroundColor Yellow
    # Note: Requires pg_dump to be in PATH
    pg_dump $DbUrl > $BackupFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL backup created: $BackupFile" -ForegroundColor Green
    } else {
        Write-Host "pg_dump failed. Please ensure PostgreSQL tools are installed and in PATH." -ForegroundColor Red
    }
} else {
    Write-Host "Unsupported Database URL format: $DbUrl" -ForegroundColor Red
}

Write-Host "--- Backup Finished ---" -ForegroundColor Cyan
