# Stage 1: Serve the Angular application with nginx
FROM nginx:alpine

# Copy the built Angular files to the nginx HTML directory
COPY dist/* /usr/share/nginx/html/

# Copy your custom nginx configuration, if any
COPY nginx-config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]