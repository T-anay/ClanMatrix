package com.clanapp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageService {

    private final S3Client s3Client;

    @Value("${s3.bucket-name}")
    private String bucketName;

    @Value("${s3.public-url}")
    private String publicUrl;

    /**
     * Resim yükle ve sonucu döndür.
     * @return Map with "url" and "public_id" keys
     */
    public Map<String, String> upload(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        // Rastgele benzersiz bir isim (Cloudinary public_id mantığı)
        String fileName = UUID.randomUUID().toString() + extension;
        String objectKey = folder + "/" + fileName;

        byte[] imageBytes;
        
        // Sadece resim formatları için sıkıştırma yap (Genişlik max 1280px, Kalite %80)
        String contentType = file.getContentType();
        if (contentType != null && contentType.startsWith("image/")) {
            try (java.io.ByteArrayOutputStream os = new java.io.ByteArrayOutputStream()) {
                net.coobird.thumbnailator.Thumbnails.of(file.getInputStream())
                        .size(1280, 1280)
                        .outputQuality(0.8)
                        .toOutputStream(os);
                imageBytes = os.toByteArray();
            }
        } else {
            imageBytes = file.getBytes();
        }

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(imageBytes));

        String url = publicUrl + "/" + objectKey;

        return Map.of(
                "url", url,
                "public_id", objectKey
        );
    }

    /**
     * S3'ten (R2) resim sil.
     */
    public void delete(String publicId) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(publicId)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
            log.info("Resim S3'ten silindi: {}", publicId);
        } catch (Exception e) {
            log.error("Resim silinirken hata: {}", e.getMessage());
        }
    }
}
