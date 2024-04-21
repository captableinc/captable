
# SET NODE_VERSION from build context
ARG NODE_VERSION
FROM node:${NODE_VERSION}-slim as base

# Set working directory in container
WORKDIR /app

ENV SKIP_ENV_VALIDATION=true

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY --link prisma/enum-generator.cjs ./prisma/enum-generator.cjs
COPY --link prisma ./
RUN npx prisma generate

# Copy application code
COPY --link prisma/enums.ts ./prisma/enums.ts
COPY --link . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Shellscript to run at container startup
COPY scripts/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ./entrypoint.sh

#Exposed ports
EXPOSE 3000 5555