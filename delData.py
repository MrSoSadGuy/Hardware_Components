from flask import json, jsonify, Response
from models import *
from pon_models import *


def delete_data_from_db(data):
    try:
        db.session.delete(data)
        db.session.commit()
        print("SUCCESS")
        return jsonify("SUCCESS")
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return json.dumps(f"Unexpected {err=}, {type(err)=}")
    
    
def delMAmodules(id):
    db_obj = ma_add_modules.query.get_or_404(int(id))
    return delete_data_from_db(db_obj)


def delUnit(id):
    db_obj = Unit.query.get_or_404(int(id))
    return delete_data_from_db(db_obj)


def delBuhdata(id):
    db_obj = BuhUch.query.get_or_404(int(id))
    return delete_data_from_db(db_obj)


def delMAunit(id):
    db_obj = MA_Units.query.get_or_404(int(id))
    if len(db_obj.modules) > 0:
        for modules in db_obj.modules:
            delete_data_from_db(modules)
            
            
def delUrObject(id):
    db_obj = Objects_ur_lica.query.get_or_404(int(id))
    if len(db_obj.unit) > 0:
        return jsonify("На объекте установленно устройство!!!! \n Переместите его на склад")
    else: return delete_data_from_db(db_obj)
    
def delPONmodul(id):
    db_obj = List_of_modules.query.get_or_404(int(id))
    return delete_data_from_db(db_obj)

def delUD(id):
    db_obj = Uzel_dostupa.query.get_or_404(int(id))
    if len(db_obj.cod_name_of_olt) > 0:
        return jsonify("На объекте установленно устройство!!!! \n Переместите его на склад"), 420
    else: return delete_data_from_db(db_obj)