# Backend Consolidation Guide

## Overview
This document describes the consolidated backend setup for the Horizon project. Previously, there were two separate Express servers (Backend/ and Admin/server/). These have been unified into a single Backend server that serves both customer-facing frontend APIs and admin dashboard APIs.

## Structure
```
Backend/
├── src/
│   ├── index.ts          # Main server entry point
│   ├── middleware/       # Unified middleware
│   │   ├── errorHandler.ts
│   │   └── notFoundHandler.ts
│   ├── routes/          # All API routes
│   │   ├── tours.ts
│   │   ├── countries.ts
│   │   └── search.ts
│   ├── services/        # Business logic
│   │   └── AdminService.ts
│   ├── types/           # TypeScript definitions
│   │   └── database.ts
│   └── lib/
│       └── supabase.ts  # Supabase client
├── package.json
├── tsconfig.json
└── .env                 # Environment variables
```

## Key Features

### Unified Middleware
- **errorHandler.ts**: Global error handling with proper HTTP status codes
- **notFoundHandler.ts**: 404 route handling

### Environment Variables
The Backend uses these environment variables (ensure they're in `Backend/.env`):

```env
# Core
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Frontend
FRONTEND_URL=http://localhost:5173

# Security (optional)
HELMET_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### API Endpoints
All endpoints are prefixed with `/api/`:

- **Tours**: `/api/tours`
  - `GET /` - List all tours
  - `GET /:id` - Get tour details
  - `POST /` - Create tour
  - `PUT /:id` - Update tour
  - `DELETE /:id` - Delete tour

- **Countries**: `/api/countries`
  - `GET /` - List all countries
  - `POST /` - Create country
  - `PUT /:id` - Update country
  - `DELETE /:id` - Delete country

- **Search**: `/api/search`
  - `GET /` - Search tours/countries with filters

- **Health**: 
  - `GET /health` - Server health check
  - `GET /api/tours/health-check` - API health status

## Running the Server

### From Admin folder (recommended for local development)
```bash
cd Admin
npm run dev:full
```
This starts both the Admin UI (port 5173) and Backend server (port 3001).

### Direct Backend execution
```bash
cd Backend
npm install
npm run dev
```

### Production build
```bash
cd Backend
npm run build
npm start
```

## Configuration
- **Development mode**: `npm run dev` (uses nodemon for hot reload)
- **Production mode**: `npm start` (runs compiled JavaScript)
- **Build**: `npm run build` (compiles TypeScript to `dist/`)

## Migration from Old Structure
The old structure had:
- `Backend/` - unused root-level backend
- `Admin/server/` - active admin backend (port 3001)

Now everything is in:
- `Backend/` - unified backend for all APIs (port 3001)
- `Admin/server/` - can be safely deleted after verification

### What Changed in Admin
`Admin/package.json` npm scripts now reference the unified Backend:
- `npm run backend:dev` - Start Backend in development
- `npm run dev:full` - Start Admin UI + Backend together
- `npm run backend:build` - Build Backend

## Service Architecture
The `AdminService` handles:
- Tour CRUD operations
- Country/City CRUD operations  
- Dashboard statistics
- Search and filtering

All operations interact with Supabase via:
- Direct database queries (for public data)
- Service role key access (for protected operations)

## Notes
- Backend runs on port 3001 by default (configurable via PORT env var)
- Admin UI runs on port 5173
- Both share the same Supabase database
- All middleware is properly ordered in index.ts for correct execution
- Error handling includes database-specific error mappings
