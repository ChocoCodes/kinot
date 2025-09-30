from ..models import User, Goal, GoalContribution
from sqlalchemy import func, desc
from datetime import datetime


def append_monthly_contribution(goal):
    now = datetime.now()
    current_month = now.month
    current_year = now.year
    monthly_contributions = [
            contribution for contribution in goal.goal_contributions
            if contribution.added_at.month == current_month and 
            contribution.added_at.year == current_year
    ]
    total = sum(contribution.amount for contribution in monthly_contributions)
    goal_dict = goal.to_dict()
    goal_dict['monthly_contribution'] = total

    return goal_dict

def get_goals(user: User):
    """ Fetch user goals and append total monthly contributions. """
    all_goals = [
        append_monthly_contribution(goal)
        for goal in user.goals
    ]
    #all_goals = [goal.to_dict() for goal in user.goals] if user.goals else []
    return all_goals

def get_active_goals(user: User):
    active_goals_db = (
        user.goals
        .outerjoin(GoalContribution)
        .filter(
            Goal.current_amount < Goal.required_amount, 
            Goal.is_deleted == False
        )
        .group_by(Goal.id)
        .order_by(
            desc(func.count(GoalContribution.id)), 
            desc(Goal.created_at)
        )
        .limit(3)
        .all()
    )

    active = [
        append_monthly_contribution(goal)
        for goal in active_goals_db
    ]
    
    return active