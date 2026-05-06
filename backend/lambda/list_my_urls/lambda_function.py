import json
import os
import boto3
import hashlib
import hmac
import base64
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])  # URLMappings

BASE_URL = os.environ.get("BASE_URL", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "")

# Must exist in DynamoDB:
# GSI name: createdBy-createdAt-index
# PK: createdBy (S)
# SK: createdAt (S)
GSI_NAME = os.environ.get("HISTORY_GSI_NAME", "createdBy-createdAt-index")


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


def _b64url_decode(s: str) -> bytes:
  pad = "=" * ((4 - (len(s) % 4)) % 4)
  return base64.urlsafe_b64decode((s + pad).encode("utf-8"))


def _sign(message: bytes) -> str:
  if not JWT_SECRET:
    raise Exception("JWT_SECRET is not set")
  sig = hmac.new(JWT_SECRET.encode("utf-8"), message, hashlib.sha256).digest()
  return _b64url(sig)


def verify_bearer_token(event):
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


def lambda_handler(event, context):
  try:
    user_id, _ = verify_bearer_token(event)
    if not user_id:
      return _response(401, {"error": "Unauthorized"})

    limit = 50
    try:
      qs = event.get("queryStringParameters") or {}
      if qs.get("limit"):
        limit = max(1, min(200, int(qs.get("limit"))))
    except Exception:
      limit = 50

    try:
      resp = table.query(
        IndexName=GSI_NAME,
        KeyConditionExpression=Key("createdBy").eq(user_id),
        ScanIndexForward=False,  # newest first (createdAt DESC)
        Limit=limit,
      )
      items = resp.get("Items", [])
    except Exception as gsi_err:
      # GSI may not exist yet — fall back to a filtered Scan
      # This is slower but ensures the endpoint works while the GSI is being created
      scan_resp = table.scan(
        FilterExpression=Attr("createdBy").eq(user_id),
        Limit=200,
      )
      items = scan_resp.get("Items", [])
      # Sort by createdAt descending and apply limit
      items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
      items = items[:limit]

    out = []
    for it in items:
      sc = it.get("shortCode")
      out.append(
        {
          "shortCode": sc,
          "shortURL": f"{BASE_URL}/{sc}" if BASE_URL and sc else None,
          "longURL": it.get("longURL"),
          "createdAt": it.get("createdAt"),
          "clickCount": int(it.get("clickCount", 0)),
        }
      )

    return _response(200, {"items": out})
  except Exception as e:
    return _response(500, {"error": str(e)})

