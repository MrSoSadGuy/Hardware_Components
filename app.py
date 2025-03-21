import os
import logging
from flask import Flask, has_request_context
from flask_login import LoginManager
from models import db, Users
from dotenv import load_dotenv
from waitress import serve
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.exceptions import NotFound
from admin import admin
from flask_migrate import Migrate


# using custom formatter to inject contextual data into logging
class RequestFormatter(logging.Formatter):
    def format(self, record):
        if has_request_context():
            record.url = request.url
            record.remote_addr = request.remote_addr
        else:
            record.url = None
            record.remote_addr = None
        return super().format(record)

formatter = RequestFormatter(
    '[%(asctime)s] - %(remote_addr)s requested %(url)s | %(levelname)s in %(module)s: %(message)s'
)


app = Flask(__name__)
load_dotenv()
app.secret_key = os.getenv('KEY')
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('db_gom_zues')

logging.basicConfig(level=logging.INFO)
handler = logging.FileHandler('logs/gom_zues_logs.log')
handler.setLevel(logging.INFO)
handler.setFormatter(formatter)
app.logger.handlers.clear()
app.logger.addHandler(handler)

admin.init_app(app)
db.init_app(app)
migrate = Migrate(app, db)
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