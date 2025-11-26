from ..models import User, Transaction
from datetime import datetime, timezone
from sqlalchemy import extract 

def get_recent_transactions(user: User):
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year

    sorted_transactions = (
        user.transactions
        .filter(
            Transaction.is_deleted == False,
            extract("month", Transaction.created_at) == current_month,
            extract("year", Transaction.created_at) == current_year
        )
        .order_by(Transaction.created_at.desc(), Transaction.id.desc())
        .limit(5)
        .all()
    )
    transaction_records = [transaction.to_dict() for transaction in sorted_transactions]
    return transaction_records

def get_all_transactions(user: User):
    transactions_query= user.transactions.filter_by(is_deleted = False).order_by(Transaction.created_at.desc(), Transaction.id.desc())
    transactions_sliced = transactions_query.all()
    transactions = [transaction.to_dict() for transaction in transactions_sliced]
    return transactions