; Build on Windows: iscc /DStageDir=C:\path\to\staged\KKU-Card-API KKU-Card-API.iss
; Or: .\build-portable.ps1 -BuildInstaller
; Version: run ../scripts/sync-agent-version.sh (or build-portable passes /DMyAppVersion)

#define MyAppName "KKU Card API"
#ifndef MyAppVersion
  #ifexist "version.iss"
    #include "version.iss"
  #else
    #define MyAppVersion "0.0.0"
  #endif
#endif
#define MyAppPublisher "KKU Library"
#define MyAppURL "https://lib.kku.ac.th/smart-access"
#define AssetDir "..\assets"

[Setup]
AppId={{A1B2C3D4-E5F6-7890-ABCD-EF1234567890}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
OutputBaseFilename=kku-card-api-setup
SetupIconFile={#AssetDir}\app-icon.ico
UninstallDisplayIcon={#AssetDir}\app-icon.ico
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=lowest
UsePreviousAppDir=yes
CloseApplications=force
CloseApplicationsFilter=*.exe;*.dll;*.py;*.pyd

[Files]
Source: "{#StageDir}\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\Start-KKU-Card-API-launch.vbs"; IconFilename: "{app}\app-icon.ico"
Name: "{commondesktop}\{#MyAppName}"; Filename: "{app}\Start-KKU-Card-API-launch.vbs"; IconFilename: "{app}\app-icon.ico"

[Run]
Filename: "{app}\Start-KKU-Card-API-launch.vbs"; Description: "Launch {#MyAppName}"; Flags: postinstall nowait skipifsilent

[Code]
function IsUpgradeInstall: Boolean;
begin
  Result := WizardIsReinstall;
end;

function InitializeSetup: Boolean;
var
  Choice: Integer;
begin
  Result := True;
  if IsUpgradeInstall then
  begin
    Choice := MsgBox(
      'พบ KKU Card API ติดตั้งอยู่แล้ว' + #13#10 + #13#10 +
      'การติดตั้งจะเขียนทับเวอร์ชันเดิมในโฟลเดอร์เดิม' + #13#10 +
      'แนะนำให้ Quit จาก system tray ก่อน' + #13#10 +
      '(คลิกขวาไอคอนในแถบงาน → Quit KKU Card API)' + #13#10 + #13#10 +
      'ต้องการอัปเดต (เขียนทับ) หรือไม่?',
      mbConfirmation, MB_YESNO);
    if Choice = IDNO then
      Result := False;
  end;
end;

procedure StopCardApiFromPidFile;
var
  PidPath, PidLine: String;
  ResultCode: Integer;
begin
  PidPath := ExpandConstant('{userappdata}\KKU-Card-API\card-api.pid');
  if not FileExists(PidPath) then
    Exit;
  if LoadStringFromFile(PidPath, PidLine) then
  begin
    PidLine := Trim(PidLine);
    if PidLine <> '' then
      Exec('taskkill.exe', '/PID ' + PidLine + ' /F', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
  end;
  DeleteFile(PidPath);
end;

function PrepareToInstall(Sender: TObject): Boolean;
begin
  StopCardApiFromPidFile;
  Result := True;
end;
