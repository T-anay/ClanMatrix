package com.clanapp.service;

import com.clanapp.dto.LoginRequest;
import com.clanapp.dto.LoginResponse;
import com.clanapp.dto.RegisterRequest;
import com.clanapp.model.User;
import com.clanapp.repository.UserRepository;
import com.clanapp.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User approvedUser;
    private User pendingUser;

    @BeforeEach
    void setUp() {
        approvedUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("hashedPassword")
                .role(User.Role.USER)
                .approved(true)
                .build();

        pendingUser = User.builder()
                .id(2L)
                .username("pending")
                .password("hashedPassword")
                .role(User.Role.USER)
                .approved(false)
                .build();
    }

    @Test
    void register_shouldSaveUserWithApprovedFalse() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("password123");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        String result = authService.register(request);

        assertTrue(result.contains("onay"));
        verify(userRepository).save(argThat(u -> !u.isApproved()));
    }

    @Test
    void register_shouldThrowException_whenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setPassword("password");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
    }

    @Test
    void login_shouldReturnToken_whenApprovedUser() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("rawPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(approvedUser));
        when(passwordEncoder.matches("rawPassword", "hashedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("testuser", "USER")).thenReturn("jwt-token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("USER", response.getRole());
    }

    @Test
    void login_shouldThrowIllegalState_whenUserNotApproved() {
        LoginRequest request = new LoginRequest();
        request.setUsername("pending");
        request.setPassword("rawPassword");

        when(userRepository.findByUsername("pending")).thenReturn(Optional.of(pendingUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> authService.login(request));
    }

    @Test
    void login_shouldThrowException_whenWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(approvedUser));
        when(passwordEncoder.matches("wrongPassword", "hashedPassword")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }
}
