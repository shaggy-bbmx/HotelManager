package hotelManager.server.Repository;


import hotelManager.server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmployeeNo(Long employeeNo);

    @Query("SELECT e FROM User e WHERE CAST(e.employeeNo AS string) LIKE :pattern")
    List<User> getEmployeeSuggestions(@Param("pattern") String pattern);
}
