import json
import boto3
import os
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ.get('TABLE_NAME', 'URLMappings'))

def lambda_handler(event, context):
    # Get the short code from the URL path (e.g., /abc123)
    short_code = event.get('pathParameters', {}).get('shortCode', '')

    if not short_code:
        return response(400, 'Missing short code')

    # Look up the URL in DynamoDB
    result = table.get_item(Key={'shortCode': short_code})
    item = result.get('Item')

    if not item:
        return response(404, 'Short URL not found')

    # Check if the URL has expired [cite: 266]
    expiry = item.get('expiryAt')
    if expiry and int(expiry) < int(datetime.now(timezone.utc).timestamp()):
        return response(410, 'This short URL has expired')

    # Increment click count atomically (thread-safe) [cite: 122, 270]
    table.update_item(
        Key={'shortCode': short_code},
        UpdateExpression='ADD clickCount :inc',
        ExpressionAttributeValues={':inc': 1}
    )

    # Return a 301 Redirect to the long URL [cite: 276]
    return {
        'statusCode': 301,
        'headers': {
            'Location': item['longURL'],
            'Access-Control-Allow-Origin': '*'
        },
        'body': ''
    }

def response(code, msg):
    return { 
        'statusCode': code,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': msg}) 
    }