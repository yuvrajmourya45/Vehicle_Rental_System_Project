@echo off
echo Creating separate frontend repository...
echo.

cd Vehicle_Rental_System_Project\frontend

echo Initializing git...
git init

echo Adding files...
git add .

echo Creating commit...
git commit -m "Initial commit: Frontend"

echo Adding remote (Replace with your new repo URL)...
echo git remote add origin https://github.com/yuvrajmourya45/Vehicle-Rental-Frontend.git

echo Push to GitHub...
echo git branch -M main
echo git push -u origin main

echo.
echo ========================================
echo INSTRUCTIONS:
echo 1. Create new repo on GitHub: Vehicle-Rental-Frontend
echo 2. Run these commands:
echo    git remote add origin https://github.com/yuvrajmourya45/Vehicle-Rental-Frontend.git
echo    git branch -M main
echo    git push -u origin main
echo ========================================
pause
