from flask_wtf import FlaskForm
from wtforms import StringField,  SubmitField, PasswordField
from wtforms.validators import DataRequired, Length, EqualTo
from models import Users

class LoginForm(FlaskForm):
    login = StringField('Логин..',[DataRequired(message="Введите имя пользователя")])
    password = PasswordField('Пароль..',[DataRequired(message="Введите пароль")])
    submit = SubmitField('Войти')
    
class ChangePassForm(FlaskForm):
    oldpass = PasswordField('Старый пароль',[DataRequired(message="Введите старый пароль")])
    newpass = PasswordField('Номый пароль',[Length(min=6,message="не менее 6 символов"), DataRequired(message="Введите новый пароль")])
    newpass2 = PasswordField(EqualTo(newpass, message='Пароли должны совпадать.'))
    submit = SubmitField('Применить')
