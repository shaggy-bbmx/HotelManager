package hotelManager.server.Dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateNotificationDto {
    private Long ticketId;

    private Long employeeNo;

    private String department;
}
