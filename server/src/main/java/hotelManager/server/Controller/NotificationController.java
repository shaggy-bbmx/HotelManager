package hotelManager.server.Controller;


import hotelManager.server.Dto.NotificationDto;
import hotelManager.server.Entity.Notification;
import hotelManager.server.Service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    @Autowired
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/create/notification")
    public ResponseEntity<?> createNotification(@RequestBody NotificationDto notificationDto, HttpServletRequest req) {
        try {
            Notification notification = notificationService.createNotification(notificationDto, req);
            return ResponseEntity.status(200).body(notification);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/notification/{employeeNo}/{department}")
    public ResponseEntity<?> getNotifications(@PathVariable("employeeNo") Long employeeNo,
                                              @PathVariable("department") String department,
                                              HttpServletRequest req) {
        try {
            List<Notification> allNotifications = notificationService.getNotifications(employeeNo, department, req);
            return ResponseEntity.status(200).body(allNotifications);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @PutMapping("/notification/update/{ticketId}/{employeeNo}")
    public ResponseEntity<?> updateNotification(@PathVariable("ticketId") Long ticketId,
                                                @PathVariable("employeeNo") Long employeeNo,
                                                HttpServletRequest req) {
        try {
            notificationService.updateNotification(ticketId, employeeNo, req);
            return ResponseEntity.status(200).body("success");
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
