# Rate Limiter Proxy API

A flexible API rate limiting proxy service that helps manage and control access to third-party APIs.

## Features

- API Key Authentication
- Dynamic App Registration
- Configurable Rate Limiting
- Request Queuing
- Proxy Request Forwarding

## Prerequisites

- Node.js (v14 or higher)
- Redis
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

## Configuration

Update the `.env` file with your settings:

```env
PORT=3000
REDIS_URL=redis://localhost:6379
MONGODB_URL=mongodb://localhost:27017/rate-limiter
```

## API Endpoints

### Authentication

#### Register a new user
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "apiKey": "your-api-key"
}
```

### App Management

All app management endpoints require the `X-API-Key` header.

#### Register a new app
```
POST /apps
Content-Type: application/json
X-API-Key: your-api-key

{
  "name": "My API",
  "baseUrl": "https://api.example.com",
  "rateLimitConfig": {
    "strategy": "fixed-window",
    "requestCount": 100,
    "timeWindow": 60000
  }
}
```

#### List registered apps
```
GET /apps
X-API-Key: your-api-key
```

#### Update app configuration
```
PUT /apps/:appId
Content-Type: application/json
X-API-Key: your-api-key

{
  "rateLimitConfig": {
    "requestCount": 200,
    "timeWindow": 60000
  }
}
```

#### Delete an app
```
DELETE /apps/:appId
X-API-Key: your-api-key
```

### Using the Proxy

To make requests through the proxy:

```
[METHOD] /apis/:appId/*
X-API-Key: your-api-key
```

The proxy will:
1. Authenticate your request
2. Apply rate limiting
3. Forward your request to the registered API
4. Return the API response

## Rate Limiting Strategy

The service implements a fixed-window rate limiting strategy using Redis. When a request is made:

1. The current request count is checked against the configured limit
2. If below the limit, the request is forwarded
3. If at the limit, the request is queued
4. Queued requests are processed when the time window refreshes

## Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run in production mode
npm start
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 