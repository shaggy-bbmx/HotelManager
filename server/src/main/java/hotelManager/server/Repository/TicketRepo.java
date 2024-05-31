package hotelManager.server.Repository;

import hotelManager.server.Entity.Ticket;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
public interface TicketRepo extends JpaRepository<Ticket, Long> {
    @Query("SELECT t FROM Ticket t WHERE " +
            " t.status IN :status " +
            " AND " +
            " t.department IN :department " +
            " AND " +
            " (t.createdAt BETWEEN :startDate1 AND :endDate1) " +
            " AND " +
            " (CAST(t.createdBy AS string) LIKE :createdByPattern) " +
            " AND " +
            " (t.initiatedAt IS NULL OR t.initiatedAt BETWEEN :startDate2 AND :endDate2) " +
            " AND " +
            " (t.initiatedBy IS NULL OR CAST(t.initiatedBy AS string) LIKE :initiatedByPattern) " +
            " AND " +
            " (t.resolvedAt IS NULL OR t.resolvedAt BETWEEN :startDate3 AND :endDate3) " +
            " AND " +
            " (t.resolvedBy IS NULL OR CAST(t.resolvedBy AS string) LIKE :resolvedByPattern) " +
            " AND " +
            " (t.closedAt IS NULL OR t.closedAt BETWEEN :startDate4 AND :endDate4) " +
            " AND " +
            " (t.closedBy IS NULL OR CAST(t.closedBy AS string) LIKE :closedByPattern)" +
            " ORDER BY t.createdAt DESC"
    )
    ArrayList<Ticket> findByAllFilters(
            @Param("status") List<String> status,
            @Param("department") List<String> department,
            @Param("startDate1") String startDate1,
            @Param("endDate1") String endDate1,
            @Param("createdByPattern") String createdByPattern,
            @Param("startDate2") String startDate2,
            @Param("endDate2") String endDate2,
            @Param("initiatedByPattern") String initiatedByPattern,
            @Param("startDate3") String startDate3,
            @Param("endDate3") String endDate3,
            @Param("resolvedByPattern") String resolvedByPattern,
            @Param("startDate4") String startDate4,
            @Param("endDate4") String endDate4,
            @Param("closedByPattern") String closedByPattern,
            Pageable pageable
    );



    @Query("SELECT COUNT(t) FROM Ticket t WHERE " +
            " t.status IN :status " +
            " AND " +
            " t.department IN :department " +
            " AND " +
            " (t.createdAt BETWEEN :startDate1 AND :endDate1) " +
            " AND " +
            " (CAST(t.createdBy AS string) LIKE :createdByPattern) " +
            " AND " +
            " (t.initiatedAt IS NULL OR t.initiatedAt BETWEEN :startDate2 AND :endDate2) " +
            " AND " +
            " (t.initiatedBy IS NULL OR CAST(t.initiatedBy AS string) LIKE :initiatedByPattern) " +
            " AND " +
            " (t.resolvedAt IS NULL OR t.resolvedAt BETWEEN :startDate3 AND :endDate3) " +
            " AND " +
            " (t.resolvedBy IS NULL OR CAST(t.resolvedBy AS string) LIKE :resolvedByPattern) " +
            " AND " +
            " (t.closedAt IS NULL OR t.closedAt BETWEEN :startDate4 AND :endDate4) " +
            " AND " +
            " (t.closedBy IS NULL OR CAST(t.closedBy AS string) LIKE :closedByPattern)"
    )
    int findByAllFiltersCount(
            @Param("status") List<String> status,
            @Param("department") List<String> department,
            @Param("startDate1") String startDate1,
            @Param("endDate1") String endDate1,
            @Param("createdByPattern") String createdByPattern,
            @Param("startDate2") String startDate2,
            @Param("endDate2") String endDate2,
            @Param("initiatedByPattern") String initiatedByPattern,
            @Param("startDate3") String startDate3,
            @Param("endDate3") String endDate3,
            @Param("resolvedByPattern") String resolvedByPattern,
            @Param("startDate4") String startDate4,
            @Param("endDate4") String endDate4,
            @Param("closedByPattern") String closedByPattern
    );


}