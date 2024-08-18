import os
import signal
import subprocess

# 실행 중인 Flask 애플리케이션의 PID 찾기
try:
    result = subprocess.check_output(["pgrep", "-f", "app.py"])
    pids = result.decode().strip().split('\n')
    for pid in pids:
        os.kill(int(pid), signal.SIGTERM)
    print("Flask application stopped successfully.")
except subprocess.CalledProcessError:
    print("No Flask application is currently running.")