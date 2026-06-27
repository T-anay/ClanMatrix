# ⚔️ ClanMatrix — Klan Etkinlik Takip Sistemi

> Klan üyelerinin etkinliklere katılımını Excel benzeri bir matris tabloda takip eden, admin onaylı üyelik sistemi ile güvenli full-stack web uygulaması.

---

## 🏗️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, React Router |
| **Backend** | Java 21, Spring Boot 3, Spring Security, JWT |
| **Veritabanı** | PostgreSQL (Neon.tech — ücretsiz) |
| **Medya** | Cloudinary (ücretsiz) |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render.com |
| **Frontend Testler** | Vitest + React Testing Library |
| **Backend Testler** | JUnit 5 + Mockito |

---

## 📂 Proje Yapısı

```
ClanMatrix/
├── clan-backend/       ← Spring Boot API
└── clan-frontend/      ← React + Vite
```

---

## ⚡ Hızlı Başlangıç (Local)

### Gereksinimler
- Java 21+
- Maven 3.9+
- Node.js 20+
- npm 10+

### 1️⃣ Çevre Değişkenleri Hazırla

**Backend** — `clan-backend/src/main/resources/application-dev.properties` dosyası oluştur (git'e gitmiyor):
```properties
spring.datasource.url=jdbc:postgresql://<NEON_HOST>/<DB_NAME>?sslmode=require
spring.datasource.username=<DB_USER>
spring.datasource.password=<DB_PASSWORD>
jwt.secret=clanmatrix-super-secret-key-min-256-bits-long-change-this
jwt.expiration=86400000
cloudinary.cloud-name=<CLOUDINARY_CLOUD>
cloudinary.api-key=<CLOUDINARY_API_KEY>
cloudinary.api-secret=<CLOUDINARY_API_SECRET>
admin.username=admin
admin.password=Admin1234!
```

**Frontend** — `clan-frontend/.env` dosyası oluştur:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2️⃣ Backend Başlat

```bash
cd clan-backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

> İlk başlatmada DataInitializer otomatik olarak admin hesabı oluşturur:
> - Kullanıcı Adı: admin
> - Şifre: Admin1234!

### 3️⃣ Frontend Başlat

```bash
cd clan-frontend
npm install
npm run dev
```

Uygulama http://localhost:5173 adresinde çalışır.

---

## 🗄️ Veritabanı (Neon.tech Kurulumu)

1. https://neon.tech üzerinde ücretsiz hesap aç
2. Yeni proje oluştur → Connection string kopyala
3. application-dev.properties'e yapıştır

Spring Boot uygulama açılışında tabloları (users, events, event_submissions) otomatik oluşturur (ddl-auto=update).

---

## 🖼️ Cloudinary Kurulumu

1. https://cloudinary.com üzerinde ücretsiz hesap aç
2. Dashboard → API Keys → Cloud Name, API Key, API Secret kopyala
3. application-dev.properties'e yapıştır

---

## 🚀 Production Deployment

### Backend → Render.com

1. render.com → New Web Service → GitHub repo'yu bağla
2. Build Command: mvn clean package -DskipTests
3. Start Command: java -jar target/clan-backend-0.0.1-SNAPSHOT.jar
4. Environment Variables sekmesine ekle:

| Değişken | Açıklama |
|----------|---------|
| DB_URL | jdbc:postgresql://... (Neon.tech) |
| DB_USER | Neon kullanıcı adı |
| DB_PASSWORD | Neon şifresi |
| JWT_SECRET_KEY | Güçlü rastgele string (min 32 karakter) |
| JWT_EXPIRATION_MS | 86400000 |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud adı |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| ADMIN_USERNAME | Admin kullanıcı adı |
| ADMIN_PASSWORD | Güçlü admin şifresi |
| FRONTEND_URL | https://your-app.vercel.app |

### Frontend → Vercel

1. vercel.com → New Project → GitHub repo'yu bağla
2. Root Directory: clan-frontend
3. Environment Variables sekmesine ekle:

| Değişken | Değer |
|----------|-------|
| VITE_API_BASE_URL | https://your-backend.onrender.com/api |

---

## 🔒 Güvenlik Özeti

| Tehdit | Koruma |
|--------|--------|
| SQL Injection | Spring Data JPA Prepared Statements |
| XSS | React otomatik escape |
| Şifre sızıntısı | BCrypt hashing |
| CORS | Sadece Vercel domain'i kabul eder |
| Yetkisiz erişim | JWT + @PreAuthorize |
| Credential sızıntısı | .env ve application-dev.properties git'e gitmez |

---

## 🧪 Testler

```bash
# Backend testleri
cd clan-backend
mvn test

# Frontend testleri
cd clan-frontend
npm run test
```

---

## 📖 API Dokümantasyonu

### Public
| Method | URL | Açıklama |
|--------|-----|---------|
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |

### User + Admin
| Method | URL | Açıklama |
|--------|-----|---------|
| GET | /api/events | Etkinlik listesi |
| GET | /api/submissions | Matris verisi |
| POST | /api/submissions/upload | Resim yükle (multipart) |

### Admin Only
| Method | URL | Açıklama |
|--------|-----|---------|
| GET | /api/users/pending | Onay bekleyenler |
| PUT | /api/users/{id}/approve | Kullanıcı onayla |
| DELETE | /api/users/{id} | Kullanıcı sil |
| POST | /api/events | Etkinlik ekle |
| DELETE | /api/events/{id} | Etkinlik sil |
