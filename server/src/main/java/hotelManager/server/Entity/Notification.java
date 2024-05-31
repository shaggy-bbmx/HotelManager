package hotelManager.server.Entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "Notification")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "mention the employeeNo of sender")
    private Long senderEmployeeNo;

    @NotBlank(message = "mention the sender name")
    private String senderName;

    @NotBlank(message = "message should not be empty")
    private String message;

    @NotBlank(message = "time should be mentioned")
    private String time;

    @ElementCollection
    private List<String> room;

    @ElementCollection
    private List<Long> readBy;

    @NotNull(message = "ticket id should be mentioned")
    private Long ticketId;

    @NotBlank(message = "department should be mentioned")
    private String department;

    @NotBlank(message = "description should be mentioned")
    private String description;

    @NotNull(message = "validation error")
    private Long roomNo;

    @NotBlank(message = "validation error")
    private String title;

    @NotBlank(message = "validation error")
    private String status;

    @NotNull(message = "validation error")
    private Long createdBy;

    @NotBlank(message = "validation error")
    private String createdAt;

}
