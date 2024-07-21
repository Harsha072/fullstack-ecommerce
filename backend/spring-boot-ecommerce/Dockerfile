# Use the official OpenJDK 11 image from the Docker Hub
FROM openjdk:11-jre-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the target directory to the working directory in the container
COPY target/*.jar spring-boot-ecommerce.jar

# Expose the port that your application runs on (default is usually 8080 for Spring Boot)
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "spring-boot-ecommerce.jar"]