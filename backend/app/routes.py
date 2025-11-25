import os
from flask import Blueprint, jsonify, request
from .utils import user_required, create_auth_response
from werkzeug.utils import secure_filename
from http import HTTPStatus
from app import db
from datetime import timedelta
from flask_jwt_extended import (
    create_access_token,
    jwt_required, 
    get_jwt,
    get_jwt_identity
)
from .models import (
    Goal,
    User, 
    GoalContribution, 
    MonthlyFinance, 
    Transaction
)
from .services import (
    query_user,
    get_user_finances,
    get_recent_transactions,
    get_all_transactions,
    get_goals,
    get_active_goals,
)

app_bp = Blueprint('test', __name__)


@app_bp.route('/verify-token', methods=['POST'])
@jwt_required()
def verify_access_token():
    return jsonify({'valid': True}), HTTPStatus.OK

@app_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_access_token():
    user_id = get_jwt_identity()
    new_token = create_access_token(identity=str(user_id))
    return jsonify({'token': new_token}), HTTPStatus.OK

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
        }), HTTPStatus.CONFLICT
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
    response = create_auth_response(user)

    return response, HTTPStatus.OK

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
    
    response = create_auth_response(user)

    return response, HTTPStatus.OK

@app_bp.route('/finances', methods=['GET'])
@user_required
def get_finances(user: User):
    response = get_user_finances(user)
    print(response)
    return jsonify(response), HTTPStatus.OK

@app_bp.route('/forgot/validate',  methods=['POST'])
def validate_user_credentials():
    req = request.get_json()
    username = req['username']
    question = req['question']
    answer = req['answer']
    user_check = User.query.filter_by(username=username).first()
    # TODO: check if user exists
    if user_check is None:
        return jsonify({
            "error": "Username not found."
        }), HTTPStatus.BAD_REQUEST
    # TODO: check if secret question is correct
    if user_check.secret_question != question:
        return jsonify({
            "error": "Secret question does not match."
        }), HTTPStatus.BAD_REQUEST 
    # TODO: check if hashed_answer is correct
    if not user_check.validate_secret_answer(answer):
        return jsonify({
            "error": "Secret answer does not match."    
        }), HTTPStatus.BAD_REQUEST
    # TODO: return token, status ok
    reset_token = create_access_token(
        identity=str(user_check.id),
        additional_claims={"purpose": "password_reset"},
        expires_delta=timedelta(minutes=15)
    )
    
    return jsonify({
        "reset_token": reset_token
    }), HTTPStatus.OK

@app_bp.route('/forgot/reset-password', methods=['POST'])
@jwt_required()
def change_password():
    data = request.get_json()
    raw_new_password = data['new_password']

    # TODO: Check if token purpose is 'password_reset'
    claims = get_jwt()
    if claims.get("purpose") != "password_reset":
        return jsonify({
            "error": "Invalid token purpose"
        }), HTTPStatus.BAD_REQUEST

    user_id = int(get_jwt_identity())
    user = query_user(user_id)

    user.password_hashed = raw_new_password
    # db.session.commit()
    return jsonify({
        "message": "Password successfully changed.",
        "user": user.to_dict()
    }), HTTPStatus.OK

@app_bp.route('/recent-transactions', methods=['GET'])
@user_required
def fetch_recent_transactions(user: User):
    transaction_records = get_recent_transactions(user)
    print(transaction_records)
    return jsonify(transaction_records), HTTPStatus.OK

@app_bp.route('/finance-update', methods=['POST'])
@user_required
def update_finance(user: User):
    # TODO: Parse Data (Finance and Transaction Log)
    data = request.get_json()
    print(data)
    
    field = 'spendings' if data['field'] == 'expenses' else data['field']
    method = data['method']
    amount = float(data['amount'])
    year = int(data['year'])
    month = int(data['month'])
    description = data['description']
    # TODO: Update MonthlyFinances
    monthly_finance = MonthlyFinance.query.filter_by(
        user_id=user.id,
        year=year,
        month=month
    ).first()

    if not monthly_finance:
        monthly_finance = MonthlyFinance(
            user_id=user.id,
            year=year,
            month=month
        )
        db.session.add(monthly_finance)
    # Check if the field sent is an attribute of the model, extract the previous amount and update with the new amount
    if hasattr(monthly_finance, field):
        prev = getattr(monthly_finance, field) or 0.0
        setattr(monthly_finance, field, prev + amount)
    else:
        return jsonify({"error": f"Invalid field: {field}"}), HTTPStatus.BAD_REQUEST
    # TODO: Update Transactions
    transaction_log = Transaction(
        category=field,
        amount=amount,
        method=method,
        description=description
    )
    user.transactions.append(transaction_log)
    db.session.commit()

    # TODO: return updated as JSON 
    return jsonify({
        "message": f"Successfully edited user finance on field: {field}"
    }), HTTPStatus.OK

@app_bp.route('/home', methods=['GET'])
@user_required
def get_homepage_data(user: User):
    finances = get_user_finances(user)
    transactions = get_recent_transactions(user)
    goals = get_active_goals(user)
    print(goals)
    response = {
        'finances': finances,
        'transactions': transactions,
        'goals': goals
    }
    return jsonify(response), HTTPStatus.OK

@app_bp.route('/goal/<int:goal_id>/contribute', methods=['PATCH'])
@user_required
def update_goal_contribution(user: User, goal_id: int):
    goal = user.goals.filter_by(id=goal_id).first()
    if goal is None:
        return jsonify({
            "error": "You are not authorized to update this goal."
        }), HTTPStatus.BAD_REQUEST
    # Add log to the user's GoalContribution
    req = request.get_json()
    print(f"{user} | {goal_id}, {req}")
    amount = float(req['amount'])
    goal_contribution = GoalContribution(
        goal_id=goal_id, 
        amount=amount
    )
    print(goal_contribution)
    db.session.add(goal_contribution)
    # Update Goals
    goal.update_current_amount(amount)
    print(goal)
    db.session.commit()
    # Return updated Goal
    return jsonify({"message": "Goal updated successfully"}), HTTPStatus.OK

@app_bp.route('/goal/<int:goal_id>', methods=['DELETE'])
@user_required
def delete_goal(user: User, goal_id: int):
    goal = user.goals.filter_by(id=goal_id).first()
    if goal is None: 
        return jsonify({
            "error": "Goal not found."
        }), HTTPStatus.BAD_REQUEST
    
    # TODO: Set is_deleted = True, commit db
    goal.is_deleted = True
    db.session.commit()
    return jsonify({"message": "Goal deleted successfully."}), HTTPStatus.OK

@app_bp.route('/goal/<int:goal_id>', methods=['PATCH'])
@user_required
def edit_goal(user: User, goal_id: int):
    goal = user.goals.filter_by(id=goal_id).first()
    if goal is None:
        return jsonify({
            "error": "Goal not found."
        }), HTTPStatus.BAD_REQUEST
    
    goal.title = request.form.get('title', goal.title)
    goal.description = request.form.get('description', goal.description)
    goal.required_amount = float(request.form.get('required_amount', goal.required_amount))

    image_updated = request.files.get('image')
    if image_updated:
        formatted = f"{user.id}-{goal.title}-{image_updated.filename}"
        filename = secure_filename(formatted)

        file_path = os.path.join('static/uploads/goals', filename)
        image_updated.save(file_path)

        goal.image_path = filename

    db.session.commit()
    return jsonify({"message": "goal updated successfully."}), HTTPStatus.OK

@app_bp.route('/goals', methods=['GET'])
@user_required
def fetch_all_goals(user: User):
    all_goals = get_goals(user)
    return jsonify(all_goals), HTTPStatus.OK

@app_bp.route('/goal', methods=['POST'])
@user_required
def add_goal(user: User):
    title = request.form.get('title')
    description = request.form.get('description')
    required_amount = request.form.get('required_amount')
    image = request.files.get('image')
    image_path = None

    if image:
        formatted = f"{user.id}-{title}-{image.filename}"
        filename = secure_filename(formatted)

        file_path = os.path.join('static/uploads/goals', filename)
        image.save(file_path)
        image_path = filename

    new_goal = Goal(
        user_id=user.id,
        title=title,
        description=description,
        required_amount=float(required_amount),
        image_path=image_path
    )

    db.session.add(new_goal)
    # db.session.commit()
    return jsonify({"message": "goal added successfully."}), HTTPStatus.OK

@app_bp.route('/transactions', methods=['GET'])
@user_required
def fetch_all_transactions(user: User):
    """ Pagination-ready transaction query route. """
    limit = int(request.args.get('limit', 10))
    offset = int(request.args.get('offset', 0))

    transactions = get_all_transactions(user, limit=limit, offset=offset)
    total = user.transactions.filter_by(is_deleted = False).count()
    
    return jsonify({
        "transactions": transactions,
        "total": total
    }), HTTPStatus.OK

@app_bp.route('/account', methods=['GET'])
@user_required
def fetch_profile_information(user: User):
    return jsonify(user.to_dict()), HTTPStatus.OK

@app_bp.route('/account', methods=['DELETE'])
@user_required
def delete_profile(user: User):
    db.session.delete(user)
    db.session.commit()
    return HTTPStatus.NO_CONTENT

@app_bp.route('/account', methods=['PUT'])
@user_required
def update_profile(user: User):
    user.username = request.form.get('username', user.username)
    user.fullname = request.form.get('fullname', user.fullname)

    file = request.files.get('image')
    if file:
        formatted = f"{user.id}-{file.filename}"
        filename = secure_filename(formatted)

        file_path = os.path.join("static/uploads/profiles", filename)
        file.save(file_path)

        user.profile_path = filename

    db.session.commit()

    return jsonify(user.to_dict()), HTTPStatus.OK

@app_bp.route('/password', methods=['PATCH'])
@user_required
def update_password(user: User):
    data = request.get_json()
    current_password = data['current']
    new_password = data['new']

    if not user.validate_password(current_password):
        return jsonify({"message": "Invalid Password!"}), HTTPStatus.UNAUTHORIZED
    if user.validate_password(new_password):
        return jsonify({"message": "New password must be different from your current password!"}), HTTPStatus.BAD_REQUEST
    
    user.password_hashed = new_password
    db.session.commit()

    return jsonify({"message": "Password updated successfully."}), HTTPStatus.OK