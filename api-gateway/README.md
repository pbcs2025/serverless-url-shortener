# API Gateway — Amazon API Gateway

**Owner: PBC**

This folder contains the API definition and Postman test collection.

## Endpoints

| Method | Resource | Lambda | Description |
|---|---|---|---|
| POST | `/shorten` | `shorten_url` | Shorten a long URL |
| GET | `/{shortCode}` | `redirect_url` | Redirect to original URL |
| GET | `/stats/{shortCode}` | `get_stats` | Get click stats for a URL |

## Setup Steps (AWS Console)

### Step 1 — Create the REST API
1. AWS Console → API Gateway → **Create API**
2. Choose **REST API** (not HTTP API) → **Build**
3. API name: `URLShortenerAPI` | Endpoint type: **Regional**
4. Click **Create API**

### Step 2 — Create Resource: POST /shorten
1. Resources → Actions → **Create Resource**
2. Resource name: `shorten` | Resource path: `/shorten` → **Create Resource**
3. Select `/shorten` → Actions → **Create Method** → **POST** → confirm (✓)
4. Integration type: **Lambda Function**
5. ✅ Check **Lambda Proxy Integration**
6. Lambda Function: `shorten_url` → Save → OK (permission popup)

### Step 3 — Create Resource: GET /{shortCode}
1. Actions → **Create Resource**
2. Resource path: `{shortCode}` *(curly braces make it a path parameter)*
3. Add **GET** method → Lambda Proxy → `redirect_url`

### Step 4 — Create Resource: GET /stats/{shortCode}
1. Actions → **Create Resource** → path: `stats`
2. Under `/stats` → **Create Resource** → path: `{shortCode}`
3. Add **GET** method → Lambda Proxy → `get_stats`

### Step 5 — Enable CORS on All Resources
For `/shorten`, `/{shortCode}`, and `/stats/{shortCode}`:
1. Select resource → Actions → **Enable CORS**
2. Leave defaults (`Access-Control-Allow-Origin: *`)
3. Click **Enable CORS and replace existing CORS headers** → **Yes, replace**

### Step 6 — Deploy API
1. Actions → **Deploy API**
2. Deployment stage → **New Stage** → Stage name: `prod`
3. Click **Deploy**
4. Copy the **Invoke URL** → share with PBC (for frontend `.env`) and RBM (for Lambda env var)

## Using the Postman Collection
1. Open Postman → **Import** → select `postman_collection.json`
2. Set the `BASE_URL` variable to your actual API Gateway Invoke URL
3. Run each test case and record Pass/Fail results

## Test Cases Summary

| TC# | Test | Expected |
|---|---|---|
| TC01 | POST valid HTTPS URL | 200 OK |
| TC02 | POST valid HTTP URL | 200 OK |
| TC03 | POST invalid string | 400 Bad Request |
| TC04 | POST empty body | 400 Bad Request |
| TC05 | POST with custom code | 200 OK, shortURL uses custom code |
| TC06 | POST duplicate custom code | 409 Conflict |
| TC07 | GET valid short code | 301 Redirect |
| TC08 | GET unknown code | 404 Not Found |
| TC09 | GET expired URL | 410 Gone |
| TC11 | GET stats valid code | 200 OK with clickCount |
| TC12 | GET stats invalid code | 404 Not Found |