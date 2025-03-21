from flask import render_template, request, json, send_file, jsonify, redirect, url_for ,make_response                                                                 
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import app
from models import *
from saveData import *
from delData import *
from pon_models import *
from getData import *
from dwnlData import *
from admin import auth_role
from forms import *





@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('main'))
    else:
        return redirect(url_for('login'))


@app.route('/login', methods=["GET", "POST"])
def login():
    app.logger.info("login page accessed")
    form = LoginForm(request.form)
    if form.validate_on_submit():
        user = Users.query.filter_by(login = form.login.data).scalar()
        if user is None:
            form.login.errors.append("Не верное имя пользователя!")
            app.logger.warning(f'login: {login} - incorrect')
        if user is not None and not user.verify_password(form.password.data):
            form.password.errors.append("Не верный пароль!")
            app.logger.warning('f"user: {login} - password incorrect')
        if user is not None and user.verify_password(form.password.data):
            login_user(user)
            return redirect(url_for('main'))      
    return render_template(
        "login.html",
        form=form,
        template="form-template"
    )

# @app.route('/login')
# def login():
#     app.logger.info("login page accessed")
#     return render_template("login.html")


@app.route('/logout')
@login_required
def logout():
    app.logger.info("user logout")
    logout_user()
    return redirect(url_for('login'), 301)


# @app.route('/admin')
# @login_required
# def admin():
#     return redirect(url_for('admin'), 301)


# @app.route('/login/check_user', methods=['GET', 'POST'])
# def login_page():
#     req = request.form['json']
#     login_data = json.loads(req)
#     login = login_data['login']
#     password = login_data['password']
#     if (login != "") and (password != ""):
#         user = Users.query.filter_by(login=login).scalar()
#         if user is None:
#             app.logger.warning(f'login: {login} - incorrect')
#             return json.dumps('Логин введен неправильно!')
#         else:
#             if check_password_hash(user.password, password):
#                 login_user(user)
#                 app.logger.info(f"user: {login} login")
#                 return json.dumps('SUCCESS')
#             else:
#                 app.logger.warning('f"user: {login} - password incorrect')
#                 return json.dumps('Пароль введен неправильно!')
#     else:
#         app.logger.warning('empty inputs')
#         return json.dumps('Не заполнены  поля логина или пароля')


@app.route('/change_password', methods=['GET', 'POST'])
@login_required
@auth_role(['admin','user'])
def change_password():
    form = ChangePassForm(request.form)
    print(current_user.FIO)
    if form.validate_on_submit():
        if current_user.verify_password(form.password.data):
            current_user.password_hash = generate_password_hash(form.newpass.data)
            save_data_to_db()
            # return redirect(url_for('main'))
        else:
            form.oldpass.errors.append("Не верный пароль")

    return render_template(
        # "login.html",
        form=form,
        template="form-template"
    )

# @app.route('/change_password', methods=['GET', 'POST'])
# @login_required
# @auth_role(['admin','user'])
# def change_password():
#     request_new_pass = request.form['json']
#     old_pass = str(json.loads(request_new_pass)["old_pass"])
#     new_pass = str(json.loads(request_new_pass)["new_pass"])
#     new_pass_2 = str(json.loads(request_new_pass)["new_pass_2"])
#     user = Users.query.get_or_404(current_user.get_id())
#     print(user.FIO)
#     if check_password_hash(user.password, old_pass):
#         if new_pass == new_pass_2:
#             user.password = generate_password_hash(new_pass)
#             result = save_data_to_db()
#             app.logger.info(f"user: {user.login} changed password : {result}")
#             return result
#         else:
#             return jsonify("Новые пароли не совпадают")
#     else:
#         app.logger.warning(f'user: {user.login} - old password incorrect')
#         return jsonify("Старый пароль введен не верно")


@app.route('/main')
@login_required
def main():
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    return render_template("start_page.html", user_name=user_name)


@app.route('/pon_units_new')
@login_required
@auth_role(['admin','user','viewer'])
def pon_page_new():
    ud = Uzel_dostupa.query.order_by(Uzel_dostupa.id).all()
    print(ud)
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    mols = MOLs.query.all()
    app.logger.info("pon_page accessed")
    return render_template("pon_page.html", ud=ud, user_name=user_name,  mols = mols)

@app.route('/multiple_access')
@login_required
@auth_role(['admin','user','viewer'])
def ma_page():
    new_obj_list = get_data_for_jinja()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    mols = MOLs.query.all()
    app.logger.info("ma_page accessed")
    return render_template("ma_page.html",  user_name=user_name, new_obj_list=new_obj_list, mols = mols )


@app.route('/buh_data')
@login_required
@auth_role(['admin','user','viewer'])
def buh_data_page():
    buh_data = BuhUch.query.all()
    mols = MOLs.query.all()
    user = Users.query.get_or_404(current_user.get_id())
    user_name = user.FIO
    app.logger.info("buh_page accessed")
    return render_template("buh_page.html",  user_name=user_name, buh_data = buh_data, mols = mols)

@app.route('/get_data/<db_name>/<req>', methods=['GET'])
@login_required
@auth_role(['admin','user','viewer'])
def get_data(db_name,req):
    user = Users.query.filter_by(id=current_user.get_id()).first()

    app.logger.info(f'user: {user.login} get data from db -- , {db_name}, {req}')
    db_req_lst = {
        #Многопртовики
                'Objects_ur_lica': getURdata,
                'MA_Units': getMAunitData,
                'MA_Units_to_usage': get_data_for_ma_un_select,
                'ma_add_modules_to_usage': get_data_for_ma_mod_select,
                'MA_Unit_type': getMAunitype,
                'MA_module_type': getMAmodtype,
        #PON
                'Uzel_dostupa': getUDdata,
                'Uzel_dostupa_all':getAllUDdata,
                'kts_data_new':get_unit_data,
                'Type_of_olt': getTypeOfOltDAta,
                'olt_data': get_data_for_sostav,
                'olt_data_2': getPonUnitData,
                'olt_data_3': get_used_unit_data,
                'olt_data_4': get_data_for_new_mod,
                'list_of_modules': getLstMudules,
                'list_of_modules_move': get_data_for_move,
        'BuhUch':getBuhUchData
    }
    if db_name in db_req_lst:
        return db_req_lst.get(db_name)(req)

@app.route('/save_data/<req>', methods=['POST'])
@login_required
@auth_role(['admin','user'])
def save_data(req):
    data = json.loads(request.form['json'])
    user = Users.query.filter_by(id=current_user.get_id()).first()
    db_req_lst = {
        'KTS':save_pon_olt_data,
        'Buhuchet': save_buhuchet_data,
        'ma_add_modules_edited': save_ma_add_modules,
        'MA_Units_edited': save_ma_unit_data,
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
    if req in db_req_lst:
        result = db_req_lst.get(req)(data, user.login)
        app.logger.info(f'user: {user.login} -- save data to db -- db_req: {req}, data: {str(data)}, result: {str(result)}')
        return result
    

@app.route('/delete_data/<db_name>', methods=['POST'])
@login_required
@auth_role(['admin','user'])
def delete_data(db_name):
    user = Users.query.filter_by(id=current_user.get_id()).first()
    name = request.form['json']
    id = json.loads(name)["id"]
    db_req_lst = {
        "ma_add_modules": delMAmodules,
        "BuhUch":delBuhdata,
        "MA_Units":delMAunit,
        "Objects_ur_lica":delUrObject,
        'List_of_OLT': delPONunit,
        'List_of_modules': delPONmodul,
        'Uzel_dostupa':delUD
    }
    if db_name in db_req_lst:
        result = db_req_lst.get(db_name)(id)
        app.logger.info(f'user: {user.login} -- delete data from db -- db_req: {db_name}, data: {str(id)}, result: {str(result)}')
        return result


@app.route('/change_color/<db_name>', methods=['GET', 'POST'])
@login_required
@auth_role(['admin','user'])
def change_color(db_name):
    user = Users.query.filter_by(id=current_user.get_id()).first()
    name = request.form['json']
    id = json.loads(name)["id"]
    color = json.loads(name)["color"]
    db_req_lst = {
        "BuhUch":saveColorBuhData,
        "Objects_ur_lica":saveColorMAunits,
        'List_of_modules':saveColorPONmodul
    }
    if db_name in db_req_lst:
        result = db_req_lst.get(db_name)(id, color)
        app.logger.info(f'user: {user.Login} -- change row color -- db_req: {db_name}, data: {str(id)}, result: {str(result)}')
        return result
    

@app.route('/download/<file>/<name_PON>', methods=['GET', 'POST'])
@login_required
@auth_role(['admin','user'])
def downloadFile(name_PON, file):
    path = ""
    if file == "kts":
        path = create_file_KTS(name_PON)
    if file == "sostav":
        path = create_file_sostav(name_PON)
    return send_file(path, as_attachment=True)


@app.route('/main_table_data', methods=['GET', 'POST'])
@login_required
@auth_role(['admin','user'])
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
@auth_role(['admin','user'])
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

