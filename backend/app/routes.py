from flask import Blueprint, jsonify, request

app_bp = Blueprint('test', __name__)

@app_bp.route('/test')
def test_route():
    return jsonify({
        "message": "Hello from test route flask backend!",
        "status": "success"
    }), 200

@app_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print(data)
    # TODO: Add to DB
    return jsonify({
        'message': 'User data successfully received',
        'data': data
    }), 200