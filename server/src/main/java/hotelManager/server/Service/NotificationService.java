package hotelManager.server.Service;

import hotelManager.server.Config.Utility.JwtTokenUtility;
import hotelManager.server.Dto.NotificationDto;
import hotelManager.server.Entity.Notification;
import hotelManager.server.Repository.NotificationRepo;
import hotelManager.server.Repository.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private final NotificationRepo notificationRepo;

    @Autowired
    private final JwtTokenUtility jwtTokenUtility;

    @Autowired
    private UserRepo userRepo;

    @Value("${cdn.apikey}")
    private String cdnApiKey;


    public NotificationService(NotificationRepo notificationRepo, JwtTokenUtility jwtTokenUtility) {
        this.notificationRepo = notificationRepo;
        this.jwtTokenUtility = jwtTokenUtility;
    }

    public Notification createNotification(NotificationDto notificationDto, HttpServletRequest req) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        Notification notification = new Notification();
        notification.setSenderEmployeeNo(notificationDto.getSenderEmployeeNo());
        notification.setSenderName(notificationDto.getSenderName());
        notification.setMessage(notificationDto.getMessage());
        notification.setTime(notificationDto.getTime());
        notification.setRoom(notificationDto.getRoom());
        notification.setReadBy(notificationDto.getReadBy());
        notification.setTicketId(notificationDto.getTicketId());
        notification.setDepartment(notificationDto.getDepartment());
        notification.setDescription(notificationDto.getDescription());
        notification.setRoomNo(notificationDto.getRoomNo());
        notification.setTitle(notificationDto.getTitle());
        notification.setStatus(notificationDto.getStatus());
        notification.setCreatedBy(notificationDto.getCreatedBy());
        notification.setCreatedAt(notificationDto.getCreatedAt());

        return notificationRepo.save(notification);
    }

    public List<Notification> getNotifications(Long employeeNo, String department, HttpServletRequest req) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        return notificationRepo.findAllNotification(employeeNo, department);

    }

    public void updateNotification(Long ticketId, Long employeeNo, HttpServletRequest req) throws Exception {
        //check if jwt token is valid or not
        String token = jwtTokenUtility.getTokenFromCookie(req);
        if (!jwtTokenUtility.validateToken(token)) {
            throw new Exception("please login again");
        }

        List<Notification> listOfNotification = notificationRepo.findAllByTicketId(ticketId);
        for (Notification notification : listOfNotification) {
            List<Long> readByList = notification.getReadBy();
            if (readByList == null) {
                readByList = new ArrayList<>(); // Initialize the list if it's null
                notification.setReadBy(readByList); // Set the initialized list back to the notification
            }
            if (!readByList.contains(employeeNo)) {
                readByList.add(employeeNo);
            }

            notificationRepo.save(notification);
        }

        return;
    }
}
