# Pull Docker Hub base image
FROM node:14.16.0-alpine3.10
# Set working directory
WORKDIR /usr/app
# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
# RUN npm install -g yarn
RUN yarn
# Copy app to container
COPY . .
# Run the "dev" script in package.json
CMD ["yarn", "dev"]
