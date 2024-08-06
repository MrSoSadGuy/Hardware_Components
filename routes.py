from flask import render_template, request, json, send_file, jsonify
import openpyxl
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from app import app
from models import *


@app.route('/')
def index():
    return render_template("login.html")


@app.route('/main')
@login_required
def main():
    units = Unit.query.order_by(Unit.id).all()
    id = current_user.get_id()
    kts_data = Data_for_KTS.query.all()
    user = Users.query.get_or_404(id)
    user_name = user.FIO
    return render_template("index.html", units=units, user_name=user_name, kts_data=kts_data)


@app.route('/multiple_access')
@login_required
def ma_page():
    ma_units = MA_Unit.query.order_by(MA_Unit.id).all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    return render_template("MA_page.html",  user_name=user_name, ma_units=ma_units)


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    req = request.form['json']
    login_data = json.loads(req)
    login = login_data['login']
    password = login_data['password']
    if (login != "") and (password != ""):
        user = Users.query.filter_by(login=login).scalar()
        if user is None:
            return json.dumps('Логин или пароль введены неправильно!')
        else:
            # if check_password_hash(generate_password_hash(user.password), password):
            if check_password_hash(user.password, password):
                login_user(user)
                return json.dumps('SUCCESS')
            else:
                return json.dumps('Логин или пароль введены неправильно!')
    else:
        return json.dumps('Не заполнены  поля логина или пароля')


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return render_template("login.html")


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
            try:
                db.session.commit()
                return jsonify("SUCCESS")
            except:
                return jsonify("Произошла ошибка, обратитесь к администратору")
        else:
            return jsonify("Новые пароли не совпадают")
    else:
        return jsonify("Старый пароль введен не верно")


@app.route('/get_data_from_db/<db>', methods=['GET', 'POST'])
# @login_required
def get_data_from_db(db):
    req = request.form['json']
    print(db, json.loads(req))
    if db == 'BuhUch':
        buh = BuhUch.query.filter_by(inv_number=json.loads(req)).first()
        return jsonify(buh)
    if db == 'ma_add_modules':
        modules = ma_add_modules.query.filter_by(cod_name=json.loads(req)).all()
        return jsonify(modules)
    else:
        return None


@app.route('/delete_table_row', methods=['GET', 'POST'])
@login_required
def delete_table_row():
    name = request.form['json']
    id = int(json.loads(name)["id"])
    unit = Unit.query.get_or_404(id)
    try:
        db.session.delete(unit)
        db.session.commit()
        return jsonify("SUCCESS")
    except:
        return jsonify("ERROR")

@app.route('/delete_row/<base_table>', methods=['GET', 'POST'])
@login_required
def delete_row(base_table):
    name = request.form['json']
    id = int(json.loads(name)["id"])
    db_obj = ""
    if base_table == "ma_add_modules":
        db_obj = ma_add_modules.query.get_or_404(id)
    if base_table == "Units":
        db_obj = Unit.query.get_or_404(id)
    if base_table == "MA_Unit":
        db_obj = MA_Unit.query.get_or_404(id)
    try:
        db.session.delete(db_obj)
        db.session.commit()
        return jsonify("SUCCESS")
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return json.dumps(f"Unexpected {err=}, {type(err)=}")


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
    print(db_name)
    req_dict = json.loads(request.form['json'])
    print(req_dict)
    if db_name == 'KTS':
        return save_kts_data(req_dict)
    if db_name == 'sostav':
        return save_sostav_data(req_dict)
    if db_name == 'Buhuchet':
        return save_buhuchet_data(req_dict)
    if db_name == 'Unit':
        return add_new_unit(req_dict)
    if db_name == 'MA_Unit_new':
        return add_ma_unit_data(req_dict)
    if db_name == 'ma_add_modules':
        return save_ma_add_modules(req_dict)


def save_ma_add_modules(req_dict):
    user = Users.query.filter_by(id=current_user.get_id()).first()
    if request.method == 'POST':
        ma_modules = ma_add_modules(cod_name=req_dict["cod_name"],
                    type=req_dict["type"],
                    modules_name=req_dict["modules_name"],
                    inv_number=req_dict["inv_number"],
                    serial_number=req_dict["serial_number"],
                    port=req_dict["port"],
                    size=req_dict["size"],
                    note=req_dict["note"],
                    creator=user.FIO)
        try:
            app.app_context()
            db.session.add(ma_modules)
            db.session.commit()
            return jsonify("SUCCESS")
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}")
            return json.dumps(f"Unexpected {err=}, {type(err)=}")
    else:
        return json.dumps("NOT 'POST' REQUEST")


def add_new_unit(req_dict):
    user = Users.query.filter_by(id=current_user.get_id()).first()
    if request.method == 'POST':
        unit = Unit(ud_punkt=req_dict["ud_punkt"],
                    name_PON=req_dict["name_PON"],
                    name_unit=req_dict["name_unit"],
                    inv_number=req_dict["inv_number"],
                    serial_number=req_dict["serial_number"],
                    row_mesto=req_dict["row_mesto"],
                    plata_mesto=req_dict["plata_mesto"],
                    creator=user.FIO)
        try:
            app.app_context()
            db.session.add(unit)
            db.session.commit()
            return jsonify("SUCCESS")
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}")
            return json.dumps(f"Unexpected {err=}, {type(err)=}")
    else:
        return json.dumps("NOT 'POST' REQUEST")


# def add_new_ma_unit(req_dict):
#     user = Users.query.filter_by(id=current_user.get_id()).first()
#     if request.method == 'POST':
#         ma_unit = MA_Unit(ud_punkt=req_dict["ud_punkt"],
#                     name_PON=req_dict["name_PON"],
#                     name_unit=req_dict["name_unit"],
#                     inv_number=req_dict["inv_number"],
#                     serial_number=req_dict["serial_number"],
#                     row_mesto=req_dict["row_mesto"],
#                     plata_mesto=req_dict["plata_mesto"],
#                     creator=user.FIO)
#         try:
#             app.app_context()
#             db.session.add(ma_unit)
#             db.session.commit()
#             return jsonify("SUCCESS")
#         except Exception as err:
#             print(f"Unexpected {err=}, {type(err)=}")
#             return json.dumps(f"Unexpected {err=}, {type(err)=}")
#     else:
#         return json.dumps("NOT 'POST' REQUEST")

def save_kts_data(req_dict):
    kts_data = Data_for_KTS.query.all()
    user = Users.query.filter_by(id=current_user.get_id()).first()
    if request.method == 'POST':
        for kts in kts_data:
            if kts.cod_name == req_dict["cod_name"].strip().upper():
                kts.UD = req_dict["UD"].strip()
                kts.IP = req_dict["IP"].strip()
                kts.OLT = req_dict["OLT"].strip()
                kts.inv_number = req_dict["inv_number"].strip()
                kts.Serial = req_dict["Serial"].strip()
                kts.date_of_production = req_dict["date_of_production"].strip()
                kts.date_of_entry = req_dict["date_of_entry"].strip()
                kts.full_name = req_dict["full_name"].strip()
                kts.mesto = req_dict["mesto"].strip()
                kts.zavod = req_dict["zavod"].strip()
                try:
                    app.app_context()
                    db.session.commit()
                    return jsonify("SUCCESS")
                except Exception as err:
                    print(f"Unexpected {err=}, {type(err)=}")
                    return json.dumps(f"Unexpected {err=}, {type(err)=}")
        kts_data = Data_for_KTS(cod_name=req_dict["cod_name"].strip().upper(),
                                IP=req_dict["IP"].strip(),
                                OLT=req_dict["OLT"].strip(),
                                inv_number=req_dict["inv_number"].strip(),
                                Serial=req_dict["Serial"].strip(),
                                date_of_production=req_dict["date_of_production"].strip(),
                                date_of_entry=req_dict["date_of_entry"].strip(),
                                full_name=req_dict["full_name"].strip(),
                                mesto=req_dict["mesto"].strip(),
                                zavod=req_dict["zavod"].strip())
        try:
            app.app_context()
            db.session.add(kts_data)
            db.session.commit()
            return jsonify("SUCCESS")
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}" + " ")
            return json.dumps(f"Unexpected {err=}, {type(err)=}")
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_buhuchet_data(req_dict):
    buh = BuhUch.query.all()
    user = Users.query.filter_by(id=current_user.get_id()).first()
    if request.method == 'POST':
        for b in buh:
            if b.inv_number == req_dict["inv_number"].strip():
                b.MOL = req_dict["MOL"].strip()
                b.charracter = req_dict["charracter"]
                b.note = req_dict["note"]
                b.editor = user.FIO
                print(user.FIO, datetime.now())
                b.last_edit_date = datetime.now()
                try:
                    app.app_context()
                    db.session.commit()
                    return jsonify("SUCCESS")
                except Exception as err:
                    print(f"Unexpected {err=}, {type(err)=}")
                    return json.dumps(f"Unexpected {err=}, {type(err)=}")
        buh = BuhUch(inv_number=req_dict["inv_number"].strip(),
                     MOL=req_dict["MOL"].strip(),
                     charracter=req_dict["charracter"],
                     note=req_dict["note"],
                     creator=user.FIO)
        try:
            app.app_context()
            db.session.add(buh)
            db.session.commit()
            return jsonify("SUCCESS")
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}" + " ")
            return json.dumps(f"Unexpected {err=}, {type(err)=}")
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_sostav_data(req_dict):
    unit = Unit.query.get_or_404(int(req_dict["id"]))
    user = Users.query.filter_by(id=current_user.get_id()).first()
    if request.method == 'POST':
        unit.ud_punkt = req_dict["ud_punkt"]
        unit.name_PON = req_dict["name_PON"]
        unit.name_unit = req_dict["name_unit"]
        unit.inv_number = req_dict["inv_number"]
        unit.serial_number = req_dict["serial_number"]
        unit.row_mesto = req_dict["row_mesto"]
        unit.plata_mesto = req_dict["plata_mesto"]
        unit.note = req_dict["note"]
        unit.editor = user.FIO
        unit.last_date_edit = datetime.now()
        try:
            db.session.commit()
            return jsonify("SUCCESS")
        except Exception as err:
            return json.dumps(f"Unexpected {err=}, {type(err)=}")
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_ma_unit_data(req_dict):
    ma_unit = MA_Unit.query.get_or_404(int(req_dict["id"]))
    user = Users.query.filter_by(id=current_user.get_id()).first()
    if request.method == 'POST':
        ma_unit.cod_name = req_dict["cod_name"]
        ma_unit.organization = req_dict["organization"]
        ma_unit.address = req_dict["address"]
        ma_unit.type_equipment = req_dict["type_equipment"]
        ma_unit.inv_number = req_dict["inv_number"]
        ma_unit.naklodnaja = req_dict["naklodnaja"]
        ma_unit.serial_number = req_dict["serial_number"]
        ma_unit.IP = req_dict["IP"]
        ma_unit.ORSH = req_dict["ORSH"]
        ma_unit.note = req_dict["note"]
        ma_unit.editor = user.FIO
        ma_unit.last_date_edit = datetime.now()
        try:
            db.session.commit()
            return jsonify("SUCCESS")
        except Exception as err:
            return json.dumps(f"Unexpected {err=}, {type(err)=}")
    else:
        return json.dumps("NOT 'POST' REQUEST")