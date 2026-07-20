package com.clanapp.service;

import com.clanapp.model.Announcement;
import com.clanapp.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderBySortOrderAsc();
    }

    public Announcement createAnnouncement(Announcement announcement) {
        int maxOrder = announcementRepository.findAll().stream()
                .mapToInt(a -> a.getSortOrder() != null ? a.getSortOrder() : 0)
                .max()
                .orElse(0);
        announcement.setSortOrder(maxOrder + 1);
        return announcementRepository.save(announcement);
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateAnnouncementOrder(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            Announcement announcement = announcementRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Duyuru bulunamadı: " + id));
            announcement.setSortOrder(i);
            announcementRepository.save(announcement);
        }
    }

    public Announcement updateAnnouncement(Long id, Announcement request) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Duyuru bulunamadı: " + id));
        
        announcement.setContent(request.getContent());
        announcement.setColorKey(request.getColorKey());
        
        return announcementRepository.save(announcement);
    }

    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new IllegalArgumentException("Duyuru bulunamadı: " + id);
        }
        announcementRepository.deleteById(id);
    }
}
