# Hotel Maintenance Monitoring System

## Overview
This is a full-stack application designed to monitor maintenance-related activities within a hotel. The frontend is built using React, while the backend is developed using the Spring Boot framework. Notably, live notifications for any changes in the status of tickets or jobs are implemented using socket programming.

## How to Run the Project
To run this project, follow these steps:

1. **Download Project**: Download the project as a ZIP file.

2. **Setup Frontend**:
   - Navigate to the `client` directory.
   - Install dependencies using npm:
     ```sh
     npm install
     ```
   - Start the frontend server:
     ```sh
     npm start
     ```
   The frontend will start on port 3000.

3. **Configure Frontend for Socket Connection**:
   In the `userAccount.js` file, make sure to add:
   ```javascript
   const newSocket = io('http://localhost:5000');
   
4.**Setup Backend:**:
In the main/resources directory, add a file named application.properties.
Add the following configurations to application.properties:

server.port=4000
spring.devtools.restart.enabled=true
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.mail.username=
spring.mail.properties.mail.smtp.starttls.required=
spring.mail.host=smtp.gmail.com
spring.mail.port=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=
spring.mail.properties.mail.transport.protocol=
spring.mail.properties.mail.smtp.starttls.enable=
jwt.secret=
cdn.apikey=
socket.port=5000


5.**Configure WebSocket**:
In the WebSocketConfig.java file, add the following line:
config.setHostname("localhost");
