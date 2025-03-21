from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from datetime import datetime
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.orm import backref


db = SQLAlchemy()

# @dataclass
# class Unit(db.Model):
#     id:int = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     ud_punkt:str = db.Column(db.String(100), nullable=False)
#     name_PON:str = db.Column(db.String(100), nullable=False)
#     name_unit:str = db.Column(db.String(100), nullable=False)
#     inv_number:str = db.Column(db.String(100), nullable=True)
#     serial_number:str = db.Column(db.String(100), nullable=True)
#     row_mesto:str = db.Column(db.String(100), nullable=True)
#     plata_mesto:str = db.Column(db.String(100), nullable=True)
#     creator = db.Column(db.String(20), nullable=True)
#     note:str = db.Column(db.String(500), nullable=True)
#     color: str = db.Column(db.String(20), nullable=True)
#     date = db.Column(db.DateTime, default=datetime.utcnow)
#     editor = db.Column(db.String(20), nullable=True)
#     last_date_edit = db.Column(db.DateTime, nullable=True)
#
#     def __repr__(self):
#         return '<Unit %r>' % self.id


@dataclass
class Objects_ur_lica(db.Model):
    __tablename__ = "Objects_ur_lic"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cod_name: str = db.Column(db.String(20), nullable=False)
    organization: str = db.Column(db.String(100), nullable=False)
    address: str = db.Column(db.String(100), nullable=False)
    ORSH: str = db.Column(db.String(20), nullable=True)
    note: str = db.Column(db.String(500), nullable=True)
    color: str = db.Column(db.String(20), nullable=True)
    IP: str = db.Column(db.String(20), nullable=True)
    dogovor: str = db.Column(db.String(30), nullable=True)
    naklodnaja: str = db.Column(db.String(20), nullable=True)
    creator = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    editor = db.Column(db.String(20), nullable=True)
    last_date_edit = db.Column(db.DateTime, nullable=True)
    unit = db.relationship('MA_Units', backref=backref('object'), order_by='MA_Units.type_equipment.desc()')
    # unit = db.relationship('MA_Units', backref='object')
    install_date: str = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return '<Objects_ur_lica %r>' % self.id
    
    
@dataclass
class MA_Units(db.Model):
    __tablename__="MA_Units"
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_equipment: str = db.Column(db.String(100), nullable=True)
    serial_number: str = db.Column(db.String(50), nullable=True)
    inv_number: str = db.Column(db.String(20), nullable=True)
    MAC: str = db.Column(db.String(20), nullable=True)
    note: str = db.Column(db.String(500), nullable=True)
    creator = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    editor = db.Column(db.String(20), nullable=True)
    last_date_edit = db.Column(db.DateTime, nullable=True)
    modules = db.relationship('ma_add_modules', backref='MA_Units')
    object_id = db.Column(db.Integer, db.ForeignKey('Objects_ur_lic.id'))
    type = db.Column(db.String(50), db.ForeignKey('type_of_ma_units.id'))

    def __repr__(self):
        return '<MA_Units %r>' % self.id


@dataclass
class type_of_ma_units(db.Model):
    __tablename__ = "type_of_ma_units"
    id: int = db.Column(db.Integer, primary_key=True)
    sockets: int = db.Column(db.Integer)
    name: str = db.Column(db.String(100), nullable=True, unique=False)
    type: str = db.Column(db.String(50), nullable=False, unique=True)
    units = db.relationship('MA_Units', backref='type_of_ma_units')
    modules = db.relationship('type_of_ma_modules', backref='type_of_ma_units2')
    hide: int = db.Column(db.Integer)

    def __repr__(self):
        return '<type_of_ma_units %r>' % self.id
    
    
@dataclass
class type_of_ma_modules(db.Model):
    __tablename__ = "type_of_ma_modules"
    id: int = db.Column(db.Integer, primary_key=True)
    max_number: int = db.Column(db.Integer)
    name: str = db.Column(db.String(100), nullable=True, unique=False)
    type: str = db.Column(db.String(50), nullable=False, unique=True)
    type_of_ma_units: str = db.Column(db.String(50), db.ForeignKey('type_of_ma_units.type'))
    modules = db.relationship('ma_add_modules', backref='type_of_ma_modules')
    hide: int = db.Column(db.Integer)

    def __repr__(self):
        return '<type_of_ma_modules %r>' % self.id

@dataclass
class ma_add_modules(db.Model):
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    modules_name: str = db.Column(db.String(20), nullable=False)
    type: str = db.Column(db.String(50), nullable=True)
    type_id: str = db.Column(db.Integer, db.ForeignKey('type_of_ma_modules.id'))
    serial_number: str = db.Column(db.String(50), nullable=True)
    inv_number: str = db.Column(db.String(20), nullable=True)
    port: int = db.Column(db.Integer, nullable=True)
    size: int = db.Column(db.Integer, nullable=True)
    note: str = db.Column(db.String(500), nullable=True)
    creator = db.Column(db.String(20), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    editor = db.Column(db.String(20), nullable=True)
    last_date_edit = db.Column(db.DateTime, nullable=True)
    ma_unit_id = db.Column(db.Integer, db.ForeignKey('MA_Units.id'))

    def __repr__(self):
        return '<ma_add_modules %r>' % self.id
    
    
@dataclass
class BuhUch(db.Model):
    __tablename__ = 'Accounting_data'
    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name: str = db.Column(db.String(300), nullable=True)
    inv_number: str = db.Column(db.String(100), nullable=True)
    date_buy: str = db.Column(db.String(100), nullable=True)
    quantity: int = db.Column(db.Integer, nullable=True)
    price_for_1: str = db.Column(db.String(100), nullable=True)
    price_for_all: str = db.Column(db.String(100), nullable=True)
    charracter: str = db.Column(db.String(1000), nullable=True)
    MOL:str = db.Column(db.String(100), nullable=True)
    note: str = db.Column(db.String(300), nullable=True)
    color: str = db.Column(db.String(20), nullable=True)
    creator = db.Column(db.String(100), nullable=True)
    editor = db.Column(db.String(100), nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    last_edit_date = db.Column(db.DateTime, nullable=True)
    MOL_id: int= db.Column(db.Integer, db.ForeignKey('list_of_MOLs.id'))

    def __repr__(self):
        return '<BuhUch %r>' % self.id


@dataclass
class MOLs(db.Model):
    __tablename__ = "list_of_MOLs"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(20), nullable=False, unique=True)
    buh_data = db.relationship('BuhUch', backref='list_of_MOLs', lazy=False)

    def __repr__(self):
        return '<MOLs %r>' % self.id

@dataclass
class Users (db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    login = db.Column(db.String(128), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    FIO = db.Column(db.String(50), nullable=False)
    roles = db.relationship("Role", secondary="user_roles", back_populates="users")
    def __repr__(self):
        return '<Users %r>' % self.id
    def has_role(self, role):
        return bool(
            Role.query
            .join(Role.users)
            .filter(Users.id == self.id)
            .filter(Role.slug == role)
            .count() == 1
        )
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

class Role(db.Model):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(36), nullable=False, unique=True)
    slug = db.Column(db.String(36), nullable=False, unique=True)
    description = db.Column(db.String(100), nullable=False)

    users = db.relationship("Users", secondary="user_roles", back_populates="roles")    
    def __repr__(self):
        return self.name

class UserRole(db.Model):
    __tablename__ = "user_roles"
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), primary_key=True)

