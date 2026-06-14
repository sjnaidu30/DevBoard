# DevBoard

Async standup tool for remote teams. Team members post daily updates, and goals. GitHub commits autosurface as context.
Manager gets daily email digest at 9AM.

## Tech Stack

- React (frontend)
- Node.js + Express (backend)
- PostgresSQL (database)
- Github OAuth (authentication)
- Nodemailer (email)
- Railway (server + DB hosting)
- Vercel (frontend hosting)

## Features

- GitHub OAuth
- Daily Standup form (3 Questions)
- Auto fetch yesterday's github commits
- 9 AM digest email to manager
- Team Dashboard

## Setup

### Pre-Requisties

- Node.js
- PostgresSQL
- GitHub OAuth App credentials

### Installation

1. Clone the repo.
2. Run `npm install` in /server and /client.
3. Copy `.env.example` to `env` and fill in values.
4. Run `psql -f server/db/schema.sql` to setup database.
5. Run `npm ru dev` to start.

## Project Structure

- /client - React Frontend
- /server/routes - API endpoints
- /server/controllers - Buisness logic
- /server/middleware - Auth checks
- /server/db - Database connection and schema
- /server/services - GitHub API, emails
- /server/jobs - Cron jobs for digest email
