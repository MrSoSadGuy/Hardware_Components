from flask import render_template, request, json, send_file, jsonify, redirect, url_for                                                                  
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import app
from models import *
from saveData import *
from delData import *
from pon_models import *
from getData import *
from dwnlData import *


@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('main'))
    else:
        return redirect(url_for('login'))


@app.route('/login')
def login():
    return render_template("login.html")


@app.route('/logout')
@login_required
def logout():
    user = Users.query.get_or_404(current_user.get_id())
    print(str(datetime.now())+": Пользователь "+user.FIO+" вышел")
    logout_user()
    return redirect(url_for('login'), 301)


@app.route('/login/check_user', methods=['GET', 'POST'])
def login_page():
    req = request.form['json']
    login_data = json.loads(req)
    login = login_data['login']
    password = login_data['password']
    if (login != "") and (password != ""):
        user = Users.query.filter_by(login=login).scalar()
        if user is None:
            return json.dumps('Логин введен неправильно!')
        else:
            if check_password_hash(user.password, password):
                login_user(user)
                print(str(datetime.now())+": Пользователь "+user.FIO+" вошел")
                return json.dumps('SUCCESS')
            else:
                return json.dumps('Пароль введен неправильно!')
    else:
        return json.dumps('Не заполнены  поля логина или пароля')


@app.route('/change_password', methods=['GET', 'POST'])
@login_required
def change_password():
    request_new_pass = request.form['json']
    old_pass = str(json.loads(request_new_pass)["old_pass"])
    new_pass = str(json.loads(request_new_pass)["new_pass"])
    new_pass_2 = str(json.loads(request_new_pass)["new_pass_2"])
    user = Users.query.get_or_404(current_user.get_id())
    print(user.FIO)
    if check_password_hash(user.password, old_pass):
        if new_pass == new_pass_2:
            user.password = generate_password_hash(new_pass)
            return save_data_to_db()
        else:
            return jsonify("Новые пароли не совпадают")
    else:
        return jsonify("Старый пароль введен не верно")


@app.route('/main')
@login_required
def main():
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    return render_template("start_page.html", user_name=user_name)


@app.route('/pon_units')
@login_required
def pon_page():
    units = Unit.query.order_by(Unit.name_PON).all()
    kts_data = Data_for_KTS.query.all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    mols = MOLs.query.all()
    return render_template("index.html", units=units, user_name=user_name, kts_data=kts_data, mols = mols)


@app.route('/pon_units_new')
@login_required
def pon_page_new():
    ud = Uzel_dostupa.query.order_by(Uzel_dostupa.id).all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    mols = MOLs.query.all()
    return render_template("pon_page.html", ud=ud, user_name=user_name,  mols = mols)

@app.route('/multiple_access')
@login_required
def ma_page():
    new_obj_list = get_data_for_jinja()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    mols = MOLs.query.all()
    return render_template("MA_page.html",  user_name=user_name, new_obj_list=new_obj_list, mols = mols )


@app.route('/buh_data')
@login_required
def buh_data_page():
    buh_data = BuhUch.query.all()
    mols = MOLs.query.all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    return render_template("buh_data.html",  user_name=user_name, buh_data = buh_data, mols = mols)


@app.route('/get_data_from_db/<db_name>', methods=['GET', 'POST'])
@login_required
def get_data_from_db(db_name):
    req = request.form['json']
    user = Users.query.filter_by(id=current_user.get_id()).first()
    print(str(datetime.now())+': '+ user.FIO + " запрос на получение данных -- ", db_name, json.loads(req))
    db_req_lst = {
        'BuhUch':getBuhUchData,
        'olt_data': get_data_for_sostav,
        'list_of_modules': getLstMudules,
        'olt_data_2': getPonUnitData,
        'olt_data_3': get_used_unit_data,
        'olt_data_4': get_data_for_new_mod,
        'kts_data':getKTSdata,
        'kts_data_new':get_kts_data,
        'ma_add_modules':  getMAmodulesData,
        'MA_Unit_stor': getMAunitStorData,
        'MA_Units': getMAunitData,
        'Uzel_dostupa': getUDdata,
        'Uzel_dostupa_all':getAllUDdata,
        # 'Uzel_dostupa_lst':getUDlst,
        'MA_Units_to_usage': get_data_for_select,
        'ma_add_modules_to_usage': get_data_for_select,
        'list_of_modules_move': get_data_for_move,
        'Type_of_olt': getTypeOfOltDAta,
        'data4newPONunit':data4newPONunit,
        'Objects_ur_lica': getURdata
    }
    if db_name in db_req_lst:
        return db_req_lst.get(db_name)(req)


@app.route('/save_data/<db_name>', methods=['GET', 'POST'])
@login_required
def save_data(db_name):
    req_dict = json.loads(request.form['json'])
    user = Users.query.filter_by(id=current_user.get_id()).first()
    print(str(datetime.now()) +': '+ user.FIO + " запрос на внесение изменений или добавление новых записей -- ", db_name, req_dict)
    db_req_lst = {
        'KTS':save_kts_data,
        'sostav': save_sostav_data,
        'Buhuchet': save_buhuchet_data,
        'ma_add_modules_edited': save_ma_add_modules,
        'MA_Units_edited': save_ma_unit_data,
        'Unit': add_new_unit,
        'MA_Unit': add_ma_unit_data,
        'ma_add_modules': add_ma_add_modules,
        'Object_ur_lica': add_object_for_MA,
        'Objects_ur_lica_edited': save_object_for_MA,
        'list_of_modules': save_pon_modules,
        'olt_list': save_pon_olt_data,
        'olt_data_2': save_pon_olt_data,
        'Uzel_dostupa': save_ud_data,
        'add_new_pon_modules': add_new_pon_modules,
        'NewPONnit': addNewPONnit
    }
    if db_name in db_req_lst:
        return db_req_lst.get(db_name)(req_dict, user.FIO)
    

@app.route('/delete_row/<db_name>', methods=['GET', 'POST'])
@login_required
def delete_row(db_name):
    name = request.form['json']
    id = json.loads(name)["id"]
    user = Users.query.filter_by(id=current_user.get_id()).first()
    print(str(datetime.now()) +': '+ user.FIO + " запрос на удаление -- ", db_name, name)
    db_req_lst = {
        "ma_add_modules": delMAmodules,
        "Unit":delUnit,
        "BuhUch":delBuhdata,
        "MA_Units":delMAunit,
        "Objects_ur_lica":delUrObject,
        'List_of_modules': delPONmodul,
        'Uzel_dostupa':delUD
    }
    if db_name in db_req_lst:
        return db_req_lst.get(db_name)(id)


@app.route('/change_color/<db_name>', methods=['GET', 'POST'])
@login_required
def change_color(db_name):
    name = request.form['json']
    print(name)
    id = json.loads(name)["id"]
    color = json.loads(name)["color"]
    print('id: '+id,', color: '+color) 
    db_req_lst = {
        "Units":saveColorUnits,
        "BuhUch":saveColorBuhData,
        "Objects_ur_lica":saveColorMAunits,
        'List_of_modules':saveColorPONmodul
    }
    if db_name in db_req_lst:
        return db_req_lst.get(db_name)(id, color)
    

@app.route('/download/<file>/<name_PON>', methods=['GET', 'POST'])
@login_required
def downloadFile(name_PON, file):
    path = ""
    if file == "kts":
        path = create_file_KTS(name_PON)
    if file == "sostav":
        path = create_file_sostav(name_PON)
    return send_file(path, as_attachment=True)


@app.route('/main_table_data', methods=['GET', 'POST'])
@login_required
def main_table_data():
    name = request.form['json']
    list_data = json.loads(name)
    print(list_data)
    return createPONDatafile(list_data)


@app.route('/download/main_table/', methods=['GET', 'POST'])
@login_required
def main_table_data_download():
    path = 'files for download/Таблица оборудования PON.xlsx'
    return send_file(path, as_attachment=True)


@app.route('/buh_table_data', methods=['GET', 'POST'])
@login_required
def buh_table_data():
    name = request.form['json']
    list_data = json.loads(name)
    print(list_data)
    return createBuhDataFile(list_data)
    

@app.route('/download/buh_table/', methods=['GET', 'POST'])
@login_required
def buh_table_data_download():
    path = 'files for download/Бухгалтерские данные.xlsx'
    return send_file(path, as_attachment=True)
    