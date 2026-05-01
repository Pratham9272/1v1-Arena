# 1v1 MERN Gaming Platform

This workspace contains a first-pass MERN setup for:

- `client`: player-facing React app
- `server`: Express + MongoDB API
- `admin`: React admin panel

## Core features in this version

- Signup and login flow
- Rs 50 welcome bonus for every new user
- Wallet balance visible in the navbar after login
- Protected match entry that redirects unauthenticated users to auth first
- Redirect back to the page the user originally wanted after auth
- Two launch games:
  - Speed Math
  - Typing Race
- Entry fee defaults to Rs 5 or Rs 10
- Match payout calculation with 75% to winner and 25% refund to loser
- Admin dashboard for users, games, matches, and payout totals

## Project structure

```text
client/   Player frontend
server/   Backend API
admin/    Admin panel
```

## Suggested setup

1. Install dependencies from the project root:

```bash
npm install
```

2. Copy the environment file:

```bash
copy server\\.env.example server\\.env
```

3. Start each app in its own terminal:

```bash
npm run dev:server
npm run dev:client
npm run dev:admin
```

## Backend notes

- Default API URL: `http://localhost:5000/api`
- The backend is designed for MongoDB with Mongoose models.
- For MongoDB Atlas, you can keep the SRV URI in `MONGODB_URI` and set the actual database name with `MONGODB_DB_NAME`.
- On Render, add these backend environment variables in the service dashboard:
  - `MONGODB_URI`: your MongoDB Atlas connection string. The code also accepts `MONGO_URI` or `DATABASE_URL`.
  - `MONGODB_DB_NAME`: `one-v-one-platform`, or your preferred database name.
  - `JWT_SECRET`: a strong random secret.
  - `CLIENT_URL`: deployed player frontend URL.
  - `ADMIN_URL`: deployed admin frontend URL.
  - `ADMIN_ACCESS_KEY`: a private admin key.
- Match creation in this version is API-driven and mocked as an instant paired match so the UI and payout flow can be tested early.
- Real-time matchmaking, payment gateway integration, anti-cheat checks, and multiplayer session sync can be added next.
