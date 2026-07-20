package com.clanapp.controller;

import com.clanapp.dto.UserResponse;
import com.clanapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Tüm onaylı üyeler — USER ve ADMIN görebilir.
     * (Matris sayfası tüm kullanıcılar için bu listeye ihtiyaç duyuyor)
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllApprovedUsers());
    }

    /** Onay bekleyen üyeler — Yalnızca ADMIN */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    /** Kullanıcıyı onayla — Yalnızca ADMIN */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.approveUser(id));
    }

    /** Kullanıcıyı sil / reddet — Yalnızca ADMIN */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /** Kullanıcının şifresini sıfırla — Yalnızca ADMIN */
    @PutMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> resetPasswordByAdmin(
            @PathVariable Long id,
            @jakarta.validation.Valid @RequestBody com.clanapp.dto.ResetPasswordRequest request) {
        userService.resetPasswordByAdmin(id, request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    /** Kendi şifresini güncelle — USER ve ADMIN */
    @PutMapping("/profile/password")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> updatePassword(
            java.security.Principal principal,
            @jakarta.validation.Valid @RequestBody com.clanapp.dto.UpdatePasswordRequest request) {
        userService.updatePassword(principal.getName(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    /** Kendi kullanıcı adını güncelle — USER ve ADMIN */
    @PutMapping("/profile/username")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<com.clanapp.dto.UpdateUsernameResponse> updateUsername(
            java.security.Principal principal,
            @jakarta.validation.Valid @RequestBody com.clanapp.dto.UpdateUsernameRequest request) {
        com.clanapp.dto.UpdateUsernameResponse response = userService.updateUsername(principal.getName(), request.getNewUsername());
        return ResponseEntity.ok(response);
    }
}
