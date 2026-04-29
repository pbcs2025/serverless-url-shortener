import json, boto3, os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def lambda_handler(event, context):
    short_code = event['pathParameters'].get('shortCode', '')

    result = table.get_item(Key={'shortCode': short_code})
    item = result.get('Item')

    if not item:
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Not found'})
        }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'shortCode': item['shortCode'],
            'longURL': item['longURL'],
            'clickCount': int(item.get('clickCount', 0)),
            'createdAt': item.get('createdAt', ''),
            'expiryAt': str(item.get('expiryAt', 'No expiry'))
        })
    }