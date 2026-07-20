package com.clanapp.repository;

import com.clanapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByUsername(String username);
    boolean existsByUsernameIgnoreCase(String username);

    /** Onay bekleyen kullanıcılar */
    List<User> findByApprovedFalse();

    /** Onaylı normal üyeler (admin dahil değil) */
    List<User> findByApprovedTrueOrderByUsernameAsc();
}
