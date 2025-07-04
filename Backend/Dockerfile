FROM node:20

# Install OpenSSL and required CA certificates
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set environment variable to enable legacy OpenSSL provider
ENV NODE_OPTIONS="--openssl-legacy-provider"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY --chown=app:app . .

EXPOSE 3000

CMD [ "node", "backend.js" ]
