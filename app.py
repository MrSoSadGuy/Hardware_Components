import os
from flask import Flask
from flask_login import LoginManager
from models import db
from dotenv import load_dotenv
from waitress import serve
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.exceptions import NotFound

app = Flask(__name__)
load_dotenv()
# app.secret_key = 'some secret salt'
app.secret_key = os.getenv('KEY')
# app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///sostav_PON.db'
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///GOM_ZUES_STAN_GRP_BD.db'

db.init_app(app)
manager = LoginManager(app)
app.app_context().push()
db.create_all()

from routes import *
from models import *



@manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


@manager.unauthorized_handler
def unauthorized_handler():
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run(debug=True)
    # serve(app, host='0.0.0.0', port=8080, url_prefix='/units')
    # serve(app, listen='0.0.0.0:8080', url_scheme="https" )