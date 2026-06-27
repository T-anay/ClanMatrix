package com.clanapp.service;

import com.clanapp.dto.EventRequest;
import com.clanapp.model.Event;
import com.clanapp.repository.EventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void createEvent_shouldSucceed_whenLessThan10Events() {
        when(eventRepository.count()).thenReturn(5L);
        when(eventRepository.save(any(Event.class))).thenAnswer(i -> i.getArgument(0));

        EventRequest request = new EventRequest();
        request.setTitle("Yeni Etkinlik");

        Event result = eventService.createEvent(request);

        assertNotNull(result);
        assertEquals("Yeni Etkinlik", result.getTitle());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void createEvent_shouldThrowException_whenExactly10Events() {
        when(eventRepository.count()).thenReturn(10L);

        EventRequest request = new EventRequest();
        request.setTitle("11. Etkinlik");

        assertThrows(IllegalStateException.class, () -> eventService.createEvent(request));
        verify(eventRepository, never()).save(any());
    }

    @Test
    void deleteEvent_shouldSucceed_whenExists() {
        when(eventRepository.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> eventService.deleteEvent(1L));
        verify(eventRepository).deleteById(1L);
    }

    @Test
    void deleteEvent_shouldThrowException_whenNotFound() {
        when(eventRepository.existsById(99L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> eventService.deleteEvent(99L));
    }
}
