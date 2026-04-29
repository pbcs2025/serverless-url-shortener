# Serverless URL Shortener using AWS

A cloud-native web application that converts long URLs into short, shareable links using a fully serverless backend on AWS.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js |
| Hosting | Amazon S3 |
| API | Amazon API Gateway |
| Backend | AWS Lambda (Python 3.11) |
| Database | Amazon DynamoDB |
| Monitoring | Amazon CloudWatch |
| Security | AWS IAM |

## Repository Structure
```
serverless-url-shortener/
├── frontend/        # React.js UI (Owner: Member 1 – Monika)
├── backend/         # Lambda functions (Owner: Member 2 – RBM)
├── database/        # DynamoDB schema & config (Owner: Member 3 – Monika)
├── api-gateway/     # API Gateway config & Postman (Owner: Member 3 – PBC)
├── testing/         # Test plan & results (Owner: Member 4 – Parvati)
└── docs/            # All project documents (Owner: Member 4 – Parvati)
```

## Quick Setup
1. Clone the repo: `git clone https://github.com/pbcs2025/serverless-url-shortener.git`
2. Follow setup steps in each folder's `README.md`
3. Start with `backend/README.md` → `database/README.md` → `api-gateway/README.md` → `frontend/README.md`

## Team
| Member | Role |
|---|---|
| Monika | Frontend Developer |
| RBM | Backend / Cloud Engineer |
| PBC | Database & API Manager |
| Parvati | Testing, Docs & Deploy Lead |

## Academic Year: 2024–2025