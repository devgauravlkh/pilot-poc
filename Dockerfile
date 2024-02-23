# Dockerfile for the backend application
# Use an existing Node.js image as the base
FROM node:18.3.0-alpine3.14

# Set the working directory in the image
WORKDIR /apps/poc-ai/src

# Copy the package.json and package-lock.json files to the image
COPY package*.json ./

# Set the PUPPETEER_SKIP_DOWNLOAD environment variable
ENV PUPPETEER_SKIP_DOWNLOAD true

# Install the application dependencies
RUN npm install

# Copy the rest of the application files to the image
COPY . .

# Build the Angular application
RUN npm run build:backend

# Expose port 3000 to allow incoming connections
EXPOSE 3000

# Start the Angular development server
CMD [ "node", "dist/apps/poc-ai/main.js" ]
