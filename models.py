from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from datetime import datetime


db = SQLAlchemy()

@dataclass
class Unit(db.Model):
    id:int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ud_punkt:str = db.Column(db.String(100), nullable=False)
    name_PON:str = db.Column(db.String(100), nullable=False)
    name_unit:str = db.Column(db.String(100), nullable=False)
    inv_number:str = db.Column(db.String(100), nullable=True)
    serial_number:str = db.Column(db.String(100), nullable=True)
    row_mesto:str = db.Column(db.String(100), nullable=True)
    plata_mesto:str = db.Column(db.String(100), nullable=True)
    creator = db.Column(db.String(20), nullable=True)
    note:str = db.Column(db.String(500), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    editor = db.Column(db.String(20), nullable=True)
    last_date_edit = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return '<Unit %r>' % self.id


@dataclass
class MA_Unit(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod_name: str = db.Column(db.String(20), nullable=False)
    organization: str = db.Column(db.String(100), nullable=False)
    address: str = db.Column(db.String(100), nullable=False)
    type_equipment: str = db.Column(db.String(100), nullable=True)
    serial_number: str = db.Column(db.String(50), nullable=True)
    naklodnaja: str = db.Column(db.String(20), nullable=True)
    ORSH:str = db.Column(db.String(20), nullable=True)
    IP: str = db.Column(db.String(20), nullable=True)
    inv_number:str = db.Column(db.String(20), nullable=True)
    install_date:str = db.Column(db.String(20), nullable=True)
    note:str = db.Column(db.String(500), nullable=True)
    creator = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    editor = db.Column(db.String(20), nullable=True)
    last_date_edit = db.Column(db.DateTime, nullable=True)
    modules = db.relationship('ma_add_modules', backref='ma_unit')

    def __repr__(self): 
        return '<MA_Unit %r>' % self.id


@dataclass
class ma_add_modules(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod_name: str = db.Column(db.String(20), nullable=False)
    modules_name: str = db.Column(db.String(20), nullable=False)
    type: str = db.Column(db.String(20), nullable=True)
    serial_number: str = db.Column(db.String(50), nullable=True)
    inv_number:str = db.Column(db.String(20), nullable=True)
    port: int = db.Column(db.Integer, nullable=True)
    size: int = db.Column(db.Integer, nullable=True)
    note:str = db.Column(db.String(500), nullable=True)
    creator = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    editor = db.Column(db.String(20), nullable=True)
    last_date_edit = db.Column(db.DateTime, nullable=True)
    ma_unit_id = db.Column(db.Integer, db.ForeignKey('ma__unit.id'))

    def __repr__(self):
        return '<ma_add_modules %r>' % self.id

@dataclass
class BuhUch(db.Model):
    id:int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name:str = db.Column(db.String(300), nullable=True)
    inv_number:str = db.Column(db.String(100), nullable=True)
    date_buy:str = db.Column(db.String(100), nullable=True)
    quantity:int = db.Column(db.Integer, nullable=True)
    price_for_1:str = db.Column(db.String(100), nullable=True)
    price_for_all:str = db.Column(db.String(100), nullable=True)
    charracter:str = db.Column(db.String(1000), nullable=True)
    MOL:str = db.Column(db.String(100), nullable=True)
    note:str = db.Column(db.String(300), nullable=True)
    creator = db.Column(db.String(100), nullable=True)
    editor = db.Column(db.String(100), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    last_edit_date = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return '<BuhUch %r>' % self.id

@dataclass
class Users (db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(128), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    FIO = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return '<Users %r>' % self.id

@dataclass
class Data_for_KTS (db.Model, UserMixin):
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UD: str = db.Column(db.String(200), nullable=True)
    inv_number: str = db.Column(db.String(100), nullable=True)
    IP: str = db.Column(db.String(20), nullable=True)
    Serial: str = db.Column(db.String(100), nullable=True)
    OLT: str = db.Column(db.String(100), nullable=True)
    full_name: str = db.Column(db.String(200), nullable=True)
    cod_name: str = db.Column(db.String(50), nullable=True)
    zavod: str = db.Column(db.String(50), nullable=True)
    date_of_production: str = db.Column(db.String(20), nullable=True)
    date_of_entry: str = db.Column(db.String(20), nullable=True)
    mesto: str = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Data_for_KTS %r>' % self.id