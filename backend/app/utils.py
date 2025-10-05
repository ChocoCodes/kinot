import os
from datetime import datetime, timezone, timedelta
import hashlib as hash
from flask import url_for, jsonify
from functools import wraps
from http import HTTPStatus
from .models import User
from flask_jwt_extended import (
    verify_jwt_in_request, 
    get_jwt_identity,
    create_access_token,
    create_refresh_token
)

def create_auth_response(user: User):
    """ 
        Utility function that creates refresh and access tokens,
        Construct response from User object, and sends the refresh_token
        via HTTP-only cookie.
    """
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    user_dto = {
        'id': user.id,
        'user': user.username,
        'token': access_token,
        'profile_path': format_image_path(user.profile_path, 'profiles')
    }

    response = jsonify(user_dto)

    # Send refresh_token via HTTP-only cookie
    response.set_cookie(
        'refresh_token',
        refresh_token,
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=timedelta(days=7)
    )

    return response

def user_required(fn):
    from .models import User
    """ Decorator that holds all JWT validation and user query for routes. """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request() # Check JWT in request headers

        user_id = int(get_jwt_identity()) # Decode user_id in the JWT
        if user_id is None:
            return jsonify({
                "error": "User_id is not found in token."
            }), HTTPStatus.UNAUTHORIZED

        user = User.query.get(user_id)
        if user is None:
            return jsonify({
                "error": "User is not found in the database."
            }), HTTPStatus.NOT_FOUND
        return fn(user, *args, **kwargs)
    return wrapper

def generate_salt():
    return os.urandom(16)

def generate_hash(data: str, salt: bytes) -> str:
    """ Convert password to bytes, combine with salt, hash the data and return as string. """
    data_bytes = data.encode()
    data_salted = (salt + data_bytes)
    data_hashed = hash.sha256(data_salted).hexdigest()
    return data_hashed

def format_image_path(filename: str, folder: str) -> str:
    return url_for('static', filename=f'uploads/{folder}/{filename}', _external=True)

def isoformat_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")

def calculate_percentage(previous: float, current: float) -> float: 
    if previous == 0.0:
        if current == 0.0:
            return 0.0
        return 100.0
    change = (current - previous) / abs(previous) * 100
    return round(change, 2)