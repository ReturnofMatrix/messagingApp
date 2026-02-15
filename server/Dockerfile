FROM node:20-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files and .npmrc (if using)
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies with legacy peer deps flag
RUN npm install --production --legacy-peer-deps

# Generate Prisma client
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Run migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node index.js"]