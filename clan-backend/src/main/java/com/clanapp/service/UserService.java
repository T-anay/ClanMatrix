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
    private final StorageService storageService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.clanapp.security.JwtUtil jwtUtil;

    /** Admin tarafından şifre sıfırlama */
    @Transactional
    public void resetPasswordByAdmin(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı: " + userId));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /** Kullanıcının kendi şifresini değiştirmesi */
    @Transactional
    public void updatePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));
        if (user.getRole() == com.clanapp.model.User.Role.ADMIN) {
            throw new IllegalArgumentException("auth.error.admin_cannot_change");
        }
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("auth.error.incorrect_current_password");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /** Kullanıcının kendi kullanıcı adını değiştirmesi */
    @Transactional
    public com.clanapp.dto.UpdateUsernameResponse updateUsername(String currentUsername, String newUsername) {
        User user = userRepository.findByUsernameIgnoreCase(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("Kullanıcı bulunamadı."));
        if (user.getRole() == com.clanapp.model.User.Role.ADMIN) {
            throw new IllegalArgumentException("auth.error.admin_cannot_change");
        }

        if (!currentUsername.equalsIgnoreCase(newUsername) && userRepository.existsByUsernameIgnoreCase(newUsername)) {
            throw new IllegalArgumentException("auth.error.username_taken");
        }

        user.setUsername(newUsername);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new com.clanapp.dto.UpdateUsernameResponse(token, user.getUsername(), user.getRole().name());
    }

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
                    storageService.delete(submission.getCloudinaryPublicId());
                    log.info("Kullanıcı silindiği için resmi S3'ten silindi: {}", submission.getCloudinaryPublicId());
                } catch (Exception e) {
                    log.error("S3 resim silinirken hata oluştu (Kullanıcı Silinmesi): {}", e.getMessage());
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
