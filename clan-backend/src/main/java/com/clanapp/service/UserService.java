package com.clanapp.service;

import com.clanapp.dto.UserResponse;
import com.clanapp.model.User;
import com.clanapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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
