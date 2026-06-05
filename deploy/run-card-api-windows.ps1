# Run Thai ID card FastAPI on Windows (USB reader). From repo root in PowerShell:
#   .\deploy\run-card-api-windows.ps1
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$Port = $env:CARD_API_PORT
if (-not $Port) { $Port = "8000" }

function Test-PortInUse([int]$p) {
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  return $null -ne $c
}

if (Test-PortInUse ([int]$Port)) {
  foreach ($alt in 8001, 8002, 8003, 8010, 18080) {
    if (-not (Test-PortInUse $alt)) {
      Write-Host "Port $Port in use; using $alt"
      $Port = "$alt"
      break
    }
  }
}

$env:CARD_API_PORT = $Port
if (-not $env:CORS_ORIGINS) {
  $env:CORS_ORIGINS = "https://lib.kku.ac.th,http://localhost:3000,http://127.0.0.1:3000"
}

$VenvPython = Join-Path $Root "backend\venv\Scripts\python.exe"
if (Test-Path $VenvPython) {
  $Python = $VenvPython
} else {
  $Python = "python"
}

$BaseUrl = "http://127.0.0.1:$Port"
Write-Host ""
Write-Host "========================================"
Write-Host " Card API ready: $BaseUrl"
Write-Host " Configure in Admin > Read ID Card > Settings"
Write-Host " (If port is not 8000, save the URL above in Settings)"
Write-Host "========================================"
Write-Host ""
Set-Location (Join-Path $Root "backend")
& $Python -m uvicorn main:app --host 127.0.0.1 --port $Port --reload
