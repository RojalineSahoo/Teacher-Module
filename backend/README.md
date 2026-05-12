# Teacher Module Backend

A production-ready Node.js/Express.js backend for the Teacher Module.

## Tech Stack
- **Core**: Node.js, Express.js
- **Database**: PostgreSQL (pg)
- **Auth**: JWT, bcryptjs, cookie-parser
- **Security**: Helmet, XSS-clean, Express-rate-limit, CORS
- **Documentation**: Swagger/OpenAPI
- **Validation**: Express-validator
- **Realtime**: Socket.io
- **Utilities**: Morgan, Dotenv, UUID, Nodemailer

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL

### Installation
1. Clone the repository.
2. Navigate to `/backend`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure `.env` file based on the template.
5. Setup database schema:
   ```bash
   npm run db:schema
   ```
6. Seed initial data:
   ```bash
   npm run db:seed
   ```
7. Start the server:
   ```bash
   npm run dev
   ```

## API Documentation
The API documentation is available at `/api/docs` (Swagger UI).

## Project Structure
- `src/config`: Database and app configuration
- `src/controllers`: Request handlers
- `src/routes`: API route definitions
- `src/middleware`: Custom middleware (auth, error, validation)
- `src/database`: Schema, queries, and seed data
- `src/validations`: Input validation rules
- `src/utils`: Reusable utility functions
- `src/services`: Business logic and external services

## API Endpoints
All endpoints are prefixed with `/api/v1`.

### Auth
- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login user
- `GET /auth/me`: Get current user
- `GET /auth/logout`: Logout user

### Topics
- `GET /topics`: Get all topics (supports filtering, sorting, pagination)
- `GET /topics/:id`: Get single topic with chapters
- `POST /topics`: Create a new topic
- `PUT /topics/:id`: Update topic
- `DELETE /topics/:id`: Delete topic
- `POST /topics/:topicId/chapters`: Add chapter
- `PUT /topics/chapters/:id`: Update chapter
