from flask import request, json, jsonify

from app import app
from models import *


def add_data_to_db(data):
    try:
        app.app_context()
        db.session.add(data)
        db.session.commit()
        print("SUCCESS")
        return jsonify("SUCCESS")
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return json.dumps(f"Unexpected {err=}, {type(err)=}")


def save_data_to_db():
    try:
        app.app_context()
        db.session.commit()
        print("SUCCESS")
        return jsonify("SUCCESS")
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return json.dumps(f"Unexpected {err=}, {type(err)=}")


def delete_data_from_db(data):
    try:
        db.session.delete(data)
        db.session.commit()
        print("SUCCESS")
        return jsonify("SUCCESS")
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return json.dumps(f"Unexpected {err=}, {type(err)=}")


def add_new_unit(req_dict, name):
    if request.method == 'POST':
        unit = Unit(ud_punkt=req_dict["0"],
                    name_PON=req_dict["1"].upper().replace(' ',''),
                    name_unit=req_dict["2"],
                    inv_number=req_dict["3"],
                    serial_number=req_dict["4"],
                    row_mesto=req_dict["5"],
                    plata_mesto=req_dict["6"],
                    color='',
                    note="",
                    creator=name)
        return add_data_to_db(unit)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def add_ma_unit_data(req_dict, name):
    if request.method == 'POST':
        ma_unit = MA_Units(
                        type_equipment=req_dict["0"],
                        inv_number=req_dict["1"],
                        serial_number=req_dict["2"],
                        note=req_dict["3"],
                        object_id=req_dict["add_p"],
                        creator=name)
        return add_data_to_db(ma_unit)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def add_object_for_MA(req_dict, name):
    if request.method == 'POST':
        obj = Objects_ur_lica(cod_name=req_dict["0"].upper().replace(' ',''),
                        organization=req_dict["1"],
                        address=req_dict["2"],
                        ORSH=req_dict["3"],
                        color="",
                        creator=name)
        return add_data_to_db(obj)
    else:
        return json.dumps("NOT 'POST' REQUEST")
    
    
    
def add_ma_add_modules(req_dict, name):
    if request.method == 'POST':
        ma_modules = ma_add_modules(ma_unit_id = req_dict["add_p"],
                                    type=req_dict["0"],
                                    inv_number=req_dict["1"],
                                    serial_number=req_dict["2"],
                                    note=req_dict["3"],
                                    creator = name)
        return add_data_to_db(ma_modules)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_kts_data(req_dict, name):
    kts_data = Data_for_KTS.query.all()
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
                return save_data_to_db()
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
        return add_data_to_db(kts_data)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_buhuchet_data(req_dict, name):
    buh = BuhUch.query.all()    
    if request.method == 'POST':
        m_name = MOLs.query.filter_by(full_name = req_dict["MOL"].strip()).first()
        for b in buh:
            if b.inv_number == req_dict["inv_number"].strip():
                b.MOL_id = m_name.id
                b.charracter = req_dict["charracter"]
                b.name = req_dict['name']
                b.note = req_dict["note"]
                b.editor = name
                b.last_edit_date = datetime.now()
                return save_data_to_db()
        print(m_name, m_name.id)
        buh = BuhUch(inv_number=req_dict["inv_number"].strip(),
                    MOL_id=m_name.id,
                    charracter=req_dict["charracter"],
                    name = req_dict['name'],
                    note=req_dict["note"],
                    color='',
                    creator=name)
        return add_data_to_db(buh)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_sostav_data(req_dict, name):
    unit = Unit.query.get_or_404(int(req_dict["id"]))
    if request.method == 'POST':
        unit.ud_punkt = req_dict["ud_punkt"]
        unit.name_PON = req_dict["name_PON"]
        unit.name_unit = req_dict["name_unit"]
        unit.inv_number = req_dict["inv_number"]
        unit.serial_number = req_dict["serial_number"]
        unit.row_mesto = req_dict["row_mesto"]
        unit.plata_mesto = req_dict["plata_mesto"]
        unit.note = req_dict["note"]
        unit.editor = name
        unit.last_date_edit = datetime.now()
        return save_data_to_db()
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_ma_add_modules(req_dict, name):
    ma_add_mod = ma_add_modules.query.get_or_404(int(req_dict["id"]))
    if request.method == 'POST':
        if 'parent_obj' in req_dict :
            ma_add_mod.ma_unit_id = int(req_dict['parent_obj'])
        else:
            ma_add_mod.type = req_dict["0"]
            ma_add_mod.inv_number = req_dict["1"]
            ma_add_mod.serial_number = req_dict["2"]
            ma_add_mod.note = req_dict["3"]
            ma_add_mod.editor = name
            ma_add_mod.last_date_edit = datetime.now()
        return save_data_to_db()
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_ma_unit_data(req_dict, name):
    ma_unit = MA_Units.query.get_or_404(int(req_dict["id"]))
    if request.method == 'POST':
        if 'parent_obj' in req_dict :
            ma_unit.object_id = int(req_dict['parent_obj'])
        else:
            ma_unit.type_equipment = req_dict["0"]
            ma_unit.inv_number = req_dict["1"]
            ma_unit.serial_number = req_dict["2"]
            ma_unit.note = req_dict["3"]
            ma_unit.editor = name
            ma_unit.last_date_edit = datetime.now()
        return save_data_to_db()
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_object_for_MA(req_dict, name):
    obj = Objects_ur_lica.query.get_or_404(int(req_dict["id"]))
    if request.method == 'POST':
        if 'parent_obj' in req_dict :
            obj.object_id = int(req_dict['parent_obj'])
        else:
            obj.cod_name = req_dict["cod_name"]
            obj.organization = req_dict["organization"]
            obj.address = req_dict["address"]
            obj.naklodnaja = req_dict["naklodnaja"]
            obj.IP = req_dict["IP"]
            obj.install_date = req_dict["install_date"]
            obj.ORSH = req_dict["ORSH"]
            obj.note = req_dict["note"]
            obj.editor = name
            obj.last_date_edit = datetime.now()
        return save_data_to_db()
    else:
        return json.dumps("NOT 'POST' REQUEST")
    