package hotelManager.server.Repository;


import hotelManager.server.Entity.ResetPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResetPasswordRepo extends JpaRepository<ResetPassword,Long> {

    Optional<ResetPassword> findByEmail(String email);
}
