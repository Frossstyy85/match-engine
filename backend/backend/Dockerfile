FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

COPY src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app

COPY --from=build /app/target/app.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]
