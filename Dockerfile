# Use a lightweight Bun image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY bun.lockb package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the project files
COPY . .

# Expose port (adjust based on your app)
EXPOSE 5001

# Start the application
CMD ["bun", "run", "dev"]
