# Quick diagnostic for Windows Native Host (run from KKU-Card-Bridge folder).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Python = Join-Path $Root "venv\Scripts\python.exe"
$HostPy = Join-Path $Root "extension\native-host\card_bridge_host.py"
$RegKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.kku.lib.smartaccess.card"

Write-Host "=== KKU Card Bridge diagnostic ==="
Write-Host "Root: $Root"
if (Test-Path (Join-Path $Root "VERSION.txt")) { Get-Content (Join-Path $Root "VERSION.txt") }
Write-Host ""

if (Test-Path $RegKey) {
  $manifest = (Get-ItemProperty $RegKey).'(default)'
  Write-Host "[OK] Registry: $RegKey"
  Write-Host "     Manifest: $manifest"
  if (Test-Path $manifest) { Get-Content $manifest } else { Write-Host "[FAIL] Manifest file missing" }
} else {
  Write-Host "[FAIL] Native host not registered. Run Install-Windows.bat"
}

Write-Host ""
if (Test-Path $Python) {
  Write-Host "[OK] venv Python: $Python"
  & $Python -c "import smartcard; print('pyscard OK')"
} else {
  Write-Host "[FAIL] venv missing. Run Install-Windows.bat"
}

Write-Host ""
if (Test-Path $HostPy) {
  $env:KKU_SMART_ACCESS_ROOT = $Root
  Write-Host "Running host ping (imports backend)..."
  & $Python -c @"
import json, struct, subprocess, sys
p = subprocess.Popen([r'$Python', r'$HostPy'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
msg = json.dumps({'id': 'test', 'method': 'ping', 'params': {}}).encode()
p.stdin.write(struct.pack('=I', len(msg)) + msg)
p.stdin.close()
raw = p.stdout.read(4)
if len(raw) < 4:
    print('[FAIL] No response:', p.stderr.read().decode())
    sys.exit(1)
n = struct.unpack('=I', raw)[0]
out = json.loads(p.stdout.read(n))
print('[OK] ping:', out)
"@
} else {
  Write-Host "[FAIL] Host script missing: $HostPy"
}

Write-Host ""
$log = Join-Path $env:APPDATA "KKU-Card-Bridge\native-host-errors.log"
if (Test-Path $log) {
  Write-Host "Last errors ($log):"
  Get-Content $log -Tail 20
}
pause
