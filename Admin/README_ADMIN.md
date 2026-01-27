# Wild Horizon Adventures - Admin Dashboard

A comprehensive admin dashboard for managing Wild Horizon Adventures' tours, programs, blog content, and user requests.

## Features

### Authentication
- Secure admin login with Supabase Auth
- Role-based access control (Admin/Editor roles)
- Protected routes requiring authentication
- Session management

### Dashboard Overview
- Summary statistics cards showing:
  - Total tours and programs
  - Pending contact requests
  - Pending volunteer applications
  - Total donations
  - Recent activity
- Quick actions for common tasks
- System status indicators

### Content Management

#### Tours Management
- View all tours in a sortable table
- Create new tours with details:
  - Title, slug, description
  - Location (city/country)
  - Duration, price, difficulty level
  - Gallery images, highlights
  - Included/excluded items
- Edit existing tours
- Publish/unpublish tours
- Delete tours

#### Programs Management
- Manage conservation and volunteer programs
- Program types: volunteer, conservation, education
- Track duration, cost, requirements
- Activity listings
- Publish/draft status

#### Blog Management
- Create and edit blog posts with:
  - Title, slug, excerpt
  - Featured images
  - Categories and tags
  - Rich content
- Publish/draft workflow
- Author tracking

#### Events Management
- Create calendar events
- Event details: date, time, location
- Event types and descriptions
- Publish/unpublish events

### Request Management

#### Contact Requests
- View all contact form submissions
- Mark requests as resolved
- Add admin notes
- Filter by status (pending/resolved/archived)

#### Volunteer Applications
- Review volunteer applications
- View applicant details:
  - Personal information
  - Experience and motivation
  - Preferred start dates
- Approve or reject applications
- Add admin notes for internal tracking

#### Donations
- Track all donation requests
- View donation details:
  - Donor information
  - Amount and currency
  - Donation type (one-time/monthly)
  - Purpose
  - Payment status
- Total donations summary

## Architecture

The application follows a full-stack architecture with separate frontend and backend:

### Frontend (React + TypeScript)
```
/src/admin
  /presentation     # React components, pages, layouts
    /pages         # Page components
    /components    # Reusable UI components
    /layouts       # Layout components
    /hooks         # Custom React hooks
  /services        # External services & API clients
```

### Backend (Node.js + Express + TypeScript)
```
/server/src
  /routes          # API route handlers
  /middleware      # Custom middleware (error handling, etc.)
  /services        # Business logic (shared with frontend)
  /utils           # Utility functions
```

The backend provides REST API endpoints that the frontend consumes, enabling proper separation of concerns and better scalability.

## Database Schema

The dashboard uses Supabase with the following tables:
- `admin_roles` - Admin user roles and permissions
- `countries` - Country information
- `cities` - Cities linked to countries
- `tours` - Tour/adventure details
- `programs` - Conservation/volunteer programs
- `blog_posts` - Blog content
- `events` - Calendar events
- `contact_requests` - Contact form submissions
- `donation_requests` - Donation tracking
- `volunteer_applications` - Volunteer sign-ups
- `audit_logs` - Admin action logs

All tables have Row Level Security (RLS) enabled with appropriate policies.

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase credentials in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. **Set up the backend server:**

   a. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

   b. Configure server environment (`.env`):
   ```bash
   cd server
   cp .env.example .env
   ```

   c. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

3. Create an admin user in Supabase:

First, sign up a user through Supabase Auth, then add them to the admin_roles table:

```sql
-- Get your user ID from auth.users table
SELECT id, email FROM auth.users;

-- Add admin role
INSERT INTO admin_roles (user_id, role, permissions)
VALUES ('your-user-id', 'admin', '["all"]'::jsonb);
```

4. **Start both frontend and backend:**

   Option A - Run separately:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

   Option B - Run together:
   ```bash
   npm run dev:full
   ```

5. Access the admin dashboard at `http://localhost:5173`

   The backend API will be available at `http://localhost:3001`

### Adding Sample Data

You can add sample data through the Supabase SQL editor:

```sql
-- Add countries
INSERT INTO countries (name, code, description) VALUES
  ('Kenya', 'KE', 'Home to the Maasai Mara and diverse wildlife'),
  ('Uganda', 'UG', 'The pearl of Africa'),
  ('Tanzania', 'TZ', 'Mount Kilimanjaro and the Serengeti'),
  ('Rwanda', 'RW', 'Land of a thousand hills');

-- Add cities (get country IDs first)
INSERT INTO cities (name, country_id, description) VALUES
  ('Nairobi', (SELECT id FROM countries WHERE code = 'KE'), 'Capital of Kenya'),
  ('Kampala', (SELECT id FROM countries WHERE code = 'UG'), 'Capital of Uganda');

-- Add a sample tour
INSERT INTO tours (title, slug, description, city_id, duration_days, price, difficulty_level, is_published)
VALUES (
  'Maasai Mara Safari',
  'maasai-mara-safari',
  'Experience the Great Migration',
  (SELECT id FROM cities WHERE name = 'Nairobi'),
  5,
  2500,
  'moderate',
  true
);
```

## Security

- All database tables use Row Level Security (RLS)
- Admin access required for all management operations
- Authentication state managed securely
- Sensitive operations require confirmation
- Audit logs track admin actions

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js + TypeScript
- **Security**: Helmet.js
- **CORS**: Configured for frontend communication
- **Development**: nodemon for auto-restart

### Database & Auth
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase subscriptions

### Development Tools
- **Process Manager**: concurrently (for running frontend/backend together)
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Features Coming Soon

- Advanced search and filtering
- Bulk operations
- Data export (CSV/JSON)
- Image upload management
- Rich text editor for blog posts
- Tour/program form builders
- Email notifications
- Advanced analytics and reporting
