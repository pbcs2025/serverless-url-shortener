# SwiftLink — URL Shortener Frontend

React frontend (Create React App) for a serverless URL shortener backed by AWS API Gateway + Lambda + DynamoDB.

## API Gateway

- **Base invoke URL**: `https://05rndb0vge.execute-api.ap-south-1.amazonaws.com/prod`
- **POST** `.../shorten` — create short link
- **GET** `.../{shortCode}` — redirect (handled by API Gateway)
- **GET** `.../stats/{shortCode}` — analytics
- **POST** `.../auth/signup` — create user account (new)
- **POST** `.../auth/login` — login (new)
- **GET** `.../me/urls` — list logged-in user’s shortened URLs (new, requires Bearer token)

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure environment variables

- Copy `.env.example` to `.env`
- Ensure it contains:

```bash
REACT_APP_API_URL=https://05rndb0vge.execute-api.ap-south-1.amazonaws.com/prod
```

3) Run the app

```bash
npm start
```

Open `http://localhost:3000`.

## Pages

- `/` — shorten URL
- `/stats` — lookup analytics by short code
- `/stats/:shortCode` — direct analytics link
- `/signup` — create account
- `/login` — login
- `/dashboard` — protected dashboard (Shorten + History tabs)

## Notes

- Backend resources are configured in AWS Console. The backend folders in this repo are **reference only**.
- If your API returns slightly different field names (common with DynamoDB/Lambda), the UI normalizes common variants.
