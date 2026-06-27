package com.clanapp.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class EventRequest {

    @NotBlank(message = "Etkinlik başlığı boş olamaz")
    @Size(max = 100, message = "Etkinlik başlığı maksimum 100 karakter olabilir")
    private String title;

    /** 0-9 arası renk index'i (opsiyonel, default 0) */
    @Min(value = 0, message = "Renk index'i 0-9 arasında olmalıdır")
    @Max(value = 9, message = "Renk index'i 0-9 arasında olmalıdır")
    private Integer colorKey = 0;
}
