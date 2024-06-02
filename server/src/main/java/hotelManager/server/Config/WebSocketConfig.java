package hotelManager.server.Config;


import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketConfig {

    @Value("${socket.port}")
    private String socketPort;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
         config.setHostname("0.0.0.0");

        config.setPort(Integer.parseInt(socketPort));

        //For Dev mode choose ==1))
        //config.setOrigin("http://localhost:4000");
        config.setOrigin("https://hotelmanager-q6bz.onrender.com");
        return new SocketIOServer(config);
    }

}
