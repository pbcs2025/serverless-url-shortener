import json, boto3, random, string, os, re
import hashlib, hmac, base64
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

BASE_URL = os.environ['BASE_URL']
JWT_SECRET = os.environ.get('JWT_SECRET', '')

CHARS = string.ascii_letters + string.digits  # 62 characters

def generate_short_code(length=6):
    return ''.join(random.choices(CHARS, k=length))

def is_valid_url(url):
    pattern = r'^https?://.+'
    return bool(re.match(pattern, url))

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
        body = json.loads(event.get('body', '{}'))
        long_url = body.get('longURL', '').strip()
        custom_code = body.get('customCode', '').strip()
        expiry_seconds = body.get('expirySeconds', None)

        # Validate URL
        if not long_url or not is_valid_url(long_url):
            return response(400, {'error': 'Invalid or missing URL'})

        # Use custom code or generate one
        short_code = custom_code if custom_code else generate_short_code()

        # Check uniqueness
        existing = table.get_item(Key={'shortCode': short_code}).get('Item')
        if existing:
            return response(409, {'error': 'Short code already exists'})

        # Build item
        item = {
            'shortCode': short_code,
            'longURL': long_url,
            'createdAt': datetime.now(timezone.utc).isoformat(),
            'clickCount': 0,
            'customCode': bool(custom_code),
        }
        if user_id:
            item['createdBy'] = user_id

        if expiry_seconds:
            item['expiryAt'] = int(datetime.now(timezone.utc).timestamp()) + int(expiry_seconds)

        table.put_item(Item=item)

        return response(200, {
            'shortURL': f'{BASE_URL}/{short_code}',
            'shortCode': short_code,
            'createdAt': item.get('createdAt')
        })

    except Exception as e:
        return response(500, {'error': str(e)})

def response(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }