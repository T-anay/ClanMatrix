package com.clanapp.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Resim yükle ve sonucu döndür.
     * @return Map with "url" and "public_id" keys
     */
    @SuppressWarnings("unchecked")
    public Map<String, String> upload(MultipartFile file, String folder) throws IOException {
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "resource_type", "image"
        );

        Map<Object, Object> result = cloudinary.uploader().upload(file.getBytes(), options);

        return Map.of(
                "url", (String) result.get("secure_url"),
                "public_id", (String) result.get("public_id")
        );
    }

    /**
     * Cloudinary'den resim sil.
     */
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
