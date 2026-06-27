package com.clanapp.service;

import com.clanapp.dto.EventRequest;
import com.clanapp.model.Event;
import com.clanapp.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private static final int MAX_EVENTS = 10;

    private final EventRepository eventRepository;

    /** Tüm etkinlikleri listele */
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
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

        Event event = Event.builder()
                .title(request.getTitle())
                .colorKey(colorKey)
                .build();

        return eventRepository.save(event);

    }

    /** Etkinlik sil — event_submissions cascade ile otomatik silinir */
    @Transactional
    public void deleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Etkinlik bulunamadı: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }
}
