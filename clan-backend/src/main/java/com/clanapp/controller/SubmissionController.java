package com.clanapp.controller;

import com.clanapp.dto.SubmissionResponse;
import com.clanapp.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    /** Tüm matris verisini getir */
    @GetMapping
    public ResponseEntity<List<SubmissionResponse>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    /**
     * Resim yükle veya güncelle (upsert).
     * Kullanıcı sadece kendi satırına yükleyebilir — servis katmanında kontrol edilir.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SubmissionResponse> uploadSubmission(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("eventId") Long eventId,
            @RequestParam("file") MultipartFile file) throws IOException {

        SubmissionResponse response = submissionService.upsertSubmission(
                userDetails.getUsername(), eventId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
