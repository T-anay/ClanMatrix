package com.clanapp.repository;

import com.clanapp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /** Mevcut etkinlik sayısı (10 limit kontrolü için) */
    long count();
}
