import os
import json
import hashlib
import hmac
import base64

JWT_SECRET = os.environ.get("JWT_SECRET", "")


def _b64url_decode(s: str) -> bytes:
  pad = "=" * ((4 - (len(s) % 4)) % 4)
  return base64.urlsafe_b64decode((s + pad).encode("utf-8"))


def _b64url(data: bytes) -> str:
  return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _sign(message: bytes) -> str:
  if not JWT_SECRET:
    raise Exception("JWT_SECRET is not set")
  sig = hmac.new(JWT_SECRET.encode("utf-8"), message, hashlib.sha256).digest()
  return _b64url(sig)


def verify_bearer_token(event):
  """
  Very small JWT verification (HS256) for this prototype.
  Returns (user_id, payload) or (None, None).
  """
  auth = (event.get("headers") or {}).get("Authorization") or (event.get("headers") or {}).get("authorization") or ""
  if not auth.startswith("Bearer "):
    return None, None
  token = auth.replace("Bearer ", "").strip()
  parts = token.split(".")
  if len(parts) != 3:
    return None, None
  header_b64, payload_b64, sig_b64 = parts
  signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
  expected = _sign(signing_input)
  if not hmac.compare_digest(expected, sig_b64):
    return None, None
  payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
  return payload.get("sub"), payload

