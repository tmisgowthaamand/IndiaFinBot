# Use official lightweight Node.js image
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose port (must match Render's expectations or your env variables)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
