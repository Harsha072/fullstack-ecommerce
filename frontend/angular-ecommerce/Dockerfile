# Stage 1: Build Angular application
FROM node:latest as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files and folders to the working directory
COPY . .

# Build the Angular app (replace 'your-app-name' with your actual Angular app name)
RUN npm run build -- --output-path=./dist/angular-ecommerce

# Stage 2: Serve the Angular application using nginx
FROM nginx:alpine

# Copy the built app from Stage 1 into the nginx web server's public directory
COPY --from=build /app/dist/angular-ecommerce /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# CMD to run nginx server
CMD ["nginx", "-g", "daemon off;"]