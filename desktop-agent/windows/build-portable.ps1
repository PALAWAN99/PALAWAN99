# Build Windows portable zip (+ optional Setup.exe via Inno Setup).
param(
  [switch]$BuildInstaller
)

$ErrorActionPreference = "Stop"
$AgentRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent (Split-Path -Parent $AgentRoot)
$SyncSh = Join-Path $AgentRoot "scripts\sync-agent-version.sh"
if (Test-Path $SyncSh) {
  & bash $SyncSh
}
$OutDir = Join-Path $AgentRoot "dist"
$Stage = Join-Path $env:TEMP ("kku-card-api-win-" + [guid]::NewGuid().ToString("n"))
$Pkg = Join-Path $Stage "KKU-Card-API"

New-Item -ItemType Directory -Force -Path "$Pkg\backend" | Out-Null
Copy-Item "$RepoRoot\backend\requirements.txt" "$Pkg\backend\"
Copy-Item "$RepoRoot\backend\*.py" "$Pkg\backend\"

$ps1Src = Join-Path $AgentRoot "windows\Start-KKU-Card-API.ps1"
$ps1Dst = Join-Path $Pkg "Start-KKU-Card-API.ps1"
$utf8Bom = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($ps1Dst, [System.IO.File]::ReadAllText($ps1Src), $utf8Bom)
Copy-Item "$AgentRoot\windows\Start-KKU-Card-API.bat" $Pkg
Copy-Item "$AgentRoot\windows\Start-KKU-Card-API-launch.vbs" $Pkg
$Icon = Join-Path $AgentRoot "assets\app-icon.ico"
if (Test-Path $Icon) {
  Copy-Item $Icon (Join-Path $Pkg "app-icon.ico")
} else {
  Write-Warning "Missing $Icon — run render-asset.sh on Mac or build-app-icon-ico.py after app-icon-1024.png exists"
}
$appMeta = Join-Path $RepoRoot "frontend\src\lib\app-meta.ts"
$ver = "unknown"
if (Test-Path $appMeta) {
  if ($appMeta -match "APP_VERSION\s*=\s*'([^']+)'") { $ver = $Matches[1] }
}
@(
  "package=kku-card-api-windows",
  "app_version=$ver",
  "built=$((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ'))"
) | Set-Content (Join-Path $Pkg "VERSION.txt") -Encoding ASCII
Copy-Item "$AgentRoot\windows\README-Windows.txt" $Pkg -ErrorAction SilentlyContinue
$ReinstallTxt = Join-Path $AgentRoot "assets\INSTALL-reinstall.txt"
if (Test-Path $ReinstallTxt) {
  Copy-Item $ReinstallTxt (Join-Path $Pkg "INSTALL-reinstall.txt")
}

if (-not (Test-Path "$AgentRoot\windows\README-Windows.txt")) {
  @"
KKU Card API (Windows)
======================
1. Double-click Start-KKU-Card-API.bat
2. First run installs Python packages (needs Python 3.10+)
3. Browser opens id card page - URL is set automatically
4. Keep this window open while reading cards

No Chrome extension required.
"@ | Set-Content "$Pkg\README.txt" -Encoding ASCII
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$Zip = Join-Path $OutDir "kku-card-api-windows.zip"
if (Test-Path $Zip) { Remove-Item $Zip -Force }
Compress-Archive -Path $Pkg -DestinationPath $Zip -Force
Write-Host "Built: $Zip"

$Iss = Join-Path $AgentRoot "windows\KKU-Card-API.iss"
if ($BuildInstaller -and (Test-Path $Iss)) {
  $Iscc = Get-Command iscc -ErrorAction SilentlyContinue
  if ($Iscc) {
    & iscc.exe "/DStageDir=$Stage" "/DMyAppVersion=$ver" $Iss
    Write-Host "Built installer in $OutDir (v$ver)"
  } else {
    Write-Warning "Inno Setup (iscc) not found — install from https://jrsoftware.org/isinfo.php"
  }
}

Remove-Item -Recurse -Force $Stage
