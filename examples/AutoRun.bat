@echo off
REM AutoRun - Run when vscode opens containing folder
REM Add in any useful startup code here.
REM Note that this script must return ASAP 
REM DAV 15APR19
setlocal

REM Uncomment next line as a simple test that script is being called
REM start "Started by AutoRun" dir

REM Call SetNFRoot to set up any short path SUBST (lost on reboot etc)
set _mypath=%~dp0
call %_mypath%SetNFRoot.bat

:eof
