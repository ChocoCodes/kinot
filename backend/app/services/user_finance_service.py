from ..utils import calculate_percentage
from ..models import User

def get_user_finances(user: User) -> dict:
    len_record = len(user.monthly_finances)

    current = user.monthly_finances[-1].to_dict() if len_record >= 1 else None
    previous = user.monthly_finances[-2].to_dict() if len_record >= 2 else None

    savings_pct = spendings_pct = 0
    if current and previous:
        savings_pct = calculate_percentage(previous['savings'], current['savings'])
        spendings_pct = calculate_percentage(previous['spendings'], current['spendings'])

    print(f"Savings Percentage: {savings_pct}%\nSpendings Percentage: {spendings_pct}")
    response = {
        'current': current,
        'previous': previous,
        'savings_pct': savings_pct,
        'spendings_pct': spendings_pct
    }

    return response
