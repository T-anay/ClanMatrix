package com.clanapp.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    // IP bazlı istek sayılarını tutan harita
    private final Map<String, Integer> requestCounts = new ConcurrentHashMap<>();
    
    // Dakikada maksimum istek sınırı (Auth işlemleri için)
    private final int MAX_REQUESTS_PER_MINUTE = 10;

    public RateLimitingFilter() {
        // Her 1 dakikada bir haritayı (sayacı) temizle
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(requestCounts::clear, 1, 1, TimeUnit.MINUTES);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Sadece Giriş Yap (login) ve Kayıt Ol (register) uç noktalarını koru
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            String clientIp = request.getRemoteAddr();
            
            // Render gibi proxy/bulut sunucuları üzerinden geliyorsa gerçek IP'yi al
            String forwardedFor = request.getHeader("X-Forwarded-For");
            if (forwardedFor != null && !forwardedFor.isEmpty()) {
                clientIp = forwardedFor.split(",")[0].trim();
            }

            int requests = requestCounts.getOrDefault(clientIp, 0);

            if (requests >= MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.getWriter().write("{\"message\": \"Çok fazla başarısız deneme yaptınız. Lütfen 1 dakika bekleyip tekrar deneyin.\"}");
                return;
            }

            requestCounts.put(clientIp, requests + 1);
        }

        filterChain.doFilter(request, response);
    }
}
