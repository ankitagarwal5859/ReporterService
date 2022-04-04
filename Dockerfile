# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:14-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# install typescript
# RUN npm install -g typescript

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./
COPY tsconfig*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
RUN npm ci --only=production
# RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

# Set environment variable
# ENV AUDIOBOOK_SERVICE_PORT=8080

# Run the web service on container startup.
RUN npm run build
CMD [ "node", "./build/src/Server.js" ]