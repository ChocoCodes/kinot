from flask import Blueprint, jsonify, request, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .utils import format_image_path
from http import HTTPStatus
from .models import User
from app import db
from .services.user_query_service import query_user
from .services.user_finance_service import get_user_finances
from .services.user_transaction_service import get_recent_transactions

app_bp = Blueprint('test', __name__)

@app_bp.route('/test')
def test_route():
    image_url = url_for('static', filename='uploads/profiles/default.jpg')
    return jsonify(image_url), HTTPStatus.OK

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
        'token': create_access_token(identity=str(user.id)),
        'profile_path': format_image_path(user.profile_path, 'profiles')
    }), HTTPStatus.OK

@app_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    print(data)
    # Check credentials in DB and return w/ access token
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'No username found.'}), HTTPStatus.NOT_FOUND
    if not user.validate_password(password):
        return jsonify({'error': 'Incorrect password'}), HTTPStatus.UNAUTHORIZED
    return jsonify({
        'id': user.id,
        'user': user.username,
        'token': create_access_token(identity=str(user.id)),
        'profile_path': format_image_path(user.profile_path, 'profiles')
    }), HTTPStatus.OK

@app_bp.route('/finances', methods=['GET'])
@jwt_required(locations=['headers'])
def get_finances():
    user_id = int(get_jwt_identity())
    user = query_user(user_id)
    response = get_user_finances(user)
    print(response)
    return jsonify(response), HTTPStatus.OK

@app_bp.route('/recent-transactions', methods=['GET'])
@jwt_required(locations=['headers'])
def fetch_recent_transactions():
    user_id = int(get_jwt_identity())
    user = query_user(user_id)
    transaction_records = get_recent_transactions(user)
    print(transaction_records)
    return jsonify(transaction_records), HTTPStatus.OK

@app_bp.route('/finance-update', methods=['POST'])
@jwt_required(locations=['headers'])
def update_finance():
    # Parse Data (Finance and Transaction Log)
    data = request.get_json()
    print(data)
    return jsonify({
        'msg': 'backend route /finance-update pinged!'
    }), HTTPStatus.OK

@app_bp.route('/home', methods=['GET'])
@jwt_required(locations=['headers'])
def get_homepage_data():
    user_id = int(get_jwt_identity())
    user = query_user(user_id)
    finances = get_user_finances(user)
    transactions = get_recent_transactions(user)
    response = {
        'finances': finances,
        'transactions': transactions
    }
    return jsonify(response), HTTPStatus.OK