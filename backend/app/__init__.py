from flask import Flask


def create_app():
    app = Flask(__name__)

    from .blueprints.web import web_bp
    from .blueprints.api import api_bp

    app.register_blueprint(web_bp)
    app.register_blueprint(api_bp, url_prefix="/api")

    return app