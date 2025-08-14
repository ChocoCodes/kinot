from ..models import User, Goal, GoalContribution
from sqlalchemy import func, desc

def get_goals(user: User):
    all_goals = [goal.to_dict() for goal in user.goals] if user.goals else []
    return all_goals

def get_active_goals(user: User):
    active_goals_db = (
        user.goals
        .join(GoalContribution)
        .group_by(Goal.id)
        .order_by(desc(func.count(GoalContribution.id)))
        .all()
    )

    active_goals = [goal.to_dict() for goal in active_goals_db] if active_goals_db else []
    return active_goals