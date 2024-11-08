# financial-buckets

A Next.js app to manage finances in virtual buckets.

## Getting Started

1. Add all necessary environment variables (see list below)
2. `npm ci`
3. `npm run dev`
4. Go to http://localhost:3000

## Authentication
The `next-auth` package is used for authentication.
Currently Auth0 is the only supported authentication provider, but more providers can be added.

## Database
The backend is database-agnostic, meaning that any database can be added via an adapter.
Currently the only supported database is MongoDB, but more adapters can be added.

### Migrations
For MongoDB migrations this app is using [migrate-mongo](https://www.npmjs.com/package/migrate-mongo).

## Deployment
Being a Next.js app the deployment works best in Vercel, but the app can be deployed anywhere with the necessary configuration.

## Environment variables
To get full list of environment variables:
  - Check code for used env vars, OR
  - Contact repository owner for full list of environment variables.
