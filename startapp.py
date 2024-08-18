import subprocess
import os

# Flask 애플리케이션 경로
flask_app_path = 'app.py'

# Flask 애플리케이션 실행
subprocess.Popen(['python', flask_app_path], cwd=os.path.dirname(flask_app_path))