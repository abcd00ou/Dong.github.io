# from app import create_app
from flask import Flask, request, redirect, url_for, session,jsonify,render_template
import requests
import json
from urllib.parse import urlencode
import pandas as pd 
import numpy as np
app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 세션 관리를 위해 필요한 키 설정

# OAuth 2.0 인증 정보
client_id = '8zESjIVD54_8K5PA_dIu'
client_secret = 'wyWAH1uLEY'
redirect_uri = 'http://localhost:8080/callback'
auth_url = 'https://auth.worksmobile.com/oauth2/v2.0/authorize'
token_url = 'https://auth.worksmobile.com/oauth2/v2.0/token'
userinfo_url = 'https://apis.worksmobile.com/r/api/user/v1/userinfo'

print(redirect_uri)
@app.route('/', methods=['GET'])
def index():
    if request.method=='GET':
        #redirect_uri = url_for('callback', _external=True)
        auth_params = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': 'calendar',
            'response_type': 'code',
            'state': 'random_state_string'
        }
        
        auth_request_url = f"{auth_url}?{urlencode(auth_params)}"
        return redirect(auth_request_url)
        return render_template("index.html")

@app.route('/main', methods=['GET'])
def main():
    if request.method=='GET':
        #redirect_uri = url_for('callback', _external=True)
        auth_params = {
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'scope': 'calendar',
            'response_type': 'code',
            'state': 'random_state_string'
        }
        
        auth_request_url = f"{auth_url}?{urlencode(auth_params)}"
        return redirect(auth_request_url)
        return render_template("index.html")
    
@app.route('/survey', methods=['GET'])
def survey():
   
    print('aa')
    return render_template("survey.html")    
    
# @app.route('/start-auth', methods=['GET'])
# def start_auth():
#     # OAuth 2.0 인증 URL 생성
#     auth_params = {
#         'client_id': client_id,
#         'redirect_uri': redirect_uri,
#         'scope': 'calendar',
#         'response_type': 'code',
#         'state': 'random_state_string'
#     }
#     auth_request_url = f"{auth_url}?{urlencode(auth_params)}"
#     print("aaaaa")
#     print(auth_request_url)
#     return redirect(auth_request_url)

@app.route('/callback', methods=['GET'])
def callback():

    code = request.args.get('code')
    state = request.args.get('state')

    # 반환된 code와 state를 세션에 저장
    session['code'] = code
    session['state'] = state
    # code= 'kr1clV3QVdhZFo5cDBMYlh4OQ'
    # state='random_state'
    #redirect_uri = url_for('callback', _external=True)
    print(code,state)
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri
    }

    token_response = requests.post(token_url, data=token_data)
    token_info = token_response.json()
    print('token_info',token_info)

    if 'error' in token_info:
        return f"Error: {token_info['error_description']}"
    else:
        access_token = token_info['access_token']
        session['access_token'] = access_token
        print("session['access_token']",session['access_token'])
        # # 사용자 정보 요청
        # headers = {
        #     'Authorization': f'Bearer {access_token}',
        #     'Content-Type': 'application/json'
        # }
        # userinfo_response = requests.get(userinfo_url, headers=headers)
        # userinfo = userinfo_response.json()
        # print("userinfouserinfo",userinfo)
        # if 'error' in userinfo:
        #     return f"Error: {userinfo['error_description']}"
        # else:
        #     user_id = userinfo['id']  # 사용자 ID 추출
        #     session['user_id'] = user_id  # 세션에 저장
        #     print("session user",user_id)
        return redirect(url_for('main'))

@app.route('/create_event',methods=['POST'])
def create_event():
    access_token = session.get('access_token')
    if not access_token:
        return redirect(url_for('main'))

    print(access_token)

    user_id = 'me'
    temp = requests.get(f"https://www.worksapis.com/v1.0/users/{user_id}/calendar",
                 headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    })

    #calendar_id = temp.json()['calendarId']
    calendar_id = 'c_300029314_8d914568-af3f-4ac8-b9eb-e968f8547c08'
    event_url = f'https://www.worksapis.com/v1.0/users/{user_id}/calendars/{calendar_id}/events'
    print("event_url",event_url)
    event = json.loads(request.get_data())
    event['start']={'dateTime':'2024-07-06T14:00:00', 'timeZone':'Asia/Seoul'}
    event['description'] = event['description'].replace(":",":\n\n ").replace(",","\n ").replace('"',"").replace("workplace","작업현장").replace("numworkers","작업인원").\
        replace("workersnormal","일반 근무자").replace("workershard","추가 근무자").replace("workersmorning","오전근무자").\
        replace("taskresult","작업내용").replace("specialnotes","특이사항").replace("overtime","추가근무")

    data =json.dumps({"eventComponents":[event]})

    response = requests.post(event_url, headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    },
    data=data)


    calendar_url = f'https://www.worksapis.com/v1.0/users/{user_id}/calendars/{calendar_id}/events'



    # 캘린더 이벤트 요청
    cal_list = requests.get(calendar_url, headers={
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    },params={"fromDateTime":"2024-07-01T10:00:00%2B09:00",
                                                                'untilDateTime':"2024-07-06T10:00:00%2B09:00"})
    print('cal_listcal_listcal_list',cal_list.json())


    if response.status_code == 200:
        return 'Event created successfully'
    else:
        print(response.text)
        return f"Failed to create event: {response.text}"
    
    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080,debug=True)
