# Build Stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Install dos2unix to fix Windows line endings
RUN apk add --no-cache dos2unix

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Fix line endings and make mvnw executable
RUN dos2unix mvnw && chmod +x mvnw

RUN ./mvnw dependency:go-offline  

COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
