@echo off
setlocal enabledelayedexpansion

title AK Fitness Gym - GitHub Auto Uploader
color 0B

echo ========================================================
echo        AK FITNESS GYM - GITHUB PUSH TOOL
echo ========================================================
echo.

:: 1. Verify Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads and try again.
    goto :end
)

:: 2. Check if .git folder exists, initialize if missing
if not exist ".git" (
    echo [*] Initializing Git repository...
    git init
    git branch -M main
    echo [OK] Git repository initialized.
    echo.
)

:: 3. Configure remote origin if not present
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] No GitHub repository URL linked yet.
    echo.
    echo Please paste your GitHub repository URL:
    echo (Example: https://github.com/your-username/ak-fitness-gym.git)
    set /p REPO_URL="Repo URL: "
    
    if "!REPO_URL!"=="" (
        color 0C
        echo [ERROR] No URL provided. Aborting.
        goto :end
    )
    
    git remote add origin !REPO_URL!
    echo [OK] Remote origin set to: !REPO_URL!
    echo.
) else (
    for /f "delims=" %%i in ('git remote get-url origin') do set CURRENT_URL=%%i
    echo [i] Target repository: !CURRENT_URL!
    echo.
)

:: 4. Prompt for custom commit message or use default
set /p COMMIT_MSG="Enter commit message (Press Enter for default 'Update website files'): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update website files

:: 5. Stage, commit, and push
echo.
echo [*] Staging all files (git add .)...
git add .

echo [*] Committing files...
git commit -m "%COMMIT_MSG%"

echo [*] Pushing to GitHub (main branch)...
git push -u origin main

if %errorlevel% equ 0 (
    color 0A
    echo.
    echo ========================================================
    echo  SUCCESS: All files successfully uploaded to GitHub!
    echo ========================================================
) else (
    color 0E
    echo.
    echo [!] Push encountered an issue.
    echo If this is your first time, check your GitHub permissions or credentials.
    echo If the remote has new commits, try: git pull --rebase origin main
)

:end
echo.
pause
