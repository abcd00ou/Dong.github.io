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
        insadb['PASSWORD'] = insadb['PASSWORD'].astype(str)
        login_data  = request.get_json()
        id = login_data['id']
        pw = login_data['pw']
        session['id'] = id
        session['pw'] = pw
        print(insadb)
    
        filterd_db = insadb[(insadb['ID']==id)&(insadb['PASSWORD']==pw)].reset_index(drop=True)
        print(filterd_db)
        if len(filterd_db)>0:
            print(filterd_db)
            session['NAME'] = filterd_db['성명'][0]
            session['ID'] = filterd_db['ID'][0]
            session['ADMIN'] = filterd_db['ADMIN'][0]
            if session['ADMIN']=='Y':
                return render_template("calendar-admin.html")
            else:
                ## 나머지 데이터가 있는지 확인 
                db_cols = ['성명', '영문명', '체류비자', '국적', 'KEY_ID', '주소', '전화번호','자격증유무', '고혈압유무']
                null_data = filterd_db[db_cols].isna().sum(axis=1).values[0]
                if null_data!=0:
                    sign_data = 'False'
                ## 먼저 날짜 컬럼을 만들어야함 
                today_day = datetime.now().strftime(format = "%Y-%m-%d")
                today_time =  datetime.now().strftime(format = "%Y-%m-%d %H:%M")
                cols1 = today_day+"(출근)"
                cols2 = today_day+"(퇴근)"
                
                if cols1 in filterd_db.columns:
                    print("yess")
                    ## 여기에는 그냥 해당사람 시간 넣으면 됨 
                    Attend_t = filterd_db[cols1].values[0] 
                else:
                    Attend_t = 'none'
                
                if cols2 in filterd_db.columns:
                    print("yess")
                    ## 여기에는 그냥 해당사람 시간 넣으면 됨 
                    Leave_t = filterd_db[cols2].values[0]
                else:
                    Leave_t = 'none'
                print(Attend_t==np.nan)
                if pd.isna(Attend_t):
                    Attend_t='none'
                if pd.isna(Leave_t):
                    Leave_t='none'

                print('Attend,Leave',Attend_t,Leave_t)
                return jsonify(sign_data=sign_data)
        else:
            abort(400, description="Session ID not found")
        
@app.route('/gocalendar', methods=['GET'])
@nocache
def gocalendar():
    insadb = pd.read_excel("./static/data/INSA_DB.xlsx")
    insadb['PASSWORD'] = insadb['PASSWORD'].astype(str)
    filterd_db = insadb[(insadb['ID']==session['id'])&(insadb['PASSWORD']==session['pw'])].reset_index(drop=True)
    ## 먼저 날짜 컬럼을 만들어야함 
    today_day = datetime.now().strftime(format = "%Y-%m-%d")
    today_time =  datetime.now().strftime(format = "%Y-%m-%d %H:%M")
    cols1 = today_day+"(출근)"
    cols2 = today_day+"(퇴근)"
    
    if cols1 in filterd_db.columns:
        print("yess")
        ## 여기에는 그냥 해당사람 시간 넣으면 됨 
        Attend_t = filterd_db[cols1].values[0] 
    else:
        Attend_t = 'none'
    
    if cols2 in filterd_db.columns:
        print("yess")
        ## 여기에는 그냥 해당사람 시간 넣으면 됨 
        Leave_t = filterd_db[cols2].values[0]
    else:
        Leave_t = 'none'
    print(Attend_t==np.nan)
    if pd.isna(Attend_t):
        Attend_t='none'
    if pd.isna(Leave_t):
        Leave_t='none'
    name = session['NAME']

    print('Attend,Leave',Attend_t,Leave_t)
    return render_template("calendar-employee.html",Attend_t=Attend_t,Leave_t=Leave_t,name = name)


@app.route('/survey', methods=['GET','POST'])
@nocache
def survey():
    if(request.method=='GET'):
        print('aa')
        name = session['NAME']
        print(name)
        return render_template("survey.html",name =name)    
    elif(request.method=='POST'):

        def save_double_column_df(df, file_name, startrow = 0, **kwargs):
            '''Function to save doublecolumn DataFrame, to xlwriter'''
            # https://stackoverflow.com/questions/52497554/blank-line-below-headers-created-when-using-multiindex-and-to-excel-in-python
            
            # inputs:
            # df - pandas dataframe to save
            # xl_writer - book for saving
            # startrow - row from wich data frame will begins
            # **kwargs - arguments of `to_excel` function of DataFrame`
            with pd.ExcelWriter(file_name, mode='w') as writer:
                df.drop(df.index).to_excel(writer, startrow = startrow, **kwargs)
                df.to_excel(writer, startrow = startrow + 1, header = False, **kwargs)
        ## 작업
        survey_data  = request.get_json()
        print("survey_data",survey_data)
        numworkers = survey_data['numworkers']
        workersnormal = survey_data['workersnormal'].split(",")
        workershard = survey_data['workershard'].split(",")
        workersmorning = survey_data['workersmorning'].split(",")
        taskresult = survey_data['taskresult'].split("\n")
        additional = survey_data['additional'].split("\n")
        date = survey_data['date'].split(" ")[0]
        username = survey_data['username']

        

        work_info = pd.read_excel("./static/data/작업공수/작업입력.xlsx")
        worker_info  = pd.read_excel("./static/data/작업공수/작업자입력.xlsx",header=[0,1])
        print('worker_info',worker_info)
        print('work_info',work_info)

        if("Unnamed" in worker_info.columns[0][1]):
            worker_info = worker_info.iloc[:,1:]

        new_columns = [
            (("" if "Unnamed" in str(outer) else outer.strftime('%Y-%m-%d') if isinstance(outer, datetime) else outer), inner)
            for outer, inner in worker_info.columns
        ]

        # 새로운 컬럼 이름을 적용
        worker_info.columns = pd.MultiIndex.from_tuples(new_columns)

        

        if (date, '측정') in worker_info.columns:
            print("있으니깐 패스")
        else:
            data2 = pd.DataFrame({
                (date, '측정'): [],
                (date, '실'): [],
            })
            worker_info = pd.concat([worker_info,data2],axis=0)

        ## 사람만큼 공수 추가 (일반은 1, 오전,특수는 0.5)
        for worker_name in workersnormal:
            print(worker_name)
            print(worker_info.loc[worker_info[('','성명')]==worker_name])
            print(worker_info.loc[worker_info[('','성명')]==worker_name,(date, '측정')])
            if worker_info.loc[worker_info[('','성명')]==worker_name,(date, '측정')].isna().any():
                worker_info.loc[worker_info[('','성명')]==worker_name,(date, '측정')] = 0
            worker_info.loc[worker_info[('','성명')]==worker_name,(date, '측정')] += 1
            print(worker_info.loc[worker_info[('','성명')]==worker_name] )

        for worker_name in workershard:
           
            worker_info.loc[worker_info[('','성명')]==worker_name,(date, '측정')] += 0.5

        for worker_name in workersmorning:
            
            worker_info.loc[worker_info[('','성명')]==worker_name,(date, '측정')] += 0.5

        file_path = "./static/data/test.json"
        with open(file_path, 'r',encoding='utf-8') as outfile:
            old_df = pd.DataFrame(json.loads(json.load(outfile)))
        
        for task in taskresult:
            task_info = task.split("_")
            if len(task)>1:
                print(task)
                print(task_info)
                temp_task = pd.DataFrame({"작업날짜":[date],
                                        "위치_분류1":[task_info[2]],
                                        "위치_분류2":[task_info[3]],
                                        "작업_분류1":["??"],
                                        "작업_분류3":[task_info[4]+" "+task_info[5]],
                                        "공수":[float(task_info[6])],
                                        "인원":[int(numworkers)],
                                        "도급/직영":[task_info[1]],
                                        "특이사항":[additional[0]]
                                        })
                work_info = pd.concat([work_info,temp_task]).reset_index(drop=True)
                new_val = pd.DataFrame({"구간":[task_info[3]],"층":[task_info[2]],"세부구간":[task_info[4]],"중분류":[task_info[1]],"작업내용":[task_info[5]],"공수":[float(task_info[6])],"작업날짜":[date],"직종":["??"],"작업장명":[task_info[0]]})
                new_df = pd.concat([old_df,new_val]).reset_index(drop=True)
        #worker_info.columns = pd.MultiIndex.from_tuples(worker_info.columns)
        

        with open(file_path, 'w',encoding='utf-8') as outfile:
            json.dump(new_df.to_json(orient='records'), outfile, ensure_ascii=False, indent=4)

        if(len(worker_info)>1):
            print('worker_info',worker_info)
            #worker_info.to_excel()
            save_double_column_df(worker_info,"./static/data/작업공수/작업자입력.xlsx")
        if(len(work_info)>1):
            print('worker_info',work_info)
            work_info.to_excel("./static/data/작업공수/작업입력.xlsx", index=False)
        print(survey_data)
        return jsonify("success")

@app.route('/calendar', methods=['GET'])
@nocache
def calendar():
    print(session)
    if 'ADMIN' in session:
        if session['ADMIN']=='Y':
            name = session['NAME']
            admin = 'Y'
            file_path = './static/data/Attend.json'
            with open(file_path, 'r') as f:
                attend = json.load(f)['Attend']

            file_path = './static/data/Leave.json'
            with open(file_path, 'r') as f:
                leave = json.load(f)['Leave']
            return render_template('calendar-admin.html',name = name,admin=admin,attend=attend,leave=leave)
        else:
            name = session['NAME']
            admin='N'
            file_path = './static/data/Attend.json'
            with open(file_path, 'r') as f:
                attend = json.load(f)['Attend']

            file_path = './static/data/Leave.json'
            with open(file_path, 'r') as f:
                leave = json.load(f)['Leave']

            insadb = pd.read_excel("./static/data/INSA_DB.xlsx")

    
        
            filterd_db = insadb[insadb['ID']==session['ID']].reset_index(drop=True)
            ## 먼저 날짜 컬럼을 만들어야함 
            today_day = datetime.now().strftime(format = "%Y-%m-%d")
            today_time =  datetime.now().strftime(format = "%Y-%m-%d %H:%M")
            cols1 = today_day+"(출근)"
            cols2 = today_day+"(퇴근)"
            print(filterd_db)
            if cols1 in filterd_db.columns:
                print("yess")
                ## 여기에는 그냥 해당사람 시간 넣으면 됨 
                Attend_t = filterd_db[cols1].values[0]
            else:
                Attend_t = 'none'
            
            if cols2 in filterd_db.columns:
                print("yess")
                ## 여기에는 그냥 해당사람 시간 넣으면 됨 
                Leave_t = filterd_db[cols2].values[0]
            else:
                Leave_t = 'none'
         

            if pd.isna(Attend_t):
                Attend_t='none'
            if pd.isna(Leave_t):
                Leave_t='none'
                
            print('Attend,Leave',Attend_t,Leave_t)
            
            return render_template('calendar-employee.html',name = name,admin=admin,attend=attend,leave=leave,Attend_t=Attend_t,Leave_t=Leave_t)
        
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




@app.route('/attend-abled', methods=['POST'])
@nocache
def attendabled():
    print(request.get_json())
    data = request.get_json()
    file_path = './static/data/Attend.json'
    #data = json.loads(data)
    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    return jsonify('success')

@app.route('/attend-disabled', methods=['POST'])
@nocache
def attenddisabled():
    print(request.get_json())
    data = request.get_json()
    file_path = './static/data/Attend.json'
    #data = json.loads(data)
    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    return jsonify('success')


@app.route('/leave-abled', methods=['POST'])
@nocache
def leaveabled():
    print(request.get_json())
    data = request.get_json()
    file_path = './static/data/Leave.json'
    #data = json.loads(data)
    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    return jsonify('success')

@app.route('/leave-disabled', methods=['POST'])
@nocache
def leavedisabled():
    print(request.get_json())
    data = request.get_json()
    file_path = './static/data/Leave.json'
    #data = json.loads(data)
    with open(file_path, 'w') as outfile:
      json.dump(data, outfile, indent=4)
    return jsonify('success')


@app.route('/attend-check', methods=['POST'])
@nocache
def attendheck():
    
    # ID랑 비번으로 계정 매핑  
    insadb = pd.read_excel("./static/data/INSA_DB.xlsx")

    ## 먼저 날짜 컬럼을 만들어야함 
    today_day = datetime.now().strftime(format = "%Y-%m-%d")
    today_time =  datetime.now().strftime(format = "%Y-%m-%d %H:%M")
    cols = today_day+"(출근)"
    if cols in insadb.columns:
        print("yess")
        ## 여기에는 그냥 해당사람 시간 넣으면 됨 
        insadb.loc[insadb.ID==session['ID'],cols] = today_time

    else:
        print('no')
        insadb[cols]=""
        insadb.loc[insadb.ID==session['ID'],cols] = today_time

    insadb.to_excel("./static/data/INSA_DB.xlsx",index=False)



    return jsonify('success')




@app.route('/leave-check', methods=['POST'])
@nocache
def leaveheck():
    
    # ID랑 비번으로 계정 매핑  
    insadb = pd.read_excel("./static/data/INSA_DB.xlsx")

    ## 먼저 날짜 컬럼을 만들어야함 
    today_day = datetime.now().strftime(format = "%Y-%m-%d")
    today_time =  datetime.now().strftime(format = "%Y-%m-%d %H:%M")
    cols = today_day+"(퇴근)"
    if cols in insadb.columns:
        print("yess")
        ## 여기에는 그냥 해당사람 시간 넣으면 됨 
        insadb.loc[insadb.ID==session['ID'],cols] = today_time

    else:
        print('no')
        insadb[cols]=""
        insadb.loc[insadb.ID==session['ID'],cols] = today_time

    insadb.to_excel("./static/data/INSA_DB.xlsx",index=False)

    return jsonify('success')


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
    radio_nationality = register_data['radio_nationality']

    if radio_nationality=='총괄':
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
            "ADMIN":["Y"]
            
        })
    else:
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
