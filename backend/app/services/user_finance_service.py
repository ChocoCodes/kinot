from ..utils import calculate_percentage
from ..models import User, MonthlyFinance
from datetime import datetime, timezone

def get_user_finances(user: User) -> dict:
    now = datetime.now(timezone.utc)
    current_year, current_month = now.year, now.month

    previous_year = current_year - 1 if current_month == 1 else current_year
    previous_month = 12 if current_month == 1 else current_month - 1

    current = MonthlyFinance.query.filter(
        MonthlyFinance.user_id == user.id,
        MonthlyFinance.year == current_year,
        MonthlyFinance.month == current_month
    ).first()

    previous = MonthlyFinance.query.filter(
        MonthlyFinance.user_id == user.id,
        MonthlyFinance.year == previous_year,
        MonthlyFinance.month == previous_month
    ).first()
    
    savings_pct = spendings_pct = 0
    if current and previous:
        savings_pct = calculate_percentage(previous['savings'], current['savings'])
        spendings_pct = calculate_percentage(previous['spendings'], current['spendings'])

    print(f"Savings Percentage: {savings_pct}%\nSpendings Percentage: {spendings_pct}")
    response = {
        'current': current.to_dict() if current else None,
        'previous': previous.to_dict() if previous else None,
        'savings_pct': savings_pct,
        'spendings_pct': spendings_pct
    }

    return response
