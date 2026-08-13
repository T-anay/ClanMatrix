package com.clanapp.service;

import com.clanapp.dto.EventRequest;
import com.clanapp.model.Event;
import com.clanapp.model.EventSubmission;
import com.clanapp.repository.EventRepository;
import com.clanapp.repository.EventSubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private static final int MAX_EVENTS = 10;

    private final EventRepository eventRepository;
    private final EventSubmissionRepository submissionRepository;
    private final StorageService storageService;

    /** Tüm etkinlikleri listele */
    public List<Event> getAllEvents() {
        return eventRepository.findAllByOrderBySortOrderAsc();
    }

    /** Yeni etkinlik oluştur (10 limit kontrolü dahil) */
    @Transactional
    public Event createEvent(EventRequest request) {
        long count = eventRepository.count();
        if (count >= MAX_EVENTS) {
            throw new IllegalStateException(
                "Maksimum etkinlik sayısına (" + MAX_EVENTS + ") ulaşıldı. " +
                "Yeni etkinlik eklemek için mevcut bir etkinliği silin."
            );
        }

        // colorKey: admin seçtiyse kullan, seçmediyse sıradaki rengi otomatik ata
        int colorKey = (request.getColorKey() != null)
            ? request.getColorKey()
            : (int)(count % 10);

        // Sıralama numarasını en büyük sıranın bir fazlası yap
        int maxOrder = eventRepository.findAll().stream()
                .mapToInt(e -> e.getSortOrder() != null ? e.getSortOrder() : 0)
                .max()
                .orElse(0);

        Event event = Event.builder()
                .title(request.getTitle())
                .colorKey(colorKey)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .sortOrder(maxOrder + 1)
                .build();

        return eventRepository.save(event);

    }

    /** Etkinlik sıralamasını güncelle */
    @Transactional
    public void updateEventOrder(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Long id = orderedIds.get(i);
            Event event = eventRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Etkinlik bulunamadı: " + id));
            event.setSortOrder(i);
            eventRepository.save(event);
        }
    }

    /** Etkinlik Güncelle (Başlık ve Tarihler) */
    @Transactional
    public Event updateEvent(Long eventId, EventRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Etkinlik bulunamadı: " + eventId));
        
        event.setTitle(request.getTitle());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        
        if (request.getColorKey() != null) {
            event.setColorKey(request.getColorKey());
        }

        return eventRepository.save(event);
    }

    /** Etkinlik sil — event_submissions ve cloudinary resimleri silinir */
    @Transactional
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Etkinlik bulunamadı: " + eventId);
        }

        // 1. Etkinliğe ait tüm resimleri/katılımları bul
        List<EventSubmission> submissions = submissionRepository.findByEventId(eventId);
        for (EventSubmission sub : submissions) {
            // 2. Resimleri S3'ten sil
            try {
                storageService.delete(sub.getCloudinaryPublicId());
            } catch (Exception e) {
                System.err.println("S3 silme hatası (Public ID: " + sub.getCloudinaryPublicId() + "): " + e.getMessage());
            }
            // 3. Veritabanından kaydı sil
            submissionRepository.delete(sub);
        }

        // 4. Etkinliği güvenle sil (FK hatası vermez)
        eventRepository.deleteById(eventId);
    }
}
