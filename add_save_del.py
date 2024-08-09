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
                    name_PON=req_dict["1"],
                    name_unit=req_dict["2"],
                    inv_number=req_dict["3"],
                    serial_number=req_dict["4"],
                    row_mesto=req_dict["5"],
                    plata_mesto=req_dict["6"],
                    creator=name)
        return add_data_to_db(unit)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def add_ma_unit_data(req_dict, name):
    if request.method == 'POST':
        ma_unit = MA_Unit(cod_name=req_dict["0"],
                        type_equipment=req_dict["1"],
                        organization=req_dict["2"],
                        address=req_dict["3"],
                        IP=req_dict["4"],
                        inv_number=req_dict["5"],
                        naklodnaja=req_dict["6"],
                        ORSH=req_dict["7"],
                        creator=name)
        return add_data_to_db(ma_unit)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def add_ma_add_modules(req_dict, name):
    if request.method == 'POST':
        ma_modules = ma_add_modules(cod_name=req_dict["add_p"],
                                    type=req_dict["0"],
                                    modules_name=req_dict["1"],
                                    inv_number=req_dict["2"],
                                    serial_number=req_dict["3"],
                                    port=req_dict["4"],
                                    size=req_dict["5"],
                                    note=req_dict["6"],
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
        for b in buh:
            if b.inv_number == req_dict["inv_number"].strip():
                b.MOL = req_dict["MOL"].strip()
                b.charracter = req_dict["charracter"]
                b.note = req_dict["note"]
                b.editor = name
                b.last_edit_date = datetime.now()
                return save_data_to_db()
        buh = BuhUch(inv_number=req_dict["inv_number"].strip(),
                     MOL=req_dict["MOL"].strip(),
                     charracter=req_dict["charracter"],
                     note=req_dict["note"],
                     creator=name)
        return add_data_to_db(buh)
    else:
        return json.dumps("NOT 'POST' REQUEST")


def save_ma_add_modules(req_dict, name):
    ma_add_mod = ma_add_modules.query.get_or_404(int(req_dict["id"]))
    if request.method == 'POST':
        ma_add_mod.type = req_dict["0"]
        ma_add_mod.modules_name = req_dict["1"]
        ma_add_mod.inv_number = req_dict["2"]
        ma_add_mod.serial_number = req_dict["3"]
        ma_add_mod.port = req_dict["4"]
        ma_add_mod.size = req_dict["5"]
        ma_add_mod.note = req_dict["6"]
        ma_add_mod.editor = name
        ma_add_mod.last_date_edit = datetime.now()
        return save_data_to_db()
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


def save_ma_unit_data(req_dict, name):
    ma_unit = MA_Unit.query.get_or_404(int(req_dict["id"]))
    if request.method == 'POST':
        ma_unit.cod_name = req_dict["cod_name"]
        ma_unit.organization = req_dict["organization"]
        ma_unit.address = req_dict["address"]
        ma_unit.type_equipment = req_dict["type_equipment"]
        ma_unit.inv_number = req_dict["inv_number"]
        ma_unit.naklodnaja = req_dict["naklodnaja"]
        ma_unit.serial_number = req_dict["serial_number"]
        ma_unit.IP = req_dict["IP"]
        ma_unit.install_date = req_dict["install_date"]
        ma_unit.ORSH = req_dict["ORSH"]
        ma_unit.note = req_dict["note"]
        ma_unit.editor = name
        ma_unit.last_date_edit = datetime.now()
        return save_data_to_db()
    else:
        return json.dumps("NOT 'POST' REQUEST")