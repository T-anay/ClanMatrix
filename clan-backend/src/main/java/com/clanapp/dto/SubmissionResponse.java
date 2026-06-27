package com.clanapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long eventId;
    private String eventTitle;
    private String imageUrl;
    private String cloudinaryPublicId;
}
