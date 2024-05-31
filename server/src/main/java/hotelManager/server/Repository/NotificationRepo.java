package hotelManager.server.Repository;

import hotelManager.server.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n " +
            "WHERE n.senderEmployeeNo != :employeeNo " +
            "AND :department MEMBER OF n.room " +
            "AND :employeeNo NOT MEMBER OF n.readBy")
    List<Notification> findAllNotification(@Param("employeeNo") Long employeeNo, @Param("department") String department);


    List<Notification> findAllByTicketId(Long ticketId);
}
