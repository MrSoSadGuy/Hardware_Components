from flask import Flask
from flask_login import LoginManager
from models import db
from waitress import serve
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.exceptions import NotFound

app = Flask(__name__)
app.secret_key = 'some secret salt'
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///sostav_PON.db'
db.init_app(app)
manager = LoginManager(app)

# hostedApp = Flask(__name__)
# hostedApp.wsgi_app = DispatcherMiddleware(NotFound(), {
#     "/units": app
# })



from routes import *
from models import *


@manager.user_loader
def load_user(user_id):
    return Users.query.get(user_id)


if __name__ == '__main__':
    app.run(debug=True)
    # serve(app, host='0.0.0.0', port=8080, url_prefix='/units')
    # serve(app, listen='0.0.0.0:8080', url_scheme="https" )