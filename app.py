# from app import create_app
from flask import Flask, request, redirect, url_for, session,jsonify,render_template,make_response,flash,abort
from flask_cors import CORS
from flask_compress import Compress 
import requests
import json
from urllib.parse import urlencode
import pandas as pd 
import numpy as np
from datetime import datetime
from functools import wraps
from datetime import timedelta

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 세션 관리를 위해 필요한 키 설정


CORS(app)
app.config['COMPRESS_LEVEL'] = 4 #압축레벨 설정 
Compress(app)

app.config['SAVE_FILES_DIR'] = '/static/data'
app.config['JSON_AS_ASCII'] = False 
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)



def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = make_response(view(*args, **kwargs))
        response.headers['Last-Modified'] = datetime.now()
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response
    return no_cache

# OAuth 2.0 인증 정보
client_id = '8zESjIVD54_8K5PA_dIu'
client_secret = 'wyWAH1uLEY'
redirect_uri = 'http://175.209.244.54:8080/callback'
auth_url = 'https://auth.worksmobile.com/oauth2/v2.0/authorize'
token_url = 'https://auth.worksmobile.com/oauth2/v2.0/token'
userinfo_url = 'https://apis.worksmobile.com/r/api/user/v1/userinfo'



@app.route('/', methods=['GET'])
@nocache
def idx():
    
    print("main gogo")

    return render_template("main.html")

@app.route('/main', methods=['GET','POST'])
@nocache
def main():
    

    print("main gogo")
    return render_template("main.html")

@app.route('/employee', methods=['GET','POST'])
@nocache
def employee():
    
    print("employee gogo") 
    
    return render_template("main.html")

@app.route('/signin', methods=['GET','POST'])
@nocache
def signin():
    if(request.method=='GET'):
        file_path = './static/data/countries.json'
        with open(file_path, 'r') as f:
            countries = json.load(f)
            f.close()
        return render_template("signup.html", countries=countries['countries'])
    elif(request.method=='POST'):
        ##로그인 성공
        # ID랑 비번으로 계정 매핑  
        insadb = pd.read_excel("./static/data/INSA_DB.xlsx")

        login_data  = request.get_json()
        id = login_data['id']
        pw = login_data['pw']
        print(insadb)
    
        filterd_db = insadb[(insadb['ID']==id)&(insadb['PASSWORD']==pw)].reset_index(drop=True)
        
        if len(filterd_db)>0:
            print(filterd_db)
            session['NAME'] = filterd_db['성명'][0]
            session['ID'] = filterd_db['ID'][0]
            session['ADMIN'] = filterd_db['ADMIN'][0]
            return render_template("calendar.html")
        else:
            abort(400, description="Session ID not found")
        

@app.route('/survey', methods=['GET'])
@nocache
def survey():
   
    print('aa')
    return render_template("survey.html")    

@app.route('/calendar', methods=['GET'])
@nocache
def calendar():
    print(session)
    if 'ADMIN' in session:
        if session['ADMIN']=='Y':
            name = session['NAME']
            admin = 'Y'
        else:
            name = session['NAME']
            admin='N'
        print(name)

        return render_template('calendar.html',name = name,admin=admin)
    else:
        return render_template('backoffice-login.html')


@app.route('/calendar_save', methods=['POST'])
@nocache
def calendar_save():
    print(request.get_json())
    data = request.get_json()['data']
    file_path = './static/data/calendar.json'
    data = json.loads(data)
    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    
    return 'success'


@app.route('/calendar_remove', methods=['POST'])
@nocache
def calendar_remove():
    print(request.get_json())
    data = request.get_json()['data']
    file_path = './static/data/calendar.json'
    data = json.loads(data)
    

    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    
    return 'success'

@app.route('/calendar_edit', methods=['POST'])
@nocache
def calendar_edit():
    print(request.get_json())
    print('request',request.form)
    data = request.get_json()['data']
    file_path = './static/data/calendar.json'
    data = json.loads(data)
    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    
    return 'success'


@app.route('/productivity', methods=['GET'])
@nocache
def productivity():
    
    print("main gogo")
    return render_template("productivity.html")


@app.route('/create_event',methods=['POST'])
@nocache
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

@app.route('/backoffice', methods=['GET'])
@nocache
def backoffice():
    if 'ID' in session:
        print(session['ID'])
        return redirect("/calendar")
    else:
      return render_template("backoffice-login.html")

@app.route('/mainback', methods=['GET'])
@nocache
def mainback():
    return render_template("backoffice-main.html")
    

@app.route('/signup', methods=['GET'])
@nocache
def signup():
    file_path = './static/data/countries.json'
    with open(file_path, 'r') as f:
      countries = json.load(f)
      f.close()
    return render_template("signup.html", countries=countries['countries'])

@app.route('/logout', methods=['POST'])
@nocache
def logout():
    session.clear()
    print("맞아?")
    return jsonify("success")
    
@app.route('/register', methods=['POST'])
@nocache
def register():
    # ID랑 비번으로 계정 매핑  
    insadb = pd.read_excel("./static/data/INSA_DB.xlsx")

    register_data  = request.get_json()
    user_id = register_data['user_id']
    user_pw = register_data['user_pw']
    user_name = register_data['user_name']
    user_contact = register_data['user_contact']
    user_nationality = register_data['user_nationality']
    user_credential = register_data['user_credential']
    user_visa = register_data['user_visa']
    user_address = register_data['user_address']
    user_certificate = register_data['user_certificate']
    user_highBlood = register_data['user_highBlood']

    registerd_data = pd.DataFrame({
        "성명":[user_name],
        "영문명":[user_name],
        "체류비자":[user_visa],
        "국적":[user_nationality],
        "KEY_ID":[user_credential],
        "주소":[user_address],
        "전화번호":[user_contact],
        "자격증유무":[user_certificate],
        "고혈압유무":[user_highBlood],
        "ID":[user_id],
        "PASSWORD":[user_pw],
        "ADMIN":["N"]
        
    })

    insadb_new = pd.concat([insadb,registerd_data]).reset_index(drop=True)
    insadb_new.to_excel("./static/data/INSA_DB.xlsx",index=False)

    print(insadb_new)
    
    return jsonify("success")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080,debug=True)
