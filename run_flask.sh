#!/bin/bash

# Flask 애플리케이션 실행
python3 ./app.py &

# Flask 앱의 프로세스 ID를 얻기 위해 잠시 대기
sleep 300 # 5분 (300초) 동안 대기

# Flask 애플리케이션 종료
pkill -f app.py