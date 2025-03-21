from models import db, Users
from flask import session, redirect, url_for, jsonify
from flask_admin import Admin, expose
from flask_admin.contrib.sqla import ModelView
from werkzeug.security import generate_password_hash
from flask_login import current_user, login_required
from functools import wraps
# from flask_jwt_extended import get_current_user

admin = Admin( name='Admin', template_mode='bootstrap3')
class AdminModelView(ModelView):
    form_columns = ['login', 'password_hash','FIO', 'roles']
    def is_accessible(self):
        return current_user.is_authenticated and current_user.has_role('admin')
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'), 301)
    
    def on_model_change(self, form, model, is_created):
        if is_created:
            model.password_hash = generate_password_hash(model.password_hash)
        # else:
        #     model.password = generate_password_hash(model.password)
        super(AdminModelView, self).on_model_change(form, model, is_created)
    
admin.add_view(AdminModelView(Users, db.session))

def auth_role(role):
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            roles = role if isinstance(role, list) else [role]
            if all(not current_user.has_role(r) for r in roles):
                return '<script>alert(\'Нет прав, для выполнения данной операции\')</script>', 403
            return fn(*args, **kwargs)

        return decorator

    return wrapper
