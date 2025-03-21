from flask_wtf import FlaskForm
from wtforms import StringField,  SubmitField, PasswordField
from wtforms.validators import DataRequired, Length

class LoginForm(FlaskForm):
    """Contact form."""
    login = StringField(
        'Логин...',
        [DataRequired()]
    )
    password = PasswordField(
        'Пароль..',
        [
            DataRequired(message=("Please enter a password.")),
        ]
    )
    submit = SubmitField('Войти')