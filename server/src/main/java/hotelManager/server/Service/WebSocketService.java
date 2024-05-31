package hotelManager.server.Service;


import com.corundumstudio.socketio.SocketIOServer;
import hotelManager.server.Dto.NotificationDto;
import hotelManager.server.Dto.UpdateNotificationDto;
import hotelManager.server.Entity.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService implements CommandLineRunner {
    private final SocketIOServer server;


    @Autowired
    public WebSocketService(SocketIOServer server) {
        this.server = server;
    }

    @Override
    public void run(String... args) throws Exception {
        // Add connect listener
        server.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());
        });

        // Add disconnect listener
        server.addDisconnectListener(client -> {
            System.out.println("Client disconnected: " + client.getSessionId());
        });


        // Add custom event listener for "joinRoom"
        server.addEventListener("joinRoom", String.class, (client, room, ackSender) -> {
            client.joinRoom(room);
            client.sendEvent("roomJoined", room);
            System.out.println("Client joined room: " + room);
        });


        // Add custom event listener for "joinRoom"
        server.addEventListener("sendNotification", Notification.class, (client, data, ackSender) -> {
            server.getRoomOperations(data.getRoom().get(0)).sendEvent("getNotification", data);
            server.getRoomOperations(data.getRoom().get(1)).sendEvent("getNotification", data);

            server.getRoomOperations(data.getRoom().get(0)).sendEvent("getNewTicket", data);
            server.getRoomOperations(data.getRoom().get(1)).sendEvent("getNewTicket", data);

        });

        server.addEventListener("updateNotification", UpdateNotificationDto.class, (client, data, ackSender) -> {
            server.getRoomOperations(data.getDepartment()).sendEvent("markAsRead", data);
            server.getRoomOperations("User").sendEvent("markAsRead", data);
        });


        server.start();
        System.out.println("Socket.IO server started at port: " + server.getConfiguration().getPort());

        // Add shutdown hook to stop the server gracefully
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Stopping Socket.IO server...");
            server.stop();
        }));
    }
}
