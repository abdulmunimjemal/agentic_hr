# Use Node.js 18 on Alpine
FROM node:18-alpine

# Create app directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Build NestJS (compiles TypeScript to dist/)
RUN npm run build

# Expose port 3000 in the container
EXPOSE 3000

# Start Nest in production mode
CMD ["npm", "run", "start:prod"]
