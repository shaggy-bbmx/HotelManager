package hotelManager.server;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class ServerApplication {

    public static void main(String[] args) {
        System.out.println("Welcome the Backend");
        SpringApplication.run(ServerApplication.class, args);
    }

}
