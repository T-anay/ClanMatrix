package com.clanapp.service;

import com.clanapp.dto.SubmissionResponse;
import com.clanapp.model.Event;
import com.clanapp.model.EventSubmission;
import com.clanapp.model.User;
import com.clanapp.repository.EventRepository;
import com.clanapp.repository.EventSubmissionRepository;
import com.clanapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final EventSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final CloudinaryService cloudinaryService;

    /** Tüm submission'ları matris formatında getir */
    public List<SubmissionResponse> getAllSubmissions() {
        return submissionRepository.findAllWithDetails()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Upsert mantığı:
     * - Kayıt yoksa: INSERT
     * - Kayıt varsa: eski resmi Cloudinary'den sil, yeni URL'yi UPDATE et
     */
    @Transactional
    public SubmissionResponse upsertSubmission(String username, Long eventId, MultipartFile file) throws IOException {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Etkinlik bulunamadı: " + eventId));

        // Cloudinary'ye yükle
        Map<String, String> uploadResult = cloudinaryService.upload(file, "clan-matrix/" + eventId);
        String newUrl = uploadResult.get("url");
        String newPublicId = uploadResult.get("public_id");

        Optional<EventSubmission> existing = submissionRepository.findByUserIdAndEventId(user.getId(), eventId);

        EventSubmission submission;
        if (existing.isPresent()) {
            // Normal kullanıcıların kendi resimlerini değiştirmesini engelle
            if (user.getRole() != User.Role.ADMIN) {
                throw new IllegalStateException("Bu etkinlik için zaten bir resim yüklediniz. Yalnızca bir yönetici silebilir.");
            }
            
            // Güncelleme: eski resmi sil
            submission = existing.get();
            try {
                cloudinaryService.delete(submission.getCloudinaryPublicId());
            } catch (IOException e) {
                // Silme başarısız olsa da devam et, yeni resim kaydedilsin
            }
            submission.setImageUrl(newUrl);
            submission.setCloudinaryPublicId(newPublicId);
        } else {
            // İlk yükleme
            submission = EventSubmission.builder()
                    .user(user)
                    .event(event)
                    .imageUrl(newUrl)
                    .cloudinaryPublicId(newPublicId)
                    .build();
        }

        return toResponse(submissionRepository.save(submission));
    }

    /** Etkinlik resmini sil (Yalnızca Admin tarafından çağrılır) */
    @Transactional
    public void deleteSubmission(Long submissionId) {
        EventSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Kayıt bulunamadı."));

        if (submission.getCloudinaryPublicId() != null) {
            try {
                cloudinaryService.delete(submission.getCloudinaryPublicId());
            } catch (IOException e) {
                System.err.println("Cloudinary silme hatası: " + e.getMessage());
            }
        }
        
        submissionRepository.delete(submission);
    }

    private SubmissionResponse toResponse(EventSubmission s) {
        return new SubmissionResponse(
                s.getId(),
                s.getUser().getId(),
                s.getUser().getUsername(),
                s.getEvent().getId(),
                s.getEvent().getTitle(),
                s.getImageUrl(),
                s.getCloudinaryPublicId()
        );
    }
}
