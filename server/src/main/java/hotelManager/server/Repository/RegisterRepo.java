package hotelManager.server.Repository;


import hotelManager.server.Entity.Register;
import hotelManager.server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegisterRepo extends JpaRepository<Register, Long> {
    Optional<Register> findByEmail(String email);
}
