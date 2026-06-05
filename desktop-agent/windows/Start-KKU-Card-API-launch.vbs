' Launch KKU Card API without a console window (tray icon to quit).
Option Explicit
Dim sh, root, ps1
Set sh = CreateObject("Wscript.Shell")
root = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
ps1 = root & "\Start-KKU-Card-API.ps1"
sh.Run "powershell.exe -NoProfile -Sta -ExecutionPolicy Bypass -File """ & ps1 & """", 0, False
