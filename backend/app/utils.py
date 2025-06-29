import os
from datetime import datetime, timezone
import hashlib as hash
from flask import url_for

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
