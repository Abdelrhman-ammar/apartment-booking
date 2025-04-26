#!/bin/sh
set -e

# Install dependencies
npm install

# Build the application
npm run build

# Start the application
echo "Starting the Next.js application..."
exec npm run start
