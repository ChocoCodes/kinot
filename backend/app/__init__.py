from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Initialize Flask app to its config
def create_app():
    app = Flask(__name__)
    # Get config from instance/config.py
    app.config.from_object('instance.config.Config')
    db.init_app(app)
    # Enable CORS for all routes
    CORS(app)

    from .routes import app_bp
    # Register test blueprint accessed via /api/test
    app.register_blueprint(app_bp, url_prefix='/api')
    return app


