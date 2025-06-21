from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

# Initialize Flask app to its config
def create_app():
    app = Flask(__name__)
    # Get config from instance/config.py
    app.config.from_object('instance.config.Config')
    db.init_app(app)
    jwt.init_app(app)
    # Enable CORS for all routes
    CORS(app)
    # Import all models and create tables in DB if it does not exist
    from . import models
    with app.app_context():
        db.create_all()
    from .routes import app_bp
    # Register test blueprint accessed via /api/<route_name>
    app.register_blueprint(app_bp, url_prefix='/api')
    return app


