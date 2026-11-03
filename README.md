# Fix My Area

Fix My Area is a civic complaint management application that helps residents report local problems such as potholes, water leaks, broken street lights, and garbage issues. The platform lets users submit complaints and track their status.

## Project structure

- `frontend/` — React + Vite client
- `backend/` — Express + MongoDB API

## Features

- Submit complaints with title, category, location, description, priority, and reporter info
- Browse all reports with search and filters
- Update complaint status from admin side
- View notifications for new complaints and status changes; mark them as read individually or in bulk
- Register and sign in as a resident; admin registrations require a private invite key
- Complaint status and deletion actions are restricted to authenticated administrators
- Short-lived access tokens with rotating refresh tokens stored in HTTP-only cookies
- Separate public landing page and signed-in dashboard; light and dark themes
- Responsive sidebar-based dashboard interface

## Tech stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB with Mongoose

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment variables

### Backend

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/fix-my-area
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
ADMIN_REGISTRATION_KEY=replace-with-a-long-private-admin-invite-key
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

## Production build

```bash
cd frontend
npm run build
```

## Notes

- If `MONGO_URI` is missing or invalid, the backend uses local in-memory complaint and notification stores. Local data is cleared when the backend restarts.
- Do not commit your real `.env` files to Git.
- Set a unique `JWT_SECRET` of at least 32 characters and keep the admin registration key private. Admin accounts can only be created with that backend-only key.
- Authentication accounts use MongoDB when available. Without MongoDB, the development fallback keeps accounts in memory and clears them when the backend restarts.
- Access tokens expire after 15 minutes. A rotating refresh token is stored in a secure HTTP-only cookie and can keep a session active for up to 30 days.
