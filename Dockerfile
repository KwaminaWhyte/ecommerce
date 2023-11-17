# Use an official Node.js image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the Remix.run application files to the container
COPY . .

# Expose the port your Remix.run app is running on (default is 3000)
EXPOSE 3000

# Start your Remix.run app
CMD ["npm", "run", "dev"]
