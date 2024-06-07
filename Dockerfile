# Use an official Node.js runtime as a parent image
FROM node:20.14.0-alpine3.20 as appbase

WORKDIR /app

# Copy the app to the container
COPY package.json tsconfig.base.json nx.json ./
COPY ./packages ./packages
COPY ./server ./server
COPY ./apps ./apps

# Install app dependencies
RUN npm install

# Build the app
FROM appbase as appbuilder

COPY app-resources.json ./

RUN mkdir dist
RUN npm run build:online
RUN npm run build:server

# Expose the port the app listens on
EXPOSE 80

# Set the build argument for the app version number
ARG APP_VERSION=0.1.0

# Set the environment variable for the app version number
ENV APP_VERSION=$APP_VERSION
