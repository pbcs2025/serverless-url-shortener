import json, boto3, os
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    short_code = event['pathParameters'].get('shortCode', '')

    if not short_code:
        return response(400, 'Missing short code')

    result = table.get_item(Key={'shortCode': short_code})
    item = result.get('Item')

    if not item:
        return response(404, 'Short URL not found')

    # Check expiry (backup check — TTL may not delete instantly)
    expiry = item.get('expiryAt')
    if expiry and int(expiry) < int(datetime.now(timezone.utc).timestamp()):
        return response(410, 'This short URL has expired')

    # Increment click count atomically
    table.update_item(
        Key={'shortCode': short_code},
        UpdateExpression='ADD clickCount :inc',
        ExpressionAttributeValues={':inc': 1}
    )

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