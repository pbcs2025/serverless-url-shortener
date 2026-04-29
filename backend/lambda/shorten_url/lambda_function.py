import json, boto3, random, string, os, re
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

BASE_URL = os.environ['BASE_URL']

CHARS = string.ascii_letters + string.digits  # 62 characters

def generate_short_code(length=6):
    return ''.join(random.choices(CHARS, k=length))

def is_valid_url(url):
    pattern = r'^https?://.+'
    return bool(re.match(pattern, url))

def lambda_handler(event, context):
    try:
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

        if expiry_seconds:
            item['expiryAt'] = int(datetime.now(timezone.utc).timestamp()) + int(expiry_seconds)

        table.put_item(Item=item)

        return response(200, {
            'shortURL': f'{BASE_URL}/{short_code}',
            'shortCode': short_code
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