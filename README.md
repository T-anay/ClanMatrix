# ⚔️ ClanMatrix

> Clan Activity Tracking System — Personal Project
> Klan Etkinlik Takip Sistemi — Kişisel Proje

**Live Demo / Canlı Demo:** [clanmatrix.vercel.app](https://clanmatrix.vercel.app)

---

## 🇬🇧 English

ClanMatrix is a full-stack web application for tracking clan members' participation in events and activities using an Excel-like matrix table. Members can register and request to join, while admins approve memberships and manage events. Built as a personal hobby project.

### Features

- **Activity Matrix** — Visualize member-event participation in a spreadsheet-style grid
- **Admin Approval System** — New members must be approved by an admin before gaining access
- **JWT Authentication** — Token-based authentication with role separation (Admin / Member)
- **Profile Photos** — Members can upload profile pictures via Cloudinary
- **Responsive UI** — Works on both desktop and mobile
- **Frontend Tests** — Component tests with Vitest and React Testing Library
- **Backend Tests** — Unit and integration tests with JUnit 5 and Mockito

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, React Router |
| **Backend** | Java 21, Spring Boot 3, Spring Security, JWT |
| **Database** | PostgreSQL (hosted on [Neon.tech](https://neon.tech)) |
| **Media Storage** | Cloudinary |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render.com |
| **Frontend Tests** | Vitest + React Testing Library |
| **Backend Tests** | JUnit 5 + Mockito |

### Project Structure

```
ClanMatrix/
├── clan-backend/       # Spring Boot REST API
└── clan-frontend/      # React + Vite SPA
```

### Getting Started

**Prerequisites:** Java 21+, Maven 3.9+, Node.js 20+, npm 10+, PostgreSQL ([neon.tech](https://neon.tech) free tier works), Cloudinary account (free tier)

**1. Clone the repository**
```bash
git clone https://github.com/T-anay/ClanMatrix.git
cd ClanMatrix
```

**2. Configure the backend**

Create `clan-backend/src/main/resources/application-dev.properties` (git-ignored):
```properties
spring.datasource.url=jdbc:postgresql://<NEON_HOST>/<DB_NAME>?sslmode=require
spring.datasource.username=<DB_USER>
spring.datasource.password=<DB_PASSWORD>
jwt.secret=your-secret-key-min-256-bits-long
jwt.expiration=86400000
cloudinary.cloud-name=<CLOUDINARY_CLOUD>
cloudinary.api-key=<CLOUDINARY_API_KEY>
cloudinary.api-secret=<CLOUDINARY_API_SECRET>
```

**3. Start the backend**
```bash
cd clan-backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

On first launch, a default admin account is created automatically:
- **Username:** `admin` | **Password:** `Admin1234!`

**4. Configure the frontend**

Create `clan-frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**5. Start the frontend**
```bash
cd clan-frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Tests

```bash
# Frontend
cd clan-frontend && npm run test

# Backend
cd clan-backend && mvn test
```

### Environment Variables

**Backend (`application-dev.properties`)**

| Variable | Description |
|----------|-------------|
| `spring.datasource.url` | PostgreSQL JDBC connection string |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `jwt.secret` | JWT signing key (min. 256 bits) |
| `jwt.expiration` | Token expiry in milliseconds (86400000 = 24h) |
| `cloudinary.cloud-name` | Cloudinary cloud name |
| `cloudinary.api-key` | Cloudinary API key |
| `cloudinary.api-secret` | Cloudinary API secret |

**Frontend (`.env`)**

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

---

## 🇹🇷 Türkçe

ClanMatrix, klan üyelerinin etkinliklere katılımını Excel benzeri bir matris tabloda takip eden full-stack bir web uygulamasıdır. Üyeler kayıt olup katılım talebinde bulunabilir, yöneticiler ise üyelikleri onaylayarak etkinlikleri yönetir. Kişisel bir hobi projesi olarak geliştirilmiştir.

### Özellikler

- **Etkinlik Matrisi** — Üye-etkinlik katılımını tablo görünümünde göster
- **Admin Onay Sistemi** — Yeni üyeler erişim kazanmadan önce admin onayından geçmeli
- **JWT Kimlik Doğrulama** — Rol ayrımıyla (Admin / Üye) token tabanlı kimlik doğrulama
- **Profil Fotoğrafı** — Üyeler Cloudinary aracılığıyla profil fotoğrafı yükleyebilir
- **Duyarlı Tasarım** — Hem masaüstü hem mobilde çalışır
- **Frontend Testleri** — Vitest ve React Testing Library ile bileşen testleri
- **Backend Testleri** — JUnit 5 ve Mockito ile birim ve entegrasyon testleri

### Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios, React Router |
| **Backend** | Java 21, Spring Boot 3, Spring Security, JWT |
| **Veritabanı** | PostgreSQL ([Neon.tech](https://neon.tech) ücretsiz) |
| **Medya Depolama** | Cloudinary |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render.com |
| **Frontend Testler** | Vitest + React Testing Library |
| **Backend Testler** | JUnit 5 + Mockito |

### Başlarken

**Gereksinimler:** Java 21+, Maven 3.9+, Node.js 20+, npm 10+, PostgreSQL ([neon.tech](https://neon.tech) ücretsiz), Cloudinary hesabı (ücretsiz)

**1. Repoyu klonlayın**
```bash
git clone https://github.com/T-anay/ClanMatrix.git
cd ClanMatrix
```

**2. Backend'i yapılandırın**

`clan-backend/src/main/resources/application-dev.properties` dosyasını oluşturun (git'e gitmez):
```properties
spring.datasource.url=jdbc:postgresql://<NEON_HOST>/<DB_NAME>?sslmode=require
spring.datasource.username=<DB_USER>
spring.datasource.password=<DB_PASSWORD>
jwt.secret=en-az-256-bit-uzunlugunda-gizli-anahtar
jwt.expiration=86400000
cloudinary.cloud-name=<CLOUDINARY_CLOUD>
cloudinary.api-key=<CLOUDINARY_API_KEY>
cloudinary.api-secret=<CLOUDINARY_API_SECRET>
```

**3. Backend'i başlatın**
```bash
cd clan-backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

İlk başlatmada varsayılan admin hesabı otomatik oluşturulur:
- **Kullanıcı Adı:** `admin` | **Şifre:** `Admin1234!`

**4. Frontend'i yapılandırın**

`clan-frontend/.env` dosyasını oluşturun:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**5. Frontend'i başlatın**
```bash
cd clan-frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışır.

### Testleri Çalıştırma

```bash
# Frontend
cd clan-frontend && npm run test

# Backend
cd clan-backend && mvn test
```
