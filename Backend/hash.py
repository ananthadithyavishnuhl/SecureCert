import hashlib
import json

def hash_generation(details):
    serial=json.dumps(details, sort_keys=True)
    return hashlib.sha256(serial.encode()).hexdigest()