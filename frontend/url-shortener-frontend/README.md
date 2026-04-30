# SwiftLink Frontend

React frontend for a serverless URL shortener deployed on AWS API Gateway + Lambda + DynamoDB.

## API Configuration

The app reads the API URL from `REACT_APP_API_URL`.

- Base URL: `https://05rndb0vge.execute-api.ap-south-1.amazonaws.com/prod`
- Endpoints used by frontend:
  - `POST /shorten`
  - `GET /{shortCode}` (displayed in result card)
  - `GET /stats/{shortCode}`

## Setup

1. Install dependencies:
   - `npm install`
2. Create env file:
   - Copy `.env.example` to `.env`
3. Run locally:
   - `npm start`

## Build

- Production build: `npm run build`

## Project Structure

- `src/components`: reusable UI (`URLForm`, `ResultCard`, `StatsCard`, `Navbar`)
- `src/pages`: routed pages (`HomePage`, `StatsPage`, `NotFoundPage`)
- `src/services`: API layer (`api.js`)
- `src/utils`: helpers (`validators.js`, `formatters.js`)
