FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl


# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Add migration script
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use entrypoint script to run migrations before starting the app
ENTRYPOINT ["/docker-entrypoint.sh"]
