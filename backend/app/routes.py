from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from .utils import format_image_path
from .models import User
from app import db

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
        
    fullname = data['fullname']
    username = data['username']
    raw_password = data['password']
    question = data['question']
    raw_answer = data['answer']
    # Check first if there are same username in the DB
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({
            'error': 'Username already taken!'
        }), 409
    user = User(
        fullname=fullname,
        username=username,
        raw_password=raw_password,
        secret_question=question,
        raw_secret_answer=raw_answer
    )
    # Save user to DB 
    db.session.add(user)
    db.session.commit()
    # Return username and JWT token
    return jsonify({
        'id': user.id,
        'user': user.username,
        'token': create_access_token(identity=user.id),
        'profile_path': format_image_path(user.profile_path, 'profiles')
    }), 200

@app_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    print(data)
    # Check credentials in DB and return w/ access token
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'No username found.'}), 404
    if not user.validate_password(password):
        return jsonify({'error': 'Incorrect password'}), 401
    return jsonify({
        'id': user.id,
        'user': user.username,
        'token': create_access_token(identity=user.id),
        'profile_path': format_image_path(user.profile_path, 'profiles')
    }), 200

@app_bp.route('/finances', methods=['GET'])
def get_finances():
    return jsonify({

    }), 200