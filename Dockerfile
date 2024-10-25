# Node.js Server
FROM node:18

# Directory
WORKDIR /src/app

# Copy package.json, package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 8080

# Start server
CMD ["npm", "run", "dev"]