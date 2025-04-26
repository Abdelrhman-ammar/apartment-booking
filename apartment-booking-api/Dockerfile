FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl


# Copy dependencies
COPY package*.json ./

# Copy application code
COPY . .

# Add migration script
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use entrypoint script to run migrations before starting the app
ENTRYPOINT ["/docker-entrypoint.sh"]
