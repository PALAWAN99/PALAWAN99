# Register Chrome Native Messaging host (Windows registry).
# Usage: .\extension\install-native-host.ps1 -ExtensionId <chrome-extension-id>
param(
  [Parameter(Mandatory = $false)]
  [string]$ExtensionId = ""
)

$ErrorActionPreference = "Stop"

$ExtDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ExtDir
$IdFile = Join-Path $ExtDir "EXTENSION_ID"

if (-not $ExtensionId -and (Test-Path $IdFile)) {
  $ExtensionId = (Get-Content $IdFile -Raw).Trim()
}
if (-not $ExtensionId) {
  Write-Error "Usage: install-native-host.ps1 -ExtensionId <id>  (or ship extension/EXTENSION_ID)"
  exit 1
}

$HostPy = Join-Path $Root "extension\native-host\card_bridge_host.py"
if (-not (Test-Path $HostPy)) {
  Write-Error "Missing host script: $HostPy"
  exit 1
}
$HostPy = (Resolve-Path $HostPy).Path

$VenvPython = Join-Path $Root "venv\Scripts\python.exe"
$BackendVenvPython = Join-Path $Root "backend\venv\Scripts\python.exe"
$HostBat = Join-Path $Root "extension\native-host\card_bridge_host.bat"
$HostBat = (Resolve-Path $HostBat).Path

$ManifestPath = Join-Path $Root "extension\native-host\com.kku.lib.smartaccess.card.json"
$Origin = "chrome-extension://$ExtensionId/"

function Write-ManifestJson([string]$Path, [string]$HostPath, [string[]]$ArgsList) {
  $pathJson = ($HostPath -replace '\\', '\\')
  $argsJson = ""
  if ($ArgsList -and $ArgsList.Count -gt 0) {
    $escaped = $ArgsList | ForEach-Object { '"' + ($_ -replace '\\', '\\') + '"' }
    $argsJson = "`n  `"args`": [" + ($escaped -join ", ") + "],"
  }
  $manifest = @"
{
  "name": "com.kku.lib.smartaccess.card",
  "description": "KKU Smart Access - Thai ID card reader (Native Messaging)",
  "path": "$pathJson",$argsJson
  "type": "stdio",
  "allowed_origins": ["$Origin"]
}
"@
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($Path, $manifest, $utf8NoBom)
}

$PythonExe = $null
if (Test-Path $VenvPython) {
  $PythonExe = (Resolve-Path $VenvPython).Path
} elseif (Test-Path $BackendVenvPython) {
  $PythonExe = (Resolve-Path $BackendVenvPython).Path
}

if ($PythonExe) {
  Write-ManifestJson -Path $ManifestPath -HostPath $PythonExe -ArgsList @($HostPy)
  Write-Host "Installed Native Messaging host (python.exe + script)"
  Write-Host "  Python: $PythonExe"
  Write-Host "  Script: $HostPy"
} else {
  Write-ManifestJson -Path $ManifestPath -HostPath $HostBat -ArgsList @()
  Write-Host "Installed Native Messaging host (bat launcher - run Install-Windows.bat to create venv)"
  Write-Host "  Host BAT: $HostBat"
}

$regKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.kku.lib.smartaccess.card"
New-Item -Path $regKey -Force | Out-Null
Set-ItemProperty -Path $regKey -Name "(default)" -Value $ManifestPath -Type String

Write-Host "  Registry: $regKey"
Write-Host "  Manifest: $ManifestPath"
Write-Host "  Extension ID: $ExtensionId"
Write-Host ""
Write-Host "Next: restart Chrome, Load unpacked extension, popup -> Test Native Host -> Enable Bridge"
