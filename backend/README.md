# Backend — AWS Lambda Functions

Owner: RBM (Member 2)

## Functions
- **shorten_url** — Accepts a long URL, generates a short code, stores in DynamoDB
- **redirect_url** — Looks up the short code and redirects to the original URL
- **get_stats** — Returns click count and metadata for a given short code

## Environment Variables (set in Lambda Console)
| Key        | Value                          |
|------------|-------------------------------|
| TABLE_NAME | URLMappings                   |
| BASE_URL   | https://[your-api-gateway-url]/prod |

## IAM Role
Role name: `LambdaURLShortenerRole`  
Policies attached:
- AmazonDynamoDBFullAccess
- CloudWatchLogsFullAccess

## Runtime
Python 3.11

## Testing
Each function folder contains a `test_event.json` — paste into Lambda Console Test tab to test.