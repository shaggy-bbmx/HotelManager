package hotelManager.server.Entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.groups.Default;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Ticket")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Pattern(regexp = "^$|Electrical|Civil|House Keeping", message = "Department can be electrical,civil,house keeping")
    private String department;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Long roomNo;

    @NotBlank
    @Pattern(regexp = "^$|OP|UP|RC|CL", message = "status has to be mentioned")
    private String status;

    @NotNull
    private Long createdBy;

    @NotBlank
    private String createdAt;


    private Long initiatedBy;

    private String initiatedAt;

    private Long resolvedBy;

    private String resolvedAt;

    private Long closedBy;

    private String closedAt;

    @ElementCollection
    @CollectionTable(name = "ticket_pictures", joinColumns = @JoinColumn(name = "ticket_id"))
    @Column(name = "picture")
    private List<String> pictures = new ArrayList<>();

}
