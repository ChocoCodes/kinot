from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token
from .utils import format_image_path, user_required
from http import HTTPStatus
from app import db
from .models import (
    User, 
    GoalContribution, 
    MonthlyFinance, 
    Transaction
)
from .services import (
    query_user,
    get_user_finances,
    get_recent_transactions,
    # get_goals,
    get_active_goals,
    ActiveGoalDTO
)

app_bp = Blueprint('test', __name__)

@app_bp.route('/test')
def test_route():
    user = query_user(1)
    goals_db = get_active_goals(user)
    print(f"DB Data: {goals_db}")
    goals_dto = [ActiveGoalDTO(goals) for goals in goals_db] if goals_db else []
    print(f"DTO Data: {goals_dto}")
    goals_parsed = [goal.__dict__ for goal in goals_dto] if goals_dto else []
    return jsonify(goals_parsed), HTTPStatus.OK

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
@user_required
def get_finances(user: User):
    response = get_user_finances(user)
    print(response)
    return jsonify(response), HTTPStatus.OK

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

    #db.session.commit()
    # TODO: Query updated finances & transaction log
    updated_transactions = get_recent_transactions(user)
    updated_finances = get_user_finances(user)

    # TODO: return updated as JSON 
    return jsonify({
        "finances": updated_finances,
        "transactions": updated_transactions
    }), HTTPStatus.OK

@app_bp.route('/home', methods=['GET'])
@user_required
def get_homepage_data(user: User):
    finances = get_user_finances(user)
    transactions = get_recent_transactions(user)
    goals_raw = get_active_goals(user)
    goals = [ActiveGoalDTO(goal) for goal in goals_raw] if goals_raw else []
    print(goals)
    response = {
        'finances': finances,
        'transactions': transactions,
        'goals': [goal.__dict__ for goal in goals]
    }
    return jsonify(response), HTTPStatus.OK

@app_bp.route('/update-goal/<int:goal_id>', methods=['POST'])
@user_required
def update_goal_contribution(user: User, goal_id: int):
    goal = user.goals.filter_by(id=goal_id).first()
    if goal is None:
        return jsonify({
            "error": "You are not authorized to update this goal."
        }), HTTPStatus.NOT_FOUND
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
    return jsonify(goal.to_dict()), HTTPStatus.OK

@app_bp.route('/delete-goal/<int:goal_id>', methods=['POST'])
@user_required
def delete_goal(user: User, goal_id: int):
    goal = user.goals.filter_by(id=goal_id).first()
    if goal is None: 
        return jsonify({
            "error": "Goal not found."
        }), HTTPStatus.NOT_FOUND
    
    # TODO: Set is_deleted = True, commit db
    goal.is_deleted = True
    #db.session.commit()
    updated_goals = get_active_goals(user)
    return jsonify([goal.to_dict() for goal in updated_goals]), HTTPStatus.OK