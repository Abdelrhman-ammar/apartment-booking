#!/bin/sh
set -e

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding the database..."
npm run prisma:seed

# Start the application
echo "Starting the application..."
exec npm run start
