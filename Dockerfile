FROM node

# Set dir
WORKDIR /app

# Copy in & install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy app
COPY . .

# Set non-root user
RUN chown -R node: /app
USER node

# TODO: switch this to prod
CMD [ "npm", "run", "serve" ]
