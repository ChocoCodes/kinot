from ..models import User, Goal, GoalContribution
from sqlalchemy import func, desc

def get_goals(user: User):
    all_goals = [goal.to_dict() for goal in user.goals] if user.goals else []
    return all_goals

def get_active_goals(user: User):
    active_goals_db = (
        user.goals
        .outerjoin(GoalContribution)
        .group_by(Goal.id)
        .order_by(desc(func.count(GoalContribution.id)), desc(Goal.created_at))
        .all()
    )
    return active_goals_db