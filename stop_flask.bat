@echo off
for /f "tokens=2" %%a in ('tasklist /v ^| findstr /i "app.py"') do taskkill /F /PID %%a