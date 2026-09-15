FROM node:20-alpine

WORKDIR /app

# Copy package files first for better Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "src/server.js"]
