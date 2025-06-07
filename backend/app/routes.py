from flask import Blueprint, jsonify

test_bp = Blueprint('test', __name__)

@test_bp.route('/test')
def test_route():
    return jsonify({
        "message": "Hello from test route flask backend!",
        "status": "success"
    }), 200