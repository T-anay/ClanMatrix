package com.clanapp.service;

import com.clanapp.dto.UserResponse;
import com.clanapp.model.User;
import com.clanapp.model.EventSubmission;
import com.clanapp.repository.EventSubmissionRepository;
import com.clanapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final EventSubmissionRepository submissionRepository;
    private final CloudinaryService cloudinaryService;

    /** Onay bekleyen kullanıcı listesi */
    public List<UserResponse> getPendingUsers() {
        return userRepository.findByApprovedFalse()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Tüm onaylı kullanıcılar (admin hariç) */
    public List<UserResponse> getAllApprovedUsers() {
        return userRepository.findByApprovedTrueOrderByUsernameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /** Kullanıcıyı onayla */
    @Transactional
    public UserResponse approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı: " + userId));
        user.setApproved(true);
        return toResponse(userRepository.save(user));
    }

    /** Kullanıcıyı sil (reddet veya sistemden çıkar) */
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("Kullanıcı bulunamadı: " + userId);
        }

        // 1. Önce bu kullanıcının yüklediği tüm resimleri Cloudinary'den sil
        List<EventSubmission> userSubmissions = submissionRepository.findByUserId(userId);
        for (EventSubmission submission : userSubmissions) {
            if (submission.getCloudinaryPublicId() != null) {
                try {
                    cloudinaryService.delete(submission.getCloudinaryPublicId());
                    log.info("Kullanıcı silindiği için resmi Cloudinary'den silindi: {}", submission.getCloudinaryPublicId());
                } catch (Exception e) {
                    log.error("Cloudinary resim silinirken hata oluştu (Kullanıcı Silinmesi): {}", e.getMessage());
                }
            }
        }

        // 2. Veritabanındaki katılım kayıtlarını sil
        submissionRepository.deleteAll(userSubmissions);

        // 3. En son kullanıcıyı sil
        userRepository.deleteById(userId);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole().name(),
                user.isApproved()
        );
    }
}
