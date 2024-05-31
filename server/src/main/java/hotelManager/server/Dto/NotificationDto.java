package hotelManager.server.Dto;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationDto {


    private Long senderEmployeeNo;

    private String senderName;

    private String message;

    private String time;

    private List<String> room;

    private List<Long> readBy;

    private Long ticketId;

    private String department;

    private String description;

    private Long roomNo;

    private String title;

    private String status;

    private Long createdBy;

    private String createdAt;

}
