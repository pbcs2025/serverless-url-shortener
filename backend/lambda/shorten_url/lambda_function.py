import json
import boto3
import random
import string
import os
import re
from datetime import datetime, timezone

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')
# These environment variables will be set later in the AWS Console
table = dynamodb.Table(os.environ.get('TABLE_NAME', 'URLMappings'))
BASE_URL = os.environ.get('BASE_URL', 'https://your-api.com/prod')

CHARS = string.ascii_letters + string.digits  # ABC...xyz...012

def generate_short_code(length=6):
    """Generates a random 6-character alphanumeric code."""
    return ''.join(random.choices(CHARS, k=length))

def is_valid_url(url):
    """Simple regex to check if the string is a valid URL."""
    pattern = r'^https?://.+'
    return bool(re.match(pattern, url))

def lambda_handler(event, context):
    try:
        # 1. Parse the request body from the frontend
        body = json.loads(event.get('body', '{}'))
        long_url = body.get('longURL', '').strip()
        custom_code = body.get('customCode', '').strip()
        expiry_seconds = body.get('expirySeconds', None)

        # 2. Basic Validation
        if not long_url or not is_valid_url(long_url):
            return response(400, {'error': 'Invalid or missing URL'})

        # 3. Handle Custom Code or Generate Random
        short_code = custom_code if custom_code else generate_short_code()

        # 4. Check if short code already exists (Collision check)
        existing = table.get_item(Key={'shortCode': short_code}).get('Item')
        if existing:
            return response(409, {'error': 'Short code already exists'})

        # 5. Prepare the item for DynamoDB
        item = {
            'shortCode': short_code,
            'longURL': long_url,
            'createdAt': datetime.now(timezone.utc).isoformat(),
            'clickCount': 0,
            'customCode': bool(custom_code),
        }
        
        # Add optional expiry if provided
        if expiry_seconds:
            item['expiryAt'] = int(datetime.now(timezone.utc).timestamp()) + int(expiry_seconds)

        # 6. Save to Database
        table.put_item(Item=item)

        # 7. Return success to the frontend
        return response(200, {
            'shortURL': f'{BASE_URL}/{short_code}',
            'shortCode': short_code
        })

    except Exception as e:
        return response(500, {'error': str(e)})

def response(status, body):
    """Helper function to format the API Gateway response with CORS support."""
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' # Required for PBC's React app to talk to us
        },
        'body': json.dumps(body)
    }