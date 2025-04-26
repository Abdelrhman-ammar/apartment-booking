FROM node:22-alpine

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Copy application code
COPY . .

# Add entrypoint script
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Use entrypoint script to start the app
ENTRYPOINT ["/docker-entrypoint.sh"]