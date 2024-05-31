package hotelManager.server.Dto;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TicketDto {

    private String department;

    private String description;

    private Long roomNo;

    private String title;

    private String status;

    private Long createdBy;

    private String createdAt;

    private Long initiatedBy;

    private String initiatedAt;

    private Long resolvedBy;

    private String resolvedAt;

    private Long closedBy;

    private String closedAt;

}
