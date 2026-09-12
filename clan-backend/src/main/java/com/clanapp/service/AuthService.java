package com.clanapp.service;

import com.clanapp.dto.*;
import com.clanapp.model.User;
import com.clanapp.repository.UserRepository;
import com.clanapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequest request) {
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new IllegalArgumentException("auth.error.username_taken");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .approved(false)
                .build();

        userRepository.save(user);
        return "Kayıt başarılı. Yönetici onayı bekleniyor.";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("auth.error.invalid_credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("auth.error.invalid_credentials");
        }

        if (!user.isApproved()) {
            throw new IllegalStateException("auth.error.pending_approval");
        }

        if (user.getRole() != User.Role.ADMIN) {
            throw new IllegalStateException("auth.error.admin_only_login");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new LoginResponse(token, user.getUsername(), user.getRole().name());
    }
}
