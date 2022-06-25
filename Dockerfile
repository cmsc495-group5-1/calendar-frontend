FROM node

# Set dir
WORKDIR /app

# Copy in & install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install && npm install -g http-server

# Copy app
COPY . .

RUN npm run build

# Set non-root user
USER node

CMD [ "http-server", "dist", "-d", "false" ]
