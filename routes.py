from flask import render_template, request, json, send_file, jsonify, redirect, url_for
import openpyxl
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from app import app
from models import *
from add_save_del import *


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
    print("Пользователь "+user.FIO+" вышел " + str(datetime.now()))
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
                print("Пользователь "+user.FIO+" вошел " + str(datetime.now()))
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
            save_data_to_db()
        else:
            return jsonify("Новые пароли не совпадают")
    else:
        return jsonify("Старый пароль введен не верно")


@app.route('/main')
@login_required
def main():
    units = Unit.query.order_by(Unit.id).all()
    kts_data = Data_for_KTS.query.all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    return render_template("index.html", units=units, user_name=user_name, kts_data=kts_data)


@app.route('/multiple_access')
@login_required
def ma_page():
    ma_units = MA_Unit.query.order_by(MA_Unit.id).all()
    ma_add_mod = ma_add_modules.query.order_by(ma_add_modules.id).all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    return render_template("MA_page.html",  user_name=user_name, ma_units=ma_units, ma_add_mod=ma_add_mod)


@app.route('/get_data_from_db/<db>', methods=['GET', 'POST'])
@login_required
def get_data_from_db(db):
    req = request.form['json']
    print("запрос на получение данных -- ", db, json.loads(req))
    if db == 'BuhUch':
        buh = BuhUch.query.filter_by(inv_number=json.loads(req)).first()
        return jsonify(buh)
    if db == 'ma_add_modules':
        modules = ma_add_modules.query.filter_by(cod_name=json.loads(req)).all()
        return jsonify(modules)
    if db == 'MA_Unit':
        modules = MA_Unit.query.filter_by(cod_name=json.loads(req).upper()).all()
        return jsonify(modules)
    else:
        return None


@app.route('/delete_row/<base_table>', methods=['GET', 'POST'])
@login_required
def delete_row(base_table):
    name = request.form['json']
    id = int(json.loads(name)["id"])
    user = Users.query.filter_by(id=current_user.get_id()).first()
    print(user.FIO, datetime.now())
    print("запрос на удаление -- ", base_table, name)
    db_obj = ""
    if base_table == "ma_add_modules":
        db_obj = ma_add_modules.query.get_or_404(id)
    if base_table == "Unit":
        db_obj = Unit.query.get_or_404(id)
    if base_table == "MA_Unit":
        db_obj = MA_Unit.query.get_or_404(id)
    return delete_data_from_db(db_obj)


@app.route('/download/<file>/<name_PON>', methods=['GET', 'POST'])
@login_required
def downloadFile(name_PON, file):
    path = ""
    if file == "kts":
        path = create_file_KTS(name_PON)
    if file == "sostav":
        path = create_file_sostav(name_PON)
    return send_file(path, as_attachment=True)


@app.route('/download/main_table/', methods=['GET', 'POST'])
@login_required
def main_table_data_download():
    path = 'files for download/Таблица оборудования PON.xlsx'
    return send_file(path, as_attachment=True)


@app.route('/main_table_data', methods=['GET', 'POST'])
@login_required
def main_table_data():
    name = request.form['json']
    print(json.loads(name))
    list_data = json.loads(name)
    print(type(list_data))
    start_row = 4
    path = 'files for download\шаблон Таблица оборудования PON.xlsx'
    try:
        wb_obj = openpyxl.load_workbook(path)
        sheet = wb_obj.active
        for id in list_data:
            print(id)
            unit = Unit.query.get_or_404(int(id))
            sheet["B" + str(start_row)] = unit.ud_punkt
            sheet["C" + str(start_row)] = unit.name_PON
            sheet["D" + str(start_row)] = unit.name_unit
            sheet["E" + str(start_row)] = unit.inv_number
            sheet["F" + str(start_row)] = unit.serial_number
            sheet["A" + str(start_row)] = unit.row_mesto
            sheet["G" + str(start_row)] = unit.plata_mesto
            start_row = start_row + 1
        wb_obj.save('files for download\Таблица оборудования PON.xlsx')
        return json.dumps("SUCCESS")
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return json.dumps(f"Unexpected {err=}, {type(err)=}")


def create_file_sostav(name_PON):
    unit1 = Unit.query.filter_by(name_PON=name_PON).all()
    print(name_PON)
    print("UL" in name_PON)
    if "UL" in name_PON:
        book = openpyxl.load_workbook('files for download\шаблон.xlsx')
        sheet = book['Huawei']
        del book['ZTE']
        plata_row = 5
    if "OL" in name_PON:
        book = openpyxl.load_workbook('files for download\шаблон.xlsx')
        sheet = book['ZTE']
        del book['Huawei']
        plata_row = 6
    for un in unit1:
        row = int(un.plata_mesto) + plata_row
        sheet['B' + str(row)] = un.inv_number
        sheet['C' + str(row)] = un.name_unit
        sheet['D' + str(row)] = un.serial_number
    book.save("files for download\Состав оборудования " + name_PON + ".xlsx")
    return "files for download\Состав оборудования " + name_PON + ".xlsx"


def create_file_KTS(name_PON):
    kts = Data_for_KTS.query.filter_by(cod_name=name_PON).first()
    print(kts)
    user = Users.query.get(current_user.get_id())
    print(user.FIO)
    book = openpyxl.load_workbook('files for download\КТС_шаблон.xlsx')
    sheet = book.active
    sheet['A3'] = kts.full_name
    sheet['A4'] = kts.cod_name
    sheet['A8'] = kts.UD + ", " + kts.mesto + ", ip: " + kts.IP
    sheet['E15'] = kts.zavod
    sheet['L18'] = kts.date_of_production
    sheet['G21'] = kts.Serial
    sheet['L24'] = kts.inv_number
    sheet['L27'] = kts.date_of_entry
    sheet['L30'] = str(datetime.now().strftime("%d/%m/%Y"))
    sheet['J39'] = user.FIO
    book.save("files for download\КТС.xlsx")
    return "files for download\КТС.xlsx"


@app.route('/save_data/<db_name>', methods=['GET', 'POST'])
@login_required
def save_data(db_name):
    req_dict = json.loads(request.form['json'])
    user = Users.query.filter_by(id=current_user.get_id()).first()
    print(user.FIO, datetime.now())
    print("запрос на внесение изменений или добавление новых записей -- ", db_name, req_dict)
    if db_name == 'KTS':
        return save_kts_data(req_dict, user.FIO)
    if db_name == 'sostav':
        return save_sostav_data(req_dict, user.FIO)
    if db_name == 'Buhuchet':
        return save_buhuchet_data(req_dict, user.FIO)
    if db_name == 'Unit':
        return add_new_unit(req_dict, user.FIO)
    if db_name == 'Ma_Units_edited':
        return save_ma_unit_data(req_dict, user.FIO)
    if db_name == 'MA_Unit':
        return add_ma_unit_data(req_dict, user.FIO)
    if db_name == 'ma_add_modules':
        return add_ma_add_modules(req_dict, user.FIO)
    if db_name == 'ma_add_modules_edited':
        return save_ma_add_modules(req_dict, user.FIO)