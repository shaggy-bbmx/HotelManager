FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests -X

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/server-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 4000
EXPOSE 5000
ENTRYPOINT ["java", "-jar", "app.jar"]