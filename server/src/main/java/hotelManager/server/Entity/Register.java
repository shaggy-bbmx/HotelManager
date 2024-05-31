package hotelManager.server.Entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Register")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Register {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "please mention email")
    private String email;

    @Pattern(regexp = "^(User|Technician)$", message = "role must be either 'user' or 'technician'")
    private String role;

    @NotBlank(message = "token has to be mentioned")
    private String token;

    @NotBlank(message = "token expiration date has to be mentioned")
    private String expirationDate;
}
