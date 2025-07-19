from ..models import User 

def query_user(id: int) -> User:
    return User.query.get(id)