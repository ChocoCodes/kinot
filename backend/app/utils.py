import os
import hashlib as hash

def generate_salt():
    return os.urandom(16)

def generate_hash(data: str, salt: bytes) -> str:
    """ Convert password to bytes, combine with salt, hash the data and return as string. """
    data_bytes = data.encode()
    data_salted = (salt + data_bytes)
    data_hashed = hash.sha256(data_salted).hexdigest()
    return data_hashed