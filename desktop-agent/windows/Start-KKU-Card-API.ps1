# KKU Library - local Card API on Windows (no console; system tray + taskbar to quit).
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Backend = Join-Path $Root "backend"
$VenvPython = Join-Path $Root "venv\Scripts\python.exe"
$VenvPythonw = Join-Path $Root "venv\Scripts\pythonw.exe"
$PortFile = Join-Path $env:APPDATA "KKU-Card-API\port.txt"
$LogDir = Join-Path $env:APPDATA "KKU-Card-API"
$LogFile = Join-Path $LogDir "card-api.log"
$PidFile = Join-Path $LogDir "card-api.pid"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log([string]$Message) {
  Add-Content -Path $LogFile -Value $Message -Encoding utf8
}

function Test-PortInUse([int]$p) {
  $c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
  return $null -ne $c
}

function Stop-CardApiProcess {
  if (Test-Path $PidFile) {
    $oldPid = Get-Content $PidFile -ErrorAction SilentlyContinue
    if ($oldPid -match '^\d+$') {
      Stop-Process -Id ([int]$oldPid) -Force -ErrorAction SilentlyContinue
    }
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
  }
}

$Port = $env:CARD_API_PORT
if (-not $Port) { $Port = "8000" }
if (Test-PortInUse ([int]$Port)) {
  foreach ($alt in 8001, 8002, 8003, 8010, 18080) {
    if (-not (Test-PortInUse $alt)) {
      Write-Log "Port $Port in use; using $alt"
      $Port = "$alt"
      break
    }
  }
}

if (-not (Test-Path $VenvPython)) {
  Write-Log "First run: creating Python venv..."
  $py = Get-Command python -ErrorAction SilentlyContinue
  if (-not $py) { $py = Get-Command py -ErrorAction SilentlyContinue }
  if (-not $py) {
    [System.Windows.Forms.MessageBox]::Show(
      "Python 3 not found. Install from https://www.python.org/downloads/ then run again.",
      "KKU Card API",
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Error
    ) | Out-Null
    exit 1
  }
  & $py.Source -m venv (Join-Path $Root "venv")
  & $VenvPython -m pip install --upgrade pip -q
  & $VenvPython -m pip install -r (Join-Path $Backend "requirements.txt") -q
}

if (-not $env:CORS_ORIGINS) {
  $env:CORS_ORIGINS = "https://lib.kku.ac.th,http://localhost:3000,http://127.0.0.1:3000"
}

$Runner = $VenvPython
if (Test-Path $VenvPythonw) { $Runner = $VenvPythonw }

$BaseUrl = "http://127.0.0.1:$Port"
Set-Content -Path $PortFile -Value $Port -Encoding utf8
Write-Log "`n=== $(Get-Date) === Starting $BaseUrl"

Stop-CardApiProcess

$proc = Start-Process -FilePath $Runner `
  -ArgumentList @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", $Port) `
  -WorkingDirectory $Backend -WindowStyle Hidden -PassThru `
  -RedirectStandardOutput $LogFile -RedirectStandardError ($LogFile + ".err")
Set-Content -Path $PidFile -Value $proc.Id -Encoding ascii

if ($env:KKU_CARD_API_OPEN_BROWSER -ne "0") {
  Start-Process "https://lib.kku.ac.th/smart-access/admin/idcard"
}

$iconPath = Join-Path $Root "app-icon.ico"
$appIcon = $null
if (Test-Path $iconPath) {
  $appIcon = New-Object System.Drawing.Icon($iconPath)
} else {
  $appIcon = [System.Drawing.SystemIcons]::Application
}

$notify = New-Object System.Windows.Forms.NotifyIcon
$notify.Icon = $appIcon
$notify.Text = "KKU Card API — $BaseUrl"
$notify.Visible = $true

$mainForm = New-Object System.Windows.Forms.Form
$mainForm.Text = "KKU Card API"
$mainForm.ShowInTaskbar = $true
$mainForm.Icon = $appIcon
$mainForm.Size = New-Object System.Drawing.Size(320, 200)
$mainForm.MinimizeBox = $false
$mainForm.MaximizeBox = $false
$mainForm.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedDialog
$mainForm.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
$mainForm.Location = New-Object System.Drawing.Point(-32000, -32000)
$mainForm.Add_Load({ $mainForm.Hide() })

function Stop-KkuCardApiApp {
  Stop-CardApiProcess
  if ($proc -and -not $proc.HasExited) {
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  }
  if ($notify) {
    $notify.Visible = $false
    $notify.Dispose()
  }
}

$mainForm.Add_FormClosing({
  Stop-KkuCardApiApp
}) | Out-Null

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$openItem = $menu.Items.Add("Open id card page")
$openItem.Add_Click({
  Start-Process "https://lib.kku.ac.th/smart-access/admin/idcard"
}) | Out-Null
$logItem = $menu.Items.Add("Open log file")
$logItem.Add_Click({ Start-Process notepad.exe $LogFile }) | Out-Null
$menu.Items.Add("-") | Out-Null
$quitItem = $menu.Items.Add("Quit KKU Card API")
$quitItem.Add_Click({
  $mainForm.Close()
}) | Out-Null
$notify.ContextMenuStrip = $menu

$notify.Add_DoubleClick({
  Start-Process "https://lib.kku.ac.th/smart-access/admin/idcard"
}) | Out-Null

$timer = New-Object System.Windows.Forms.Timer
$timer.Interval = 3000
$timer.Add_Tick({
  if ($proc.HasExited) {
    $timer.Stop()
    [System.Windows.Forms.MessageBox]::Show(
      "Card API stopped unexpectedly. See log:`n$LogFile",
      "KKU Card API",
      [System.Windows.Forms.MessageBoxButtons]::OK,
      [System.Windows.Forms.MessageBoxIcon]::Warning
    ) | Out-Null
    $mainForm.Close()
  }
})
$timer.Start()

[System.Windows.Forms.Application]::EnableVisualStyles()
[System.Windows.Forms.Application]::Run($mainForm)

Stop-KkuCardApiApp
