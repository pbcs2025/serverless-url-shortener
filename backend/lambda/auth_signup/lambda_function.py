import json
import os
import boto3
import hashlib
import hmac
import base64
from datetime import datetime, timezone

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ["USERS_TABLE"])

JWT_SECRET = os.environ.get("JWT_SECRET", "")


def _response(status, body):
  return {
    "statusCode": status,
    "headers": {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    "body": json.dumps(body),
  }


def _b64url(data: bytes) -> str:
  return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _sign(message: bytes) -> str:
  if not JWT_SECRET:
    raise Exception("JWT_SECRET is not set")
  sig = hmac.new(JWT_SECRET.encode("utf-8"), message, hashlib.sha256).digest()
  return _b64url(sig)


def _jwt(payload: dict) -> str:
  header = {"alg": "HS256", "typ": "JWT"}
  header_b64 = _b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
  payload_b64 = _b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
  signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
  signature_b64 = _sign(signing_input)
  return f"{header_b64}.{payload_b64}.{signature_b64}"


def _hash_password(password: str, salt: str) -> str:
  # Prototype-grade hashing to avoid extra dependencies; for production use bcrypt/argon2.
  dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000)
  return _b64url(dk)


def lambda_handler(event, context):
  try:
    body = json.loads(event.get("body", "{}"))
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = (body.get("password") or "")

    if not name or not email or not password or len(password) < 8:
      return _response(400, {"error": "Missing fields (name, email, password min 8 chars)"})

    # Simple deterministic userId
    user_id = hashlib.sha256(email.encode("utf-8")).hexdigest()[:24]

    # Ensure unique email
    existing = users_table.get_item(Key={"userId": user_id}).get("Item")
    if existing:
      return _response(409, {"error": "User already exists"})

    salt = _b64url(os.urandom(16))
    pw_hash = _hash_password(password, salt)

    now = datetime.now(timezone.utc).isoformat()
    users_table.put_item(
      Item={
        "userId": user_id,
        "email": email,
        "name": name,
        "passwordSalt": salt,
        "passwordHash": pw_hash,
        "createdAt": now,
      }
    )

    token = _jwt({"sub": user_id, "email": email, "iat": int(datetime.now(timezone.utc).timestamp())})
    return _response(200, {"token": token, "user": {"userId": user_id, "email": email, "name": name}})
  except Exception as e:
    return _response(500, {"error": str(e)})

