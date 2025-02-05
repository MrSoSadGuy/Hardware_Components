from flask import request, json, jsonify
from app import app
from models import *
from pon_models import *
from saveData import *


def get_data_for_jinja():
    object = Objects_ur_lica.query.order_by(Objects_ur_lica.cod_name).all()
    new_obj_list = []
    for i in range(0, len(object)):
        new_obj = {}
        new_obj['id'] = object[i].id
        new_obj['cod_name'] = object[i].cod_name
        new_obj['organization'] = object[i].organization
        new_obj['address'] = object[i].address
        new_obj['ORSH'] = object[i].ORSH
        new_obj['IP'] = object[i].IP
        new_obj['naklodnaja'] = object[i].naklodnaja
        new_obj['note'] = object[i].note
        new_obj['color'] = object[i].color
        new_obj['install_date'] = object[i].install_date
        if len(object[i].unit)>0:
            new_obj['type_equipment'] = object[i].unit[0].type_equipment
            new_obj['inv_number'] = object[i].unit[0].inv_number
            new_obj['serial_number'] = object[i].unit[0].serial_number
            new_obj['MAC'] = object[i].unit[0].MAC
        else:
            new_obj['type_equipment'] =''
            new_obj['inv_number'] = ''
        new_obj_list.append(new_obj)
    return new_obj_list 


def get_data_for_new_mod(req):
    data ={}
    type = Type_of_olt.query.all()
    for t in type:
        q = {}
        for m in t.type_of_modules:
            q[m.id] = m.type
        data[t.id] = [t.type, q]
    return data


def getBuhUchData(req):
    buh = BuhUch.query.filter_by(inv_number=json.loads(req)).first()
    return jsonify(buh)


def getLstMudules(req):
    modules = List_of_modules.query.get_or_404(int(json.loads(req)))
    return jsonify(modules)


def getPonUnitData(req):
    olt = List_of_olt.query.get_or_404(int(json.loads(req)))
    return jsonify(olt, olt.Type_of_olt)


def getKTSdata(req):
    kts = Data_for_KTS.query.filter_by(cod_name=json.loads(req).upper()).first()
    return jsonify(kts)


def getMAmodulesData(req):
    modules = ma_add_modules.query.filter_by(cod_name=json.loads(req).upper()).all()
    return jsonify(modules)


def getMAunitStorData(req):
    ma_units = MA_Units.query.filter_by(cod_name=json.loads(req).upper()).all()
    return jsonify(ma_units)


def getMAunitData(req):
    units = MA_Units.query.get_or_404(int(json.loads(req)))
    return jsonify(units, units.modules)


def getUDdata(req):
    ud = Uzel_dostupa.query.get_or_404(int(json.loads(req)))
    return jsonify(ud)


def getAllUDdata(req):
    ud = Uzel_dostupa.query.order_by(Uzel_dostupa.id).all()
    return ud


def getUDlst(req):
    ud = Uzel_dostupa.query.get_or_404(int(json.loads(req)))
    answ ={}
    for i in ud.cod_name_of_olt:
        answ[i.id] = i.cod_name_of_olt
    return jsonify(answ)


def getTypeOfOltDAta(req):
    data =Type_of_olt.query.all()
    return jsonify(data)


def getURdata(req):
    obj = Objects_ur_lica.query.get_or_404(int(json.loads(req)))
    units_list = {}
    modules_list = {}
    for un in range(0, len(obj.unit)) :
        units_list[un] = obj.unit[un]  
        modules_list[un]= obj.unit[un].modules    
    return jsonify(obj,units_list,modules_list)


def data4newPONunit(req):
    data ={}
    type = Type_of_olt.query.get_or_404(int(json.loads(req)))
    for s in type.olt_sockets:
        lst = []
        for m in type.type_of_modules:
            if m.first_socket <= s.socket <= m.last_socket:
                lst.append(m.type)
        data[s.socket] = lst
    return(data)    


def get_used_unit_data(id):
    print(id)
    unit = List_of_olt.query.get_or_404(id)
    data={}
    type_of_modules = Type_of_modules.query.all()

    for i in unit.Type_of_olt.olt_sockets:
        for j in unit.list_of_modules:
            if j.socket == i.id:
                data[i.socket] = [True, j.type_of_modules , j.inv_number, j.name_of_modules, j.serial_number]
        if i.socket not in data:
            data[i.socket] = data_for_empty_sockets(i.socket,unit.Type_of_olt.id,type_of_modules)
    print(dict(sorted(data.items())))
    return data


def data_for_empty_sockets(key,olt, type_of_modules):
    data=[False]
    for t in type_of_modules:
        if t.first_socket <= key <= t.last_socket and olt == t.type_of_olt:
            data.append(t.type)
    return data


def get_kts_data(id):
    olt = List_of_olt.query.get_or_404(int(id))
    data={'cod_name_of_olt': olt.cod_name_of_olt,
        'Serial': olt.serial_number,
        'inv_number': olt.inv_number}
    if olt.kts:
        data={  'cod_name_of_olt': olt.cod_name_of_olt,
                'Serial': olt.serial_number,
                'inv_number': olt.inv_number,
                'UD': olt.kts.UD,
                'IP':olt.kts.IP,
                'OLT':olt.kts.OLT,
                'date_of_production':olt.kts.date_of_production,
                'date_of_entry':olt.kts.date_of_entry,
                'full_name':olt.kts.full_name,
                'mesto':olt.kts.mesto,
                'zavod':olt.kts.zavod 
            }
    else: addNewKTSdata(olt)
    return data


def get_data_for_move(req):
    mod = List_of_modules.query.get_or_404(req)
    data ={}
    for i in mod.Type_of_modules.Type_of_olt.list_of_olt:
        map_s = {}
        for w in i.Type_of_olt.olt_sockets:
            if (mod.Type_of_modules.Type_of_olt.id == i.type_of_olt and
                    mod.Type_of_modules.first_socket <= w.socket <= mod.Type_of_modules.last_socket):
                map_s[w.id] = w.socket
            for n in w.list_of_modules:
                if n.olt_id == i.id and n.socket in map_s:
                    map_s.pop(n.socket)
        if len(map_s)>0:
            data[i.cod_name_of_olt] =[i.id, map_s] 
    print(data)
    data["СКЛАД-СТЕЛАЖ"] = [73,{75:'стелаж'}]
    data["ЗИП-СТЕЛАЖ"] = [74,{75:'стелаж'}]
    return data


def get_data_for_sostav(id):
    olt = List_of_olt.query.get_or_404(int(id))
    data_list ={}
    for mod in olt.list_of_modules:
        data_list[mod.Olt_sockets.socket] = [mod.inv_number, mod.name_of_modules, mod.serial_number, mod.note]
    return data_list


def get_data_for_select(db, id):
    response =[]
    if db=='MA_Units':
        obj = Objects_ur_lica.query.order_by(Objects_ur_lica.id).all()
        for ob in obj:
            if len(ob.unit) == 0:
                response.append(ob) 
    if db == 'ma_add_modules':
        modules = ma_add_modules.query.get_or_404(id)        
        for unit in modules.type_of_ma_modules.type_of_ma_units2.units:
            if modules.type_of_ma_modules.type_of_ma_units2.sockets > len(unit.modules):
                unit_modules = {}
                if unit.object.cod_name == "СКЛАД" or unit.object.cod_name == "ЗИП" or unit.object.cod_name == "РЕМОНТ":
                    unit_data = {'id': unit.id, 'cod_name': "Склад-"+str(unit.id)}
                else:
                    unit_data = {'id': unit.id, 'cod_name': unit.object.cod_name}    
                for m in unit.modules:
                    if m.type_of_ma_modules.type not in unit_modules:
                        unit_modules[m.type_of_ma_modules.type] = 1
                    else:
                        unit_modules[m.type_of_ma_modules.type] += 1
                    unit_data['data'] = unit_modules
                if (modules.type_of_ma_modules.type not in unit_modules) or (modules.type_of_ma_modules.max_number > unit_modules[modules.type_of_ma_modules.type]):
                    response.append(unit_data.copy())
    return response      