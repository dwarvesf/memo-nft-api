# Build stage
FROM node:22-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Pre-install the Discord webhook package globally to avoid issues at runtime
RUN npm install -g @lmquang/mcp-discord-webhook@latest

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create directory for PGLite database
RUN mkdir -p /app/.ponder/pglite

# Expose the port the app runs on
EXPOSE 3000

# Start the application with environment-specific schema and port
CMD ["pnpm", "start", "--schema", "memo_nft_PROD", "--port", "3000"]
