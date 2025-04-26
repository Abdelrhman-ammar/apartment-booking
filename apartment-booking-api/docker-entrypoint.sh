#!/bin/sh
set -e

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Seed the database
echo "Seeding the database..."
npm run prisma:seed

# Start the application
echo "Starting the application..."
exec npm run start
