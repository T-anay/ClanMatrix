package com.clanapp.repository;

import com.clanapp.model.EventSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventSubmissionRepository extends JpaRepository<EventSubmission, Long> {

    /** Belirli user+event kombinasyonu var mı? (UNIQUE kısıtı için upsert mantığı) */
    Optional<EventSubmission> findByUserIdAndEventId(Long userId, Long eventId);

    /** Matris için tüm submission'lar */
    @Query("SELECT s FROM EventSubmission s JOIN FETCH s.user JOIN FETCH s.event")
    List<EventSubmission> findAllWithDetails();

    /** Etkinliğe ait submission'lar (cascade kontrolü için) */
    List<EventSubmission> findByEventId(Long eventId);
}
