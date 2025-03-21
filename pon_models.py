from flask_login import UserMixin
from dataclasses import dataclass
from datetime import datetime
from models import db


@dataclass
class Uzel_dostupa(db.Model):
    __tablename__ = "Uzel_dostupa"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod_ud: str = db.Column(db.String(10), nullable=False)
    number_ud: str = db.Column(db.String(10), nullable=False) #надо убрать
    Adress: str = db.Column(db.String(100), nullable=False)
    name: str = db.Column(db.String(20), nullable=False, unique=True)
    node_attr: int = db.Column(db.Integer, db.ForeignKey('Node_attribute.id'))
    cod_name_of_olt = db.relationship('List_of_olt', backref='Uzel_dostupa')
    net_section: int = db.Column(db.Integer, db.ForeignKey('Network_section.id'))
    hide: int = db.Column(db.Integer)

    def __repr__(self):
        return '<Uzel_dostupa %r>' % self.id


@dataclass
class Data_for_KTS (db.Model, UserMixin):
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UD: str = db.Column(db.String(200), nullable=True)
    uzel_id: int = db.Column(db.Integer, nullable=True)
    inv_number: str = db.Column(db.String(100), nullable=True)
    IP: str = db.Column(db.String(20), nullable=True)
    Serial: str = db.Column(db.String(100), nullable=True)
    OLT: str = db.Column(db.String(100), nullable=True)
    full_name: str = db.Column(db.String(200), nullable=True)
    cod_name: str = db.Column(db.String(50), nullable=True)
    # cod_name: str = db.Column(db.String(20), db.ForeignKey('List_of_olt.cod_name_of_olt'))
    unit_id: str = db.Column(db.Integer, db.ForeignKey('List_of_olt.id'))
    zavod: str = db.Column(db.String(50), nullable=True)
    date_of_production: str = db.Column(db.String(20), nullable=True)
    date_of_entry: str = db.Column(db.String(20), nullable=True)
    mesto: str = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    # list_of_olt = db.relationship('List_of_olt', backref='Data_for_KTS', lazy='dynamic')

    def __repr__(self):
        return '<Data_for_KTS %r>' % self.id


@dataclass
class List_of_olt(db.Model):
    __tablename__ = "List_of_olt"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    # cod_name_of_olt: str = db.Column(db.String(20), db.ForeignKey('data_for_kts.cod_name'))
    uzel_id: int = db.Column(db.Integer, db.ForeignKey('Uzel_dostupa.id'))
    cod_name_of_olt: str = db.Column(db.String(50), nullable=True, unique=True)
    kts = db.relationship('Data_for_KTS',uselist=False, backref='List_of_olt')
    type_of_olt: int = db.Column(db.Integer, db.ForeignKey('Type_of_olt.id'))
    name: str = db.Column(db.String(100), nullable=True)
    full_name: str = db.Column(db.String(200), nullable=True)
    inv_number: str = db.Column(db.String(20), nullable=True)
    serial_number: str = db.Column(db.String(50), nullable=True)
    note: str = db.Column(db.String(500), nullable=True)
    IP: str = db.Column(db.String(20), nullable=True)
    OLT: str = db.Column(db.String(100), nullable=True)
    zavod: str = db.Column(db.String(50), nullable=True)
    date_of_production: str = db.Column(db.String(20), nullable=True)
    date_of_entry: str = db.Column(db.String(20), nullable=True)
    row_box_shelf: str = db.Column(db.String(20), nullable=True)
    name_who_add = db.Column(db.String(20), nullable=True)
    add_date = db.Column(db.DateTime, default=datetime.utcnow)
    name_who_edit = db.Column(db.String(20), nullable=True)
    edit_date = db.Column(db.DateTime, nullable=True)
    list_of_modules = db.relationship('List_of_modules', backref='List_of_olt')

    def __repr__(self):
        return '<List_of_olt %r>' % self.id


@dataclass
class Type_of_olt(db.Model):
    __tablename__ = "Type_of_olt"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type: str = db.Column(db.String(50), nullable=False, unique=True)
    end: str = db.Column(db.String(5), nullable=False, unique=True)
    midl: str = db.Column(db.String(5), nullable=False, unique=True)
    start: str = db.Column(db.String(10), nullable=False, unique=True)
    list_of_olt = db.relationship('List_of_olt', backref='Type_of_olt', lazy='dynamic')
    type_of_modules = db.relationship('Type_of_modules', backref='Type_of_olt', lazy='dynamic')
    olt_sockets = db.relationship('Olt_sockets', backref='Type_of_olt', lazy='dynamic')
    equip_name: int = db.Column(db.Integer, db.ForeignKey('Equipment_name.id'))

    def __repr__(self):
        return '<type_of_ma_modules %r>' % self.id


@dataclass
class Olt_sockets(db.Model):
    __tablename__ = "Olt_sockets"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_of_olt: int = db.Column(db.Integer, db.ForeignKey('Type_of_olt.id'))
    socket: int = db.Column(db.Integer, nullable=True)
    list_of_modules = db.relationship('List_of_modules', backref='Olt_sockets', lazy='dynamic')

    def __repr__(self):
        return '<Olt_sockets %r>' % self.id


@dataclass
class List_of_modules(db.Model):
    __tablename__ = "List_of_modules"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_of_modules: str = db.Column(db.String(20), db.ForeignKey('Type_of_modules.type'))
    # olt_cod: str = db.Column(db.String(20), db.ForeignKey('List_of_olt.cod_name_of_olt'))
    olt_id: int = db.Column(db.Integer, db.ForeignKey('List_of_olt.id'))
    socket: int = db.Column(db.Integer, db.ForeignKey('Olt_sockets.id'))
    name_of_modules: str = db.Column(db.String(100), nullable=True)
    inv_number: str = db.Column(db.String(20), nullable=True)
    serial_number: str = db.Column(db.String(50), nullable=True)
    note: str = db.Column(db.String(500), nullable=True)
    color: str = db.Column(db.String(20), nullable=True)
    name_who_add = db.Column(db.String(20), nullable=True)
    add_date = db.Column(db.DateTime, default=datetime.utcnow)
    name_who_edit = db.Column(db.String(20), nullable=True)
    edit_date = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return '<List_of_modules %r>' % self.id


@dataclass
class Type_of_modules(db.Model):
    __tablename__ = "Type_of_modules"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type: str = db.Column(db.String(50), nullable=False, unique=True)
    type_of_olt: int = db.Column(db.Integer, db.ForeignKey('Type_of_olt.id'))
    first_socket: int = db.Column(db.Integer, nullable=False)
    last_socket: int = db.Column(db.Integer, nullable=False)
    modules = db.relationship('List_of_modules', backref='Type_of_modules', lazy='dynamic')

    def __repr__(self):
        return '<Type_of_modules %r>' % self.id


@dataclass
class Network_attribute(db.Model):
    __tablename__ = "Network_attribute"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod: str = db.Column(db.String(10), nullable=False)
    name: str = db.Column(db.String(100), nullable=False, unique=True)
    Equipment_name = db.relationship('Equipment_name', backref='network_attribute')

    def __repr__(self):
        return '<network_attribute %r>' % self.id

class Network_section(db.Model):
    __tablename__ = "Network_section"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod: str = db.Column(db.String(10), nullable=False)
    name: str = db.Column(db.String(100), nullable=False, unique=True)
    ud = db.relationship('Uzel_dostupa', backref='Network_section')

    def __repr__(self):
        return '<network_attribute %r>' % self.id


class Node_attribute(db.Model):
    __tablename__ = "Node_attribute"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod: str = db.Column(db.String(10), nullable=False)
    name: str = db.Column(db.String(100), nullable=False, unique=True)
    Uzel_dostupa = db.relationship('Uzel_dostupa', backref='network_attribute')

    def __repr__(self):
        return '<network_attribute %r>' % self.id

class Equipment_name(db.Model):
    __tablename__ = "Equipment_name"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod: str = db.Column(db.String(10), nullable=False)
    name: str = db.Column(db.String(100), nullable=False, unique=True)
    Network_attribute:str = db.Column(db.Integer, db.ForeignKey('Network_attribute.id'))
    type_unit = db.relationship('Type_of_olt', backref='Equipment_name')
    def __repr__(self):
        return '<network_attribute %r>' % self.id