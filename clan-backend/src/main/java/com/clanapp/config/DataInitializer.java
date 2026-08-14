package com.clanapp.config;

import com.clanapp.model.Event;
import com.clanapp.model.EventSubmission;
import com.clanapp.model.User;
import com.clanapp.repository.EventRepository;
import com.clanapp.repository.EventSubmissionRepository;
import com.clanapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventSubmissionRepository submissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.password:Admin1234!}")
    private String adminPassword;

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = User.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(User.Role.ADMIN)
                    .approved(true)
                    .build();
            userRepository.save(admin);
            log.info("✅ Admin hesabı oluşturuldu: {}", adminUsername);
            
            // Generate mock data if dev profile is active
            if ("dev".equals(activeProfile)) {
                log.info("ℹ️ Dev profili aktif, 100 sahte kullanıcı ve etkinlik verileri oluşturuluyor...");
                generateMockData();
            }
        } else {
            log.info("ℹ️  Admin hesabı zaten mevcut: {}", adminUsername);
        }
    }
    
    private void generateMockData() {
        Random random = new Random();
        List<User> users = new ArrayList<>();
        
        // Generate test user
        User talha = User.builder()
                .username("talha")
                .password(passwordEncoder.encode("talha123"))
                .role(User.Role.USER)
                .approved(true)
                .build();
        userRepository.save(talha);
        users.add(talha);
        log.info("✅ Test kullanıcısı oluşturuldu: username=talha password=talha123");

        // Generate 100 fake users
        for (int i = 1; i <= 100; i++) {
            User user = User.builder()
                    .username("Kullanici_" + i + "_" + random.nextInt(1000))
                    .password(passwordEncoder.encode("pass123"))
                    .role(User.Role.USER)
                    .approved(true)
                    .build();
            userRepository.save(user);
            users.add(user);
        }
        
        // Create 3 Events
        Event event1 = Event.builder()
                .title("Ağustos 2026 Etkinliği")
                .colorKey(0)
                .startDate(LocalDate.now().minusDays(10))
                .endDate(LocalDate.now().plusDays(20))
                .sortOrder(1)
                .build();
                
        Event event2 = Event.builder()
                .title("Eylül Matrixi")
                .colorKey(1)
                .startDate(LocalDate.now().plusDays(21))
                .endDate(LocalDate.now().plusDays(50))
                .sortOrder(2)
                .build();
                
        Event event3 = Event.builder()
                .title("Ekim Final")
                .colorKey(2)
                .startDate(LocalDate.now().plusDays(51))
                .endDate(LocalDate.now().plusDays(80))
                .sortOrder(3)
                .build();
                
        eventRepository.saveAll(List.of(event1, event2, event3));
        
        // Randomly add submissions
        for (User u : users) {
            if (random.nextDouble() < 0.7) {
                EventSubmission sub1 = EventSubmission.builder()
                        .user(u)
                        .event(event1)
                        .cloudinaryPublicId(UUID.randomUUID().toString() + ".jpg")
                        .imageUrl("https://picsum.photos/seed/" + UUID.randomUUID().toString() + "/200")
                        .build();
                submissionRepository.save(sub1);
            }
            if (random.nextDouble() < 0.4) {
                EventSubmission sub2 = EventSubmission.builder()
                        .user(u)
                        .event(event2)
                        .cloudinaryPublicId(UUID.randomUUID().toString() + ".png")
                        .imageUrl("https://picsum.photos/seed/" + UUID.randomUUID().toString() + "/200")
                        .build();
                submissionRepository.save(sub2);
            }
            if (random.nextDouble() < 0.2) {
                EventSubmission sub3 = EventSubmission.builder()
                        .user(u)
                        .event(event3)
                        .cloudinaryPublicId(UUID.randomUUID().toString() + ".jpg")
                        .imageUrl("https://picsum.photos/seed/" + UUID.randomUUID().toString() + "/200")
                        .build();
                submissionRepository.save(sub3);
            }
        }
        log.info("✅ Sahte veri (Mock Data) oluşturma tamamlandı! 100 kullanıcı ve yüzlerce katılım eklendi.");
    }
}
