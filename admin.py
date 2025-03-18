from models import db, Users
from flask import session, redirect, url_for, request
from flask_admin import Admin, expose
from flask_admin.contrib.sqla import ModelView
from werkzeug.security import generate_password_hash
from flask_login import current_user, login_required

admin = Admin( name='Admin', template_mode='bootstrap3')
class AdminModelView(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated
    
    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for('login'), 301)
    
    def on_model_change(self, form, model, is_created):
        if is_created:
            model.password = generate_password_hash(model.password)
        else:
            model.password = generate_password_hash(model.password)
        super(AdminModelView, self).on_model_change(form, model, is_created)
    
admin.add_view(AdminModelView(Users, db.session))
