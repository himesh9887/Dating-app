# Spark

Spark is a full-stack social dating platform inspired by Instagram and Tinder. It combines social storytelling, nearby discovery, matching, and real-time chat in a mobile-first glassmorphism UI.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, Axios
- Backend: Node.js, Express, MongoDB, Socket.io
- Auth: JWT, Google OAuth
- Media: Cloudinary

## Project Structure

```text
dating-app/
  client/   # React + Tailwind application
  server/   # Express API + Socket.io + MongoDB models
```

## Quick Start

1. Install dependencies:
   `npm install`
2. Copy environment files:
   `client/.env.example` -> `client/.env`
   `server/.env.example` -> `server/.env`
3. Start both apps:
   `npm run dev`

## Key Features

- JWT authentication with Google OAuth login
- Infinite scrolling feed with stories
- Tinder-like discover deck with likes and super likes
- Instagram-style follow system
- Match creation and premium insights
- Real-time messaging with typing and read receipts
- Notification center and profile management

## Notes

- Cloudinary and MongoDB credentials are required for uploads and persistence.
- The frontend is configured to proxy `/api` to the server during local development.
