# Hotel Maintenance Monitoring System

## Overview
This is a full-stack application designed to monitor maintenance-related activities within a hotel. The frontend is built using React, while the backend is developed using the Spring Boot framework. Notably, live notifications for any changes in the status of tickets or jobs are implemented using socket programming.


## How to Run the Application


To run this project, follow options:
1. Clone the Repository
git clone https://github.com/<GITHUB_USERNAME>/hotelmanager.git
cd hotelmanager

2. Add application.properties File
server.port=4000
spring.devtools.restart.enabled=true
spring.datasource.url=your aws rds url
spring.datasource.username=your
spring.datasource.password=your
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.mail.username=your
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.host=smtp.gmail.com
spring.mail.port=your
spring.mail.password=your
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.transport.protocol=smtp
spring.mail.properties.mail.smtp.starttls.enable=true
jwt.secret=your
cdn.apikey=your 
socket.port=5000

3. Run the Application
you can run it many ways-----

3.1 Run the Spring Application Main Class
Start the Spring Boot application by running the main class in your IDE or command line.

3.2 Execute the JAR File
built the JAR file 
mvn package 
you can run it with the following command:
java -jar target/server-0.0.1-SNAPSHOT.jar


3.3 Run via Docker
First, build the Docker image using the following command:
docker build -t shaggy-bbmx/hotelmanager .

Then, Run the Docker Container
docker run -d \
  -p 4000:4000 \
  -p 5000:5000 \
  -e "SERVER_PORT=4000" \
  -e "SPRING_DATASOURCE_URL=jdbc:mysql://<your>-/hotelManager" \
  -e "SPRING_DATASOURCE_USERNAME=<USERNAME>" \
  -e "SPRING_DATASOURCE_PASSWORD=<PASSWORD>" \
  -e "SPRING_DATASOURCE_DRIVER_CLASS_NAME=com.mysql.cj.jdbc.Driver" \
  -e "SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.MySQLDialect" \
  -e "SPRING_JPA_HIBERNATE_DDL_AUTO=update" \
  -e "SPRING_JPA_SHOW_SQL=true" \
  -e "SPRING_MAIL_USERNAME=<EMAIL>" \
  -e "SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_REQUIRED=true" \
  -e "SPRING_MAIL_HOST=smtp.gmail.com" \
  -e "SPRING_MAIL_PORT=587" \
  -e "SPRING_MAIL_PASSWORD=<PASSWORD>" \
  -e "SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true" \
  -e "SPRING_MAIL_PROPERTIES_MAIL_TRANSPORT_PROTOCOL=smtp" \
  -e "SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true" \
  -e "JWT_SECRET=<YOUR_SECRET>" \
  -e "CDN_APIKEY=<YOUR_KEY>" \
  -e "SOCKET_PORT=5000" \
  <GITHUB_USERNAME>/hotelmanager



## Making Changes and Pushing to GitHub
Navigate to the client directory and build the client:
npm run build

Navigate to the server directory and package the server:
mvn package

Add changes to git, commit, and push:
git add .
git commit -m "Your commit message"
git push




 