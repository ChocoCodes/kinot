from ..models import User, Transaction

def get_recent_transactions(user: User):
    sorted_transactions = (
        user.transactions
        .filter_by(is_deleted = False)
        .order_by(Transaction.created_at.desc())
        .limit(5)
        .all()
    )
    transaction_records = [transaction.to_dict() for transaction in sorted_transactions]
    return transaction_records