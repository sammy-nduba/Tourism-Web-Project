# Horizon Admin Backend Server

This is the Express.js backend server for the Horizon Admin application, providing REST API endpoints for the frontend.

## Features

- **Express.js** with TypeScript
- **CORS** enabled for frontend communication
- **Security** middleware (Helmet)
- **Error handling** middleware
- **Environment-based configuration**
- **RESTful API** endpoints

## Project Structure

```
server/
├── src/
│   ├── routes/          # API route handlers
│   │   ├── countries.ts # Country management endpoints
│   │   ├── search.ts    # Tour search endpoints
│   │   └── tours.ts     # Tour management endpoints
│   ├── middleware/      # Custom middleware
│   │   ├── errorHandler.ts
│   │   └── notFoundHandler.ts
│   └── index.ts         # Main server file
├── .env                 # Environment variables (create from .env.example)
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── nodemon.json         # Development configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure as needed:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start Development Server

For development with auto-restart:

```bash
cd server
npm run dev
```

For production build:

```bash
cd server
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## API Endpoints

### Countries
- `GET /api/countries` - Get all countries
- `POST /api/countries` - Create a new country

### Tours
- `GET /api/tours` - Get published tours (with optional filters)
- `POST /api/tours` - Create a new tour
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/:id` - Get tour by ID
- `PUT /api/tours/:id` - Update tour
- `DELETE /api/tours/:id` - Delete tour
- `GET /api/tours/slug/:slug` - Get tour by slug

### Search
- `GET /api/search?q=query&country=X&limit=Y&offset=Z` - Search tours

### Health Check
- `GET /health` - Server health status

## Development Workflow

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **In another terminal, start the frontend:**
   ```bash
   npm run dev
   ```

3. **Or run both simultaneously:**
   ```bash
   npm run dev:full
   ```

The backend will be available at `http://localhost:3001` and the frontend at `http://localhost:5173`.

## Integration Notes

- The server uses the existing `AdminService` from the frontend project
- CORS is configured to accept requests from the frontend development server
- All API endpoints follow RESTful conventions
- Error responses include appropriate HTTP status codes
- The server includes security headers via Helmet middleware

## Deployment

For production deployment:

1. Build the application: `npm run build`
2. Set production environment variables in `.env`
3. Start with: `npm start`

Make sure to set `NODE_ENV=production` and configure the `FRONTEND_URL` for your production domain.