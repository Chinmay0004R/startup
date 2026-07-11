import hashlib
import hmac
import secrets


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        _, iterations, salt, stored_hash = hashed_password.split("$", 3)
        derived_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            int(iterations),
        ).hex()
        return hmac.compare_digest(derived_hash, stored_hash)
    except (ValueError, TypeError):
        return False


def get_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    iterations = 100000
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        iterations,
    ).hex()
    return f"pbkdf2_sha256${iterations}${salt}${digest}"
