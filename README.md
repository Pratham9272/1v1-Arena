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
- Match creation in this version is API-driven and mocked as an instant paired match so the UI and payout flow can be tested early.
- Real-time matchmaking, payment gateway integration, anti-cheat checks, and multiplayer session sync can be added next.
