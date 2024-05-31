package hotelManager.server.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "User")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Employee No. has to be provided")
    private Long employeeNo;

    @NotBlank(message = "Name has to be provided")
    private String name;

    @NotBlank(message = "email has to be provided")
    private String email;

    @NotBlank(message = "password has to be mentioned")
    private String password;

    @Pattern(regexp = "^(User|Technician)$", message = "role must be either 'user' or 'technician'")
    private String role;

    @Pattern(regexp = "^$|Electrical|Civil|House Keeping", message = "Department can be electrical,civil,house keeping")
    private String department;

    @NotBlank(message = "profile pic has to be mentioned")
    private String profilePic;
}
