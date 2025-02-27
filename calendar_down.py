import os
import random
import string
import requests
from flask import Flask, request, redirect

app = Flask(__name__)

# 1) Developer Console에서 발급받은 정보 설정
CLIENT_ID = "8zESjIVD54_8K5PA_dIu"
CLIENT_SECRET = "wyWAH1uLEY"
REDIRECT_URI = "http://localhost:5000/callback"
SCOPE = "calendar"  # 캘린더 API 호출에 필요한 범위 (필요 시 "calendar.read" 등 추가)

AUTHORIZE_ENDPOINT = "https://auth.worksmobile.com/oauth2/v2.0/authorize"
TOKEN_ENDPOINT = "https://auth.worksmobile.com/oauth2/v2.0/token"

# Calendar API host (NAVER Works)
CALENDAR_API_BASE = "https://www.worksapis.com/v1.0"

# 임의의 state/nonce 생성
def generate_random_string(length=12):
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length))

STATE = generate_random_string()
NONCE = generate_random_string()

@app.route("/")
def home():
    # 인증 요청 URL 만들기
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": SCOPE,
        "response_type": "code",
        "state": STATE,
        # Implicit Flow가 아니라면 nonce는 필수가 아니지만 보안상 넣을 수 있음
        "nonce": NONCE,
    }
    query_str = "&".join([f"{k}={requests.utils.quote(v)}" for k, v in params.items()])
    auth_url = f"{AUTHORIZE_ENDPOINT}?{query_str}"

    html = f"""
    <h1>NAVER Works Calendar API Demo</h1>
    <p>아래 버튼을 클릭하여 인증 과정을 진행하세요.</p>
    <a href="{auth_url}" target="_blank">인증 요청하기</a>
    """
    return html

@app.route("/callback")
def callback():
    # 인증 후 리다이렉트되어 code, state 등이 전달됨
    print('request',request)
    code = request.args.get("code")
    returned_state = request.args.get("state")
    print('returned_state',returned_state)
    error = request.args.get("error")
    print('code',code)
    if error:
        return f"인증 오류: {error}", 400
    if not code:
        return "code(Authorization Code)가 없습니다.", 400
    # if returned_state != STATE:
    #     return "state 불일치. CSRF 가능성.", 400

    # code를 사용해 Access Token 교환
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }
    token_resp = requests.post(TOKEN_ENDPOINT, data=token_data)
    if token_resp.status_code != 200:
        return f"토큰 발급 실패: {token_resp.text}", 400

    token_json = token_resp.json()
    access_token = token_json.get("access_token")
    if not access_token:
        return f"access_token이 없습니다: {token_json}", 400

    # Access Token을 가지고 Calendar API 호출 예시
    # 예: /users/{userId}/calendars/{calendarId}/events
    # 이때 userId와 calendarId는 사전에 알고 있어야 함
    user_id = "abcd00pi@seowoohr.com"   # 예시
    calendar_id = "c_300029314_d3244899-f8d2-4fcf-aae7-2ce8180ad35a"  # 예시

    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    # 원하는 조회 기간 설정
    params = {
        "fromDateTime": "2025-01-01T00:00:00Z",
        "untilDateTime": "2025-01-31T23:59:59Z",
    }

    events_url = f"{CALENDAR_API_BASE}/users/{user_id}/calendars/{calendar_id}/events"
    events_resp = requests.get(events_url, headers=headers, params=params)
    if events_resp.status_code != 200:
        return f"캘린더 이벤트 조회 실패: {events_resp.text}", 400

    events_data = events_resp.json()

    # 화면에 일정 목록을 간단히 표시
    result_html = f"<h2>Access Token: {access_token}</h2>"
    result_html += "<h3>Calendar Events:</h3><ul>"
    for event in events_data.get("events", []):
        summary = event.get("summary")
        start_time = event.get("start").get("dateTime") if event.get("start") else None
        end_time = event.get("end").get("dateTime") if event.get("end") else None
        result_html += f"<li>{summary} ({start_time} ~ {end_time})</li>"
    result_html += "</ul>"

    return result_html

if __name__ == "__main__":
    print("서버 시작 -> http://localhost:5000 접속")
    app.run(host="127.0.0.1", port=5000, debug=True)