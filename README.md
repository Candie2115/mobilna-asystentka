# 🎯 Mobilna Asystentka - System CRM

Profesjonalny system zarządzania klientami dla biznesu asystenckiego.

## ✨ NOWE FUNKCJE (27.12.2025)

✅ **Formularz kontaktowy** - wysyła emaile na julia.mobilnaasystentka@gmail.com  
✅ **Aktywne linki** - telefon i email otwierają aplikacje  
✅ **EmailJS** - prostsza konfiguracja, bez haseł (3 minuty setup)  

📄 **Instrukcja aktywacji:** [EMAILJS_SETUP.md](EMAILJS_SETUP.md) - **PRZECZYTAJ TO!**  
📄 **Kompletny raport:** [STRONA_GOTOWA.md](STRONA_GOTOWA.md)

---

## 🚀 Szybki Start

### 1. ⚡ NOWA METODA: EmailJS (3 minuty)

**Zamiast Gmail App Password używamy EmailJS - dużo łatwiejsze!**

1. Zarejestruj się: https://www.emailjs.com/ (darmowe)
2. Połącz Gmail
3. Skopiuj 3 klucze (Service ID, Template ID, Public Key)
4. Wklej do `public/index.html` (linie 346-356)

📄 **Instrukcja krok po kroku:** [EMAILJS_SETUP.md](EMAILJS_SETUP.md)

### 2. Uruchom serwer

```powershell
cd "c:\Users\insta\Desktop\M.A strona"
npm start
```

### 3. Otwórz przeglądarkę

```
http://localhost:3000
```

### 4. Zaloguj się

- **Admin:** j.nowak0703 / Julka2001.

### 5. Testuj formularz kontaktowy

- Przewiń stronę główną do sekcji "Nawiążmy współpracę"
- Wypełnij formularz
- Sprawdź email julia.mobilnaasystentka@gmail.com

---

## 📁 Struktura Projektu

```
M.A strona/
├── public/                 # Frontend
│   ├── index.html         # Strona główna (landing)
│   ├── login.html         # Strona logowania
│   └── admin.html         # Panel administratora
├── server/                # Backend
│   ├── server.js          # Serwer Express
│   ├── database/          # Baza danych
│   │   ├── db.js         # Połączenie SQLite
│   │   ├── schema.sql    # Schemat tabel
│   │   └── init.js       # Inicjalizacja danych
│   ├── routes/           # Endpointy API
│   │   ├── auth.js       # Logowanie/rejestracja
│   │   ├── clients.js    # Zarządzanie klientami
│   │   └── tasks.js      # Zadania i Emergency
│   └── middleware/       # Middleware
│       └── auth.js       # Autoryzacja JWT
├── data/                 # Dane
│   └── database.db       # Baza SQLite
└── package.json          # Zależności
```

---

## 🛠️ Komendy

### Pierwsze uruchomienie

```powershell
npm install              # Zainstaluj zależności
npm run init-db         # Utwórz bazę danych
npm start               # Uruchom serwer
```

### Reset bazy danych

```powershell
Remove-Item data\database.db
npm run init-db
```

### Sprawdź czy serwer działa

```
http://localhost:3000/api/health
```

---

## 📦 Instalacja

### 1. Wymagania
- Node.js (v16+)
- npm

### 2. Konfiguracja

```bash
# Przejdź do folderu projektu
cd "M.A strona"

# Zainstaluj zależności
npm install

# Plik .env jest już skonfigurowany
```

### 3. Baza danych

```bash
# Utwórz bazę SQLite
npm run init-db
```

### 4. Uruchomienie

```bash
# Tryb produkcyjny
npm start

# Tryb developerski (auto-restart)
npm run dev
```

Serwer uruchomi się na: `http://localhost:3000`

## 🔐 Domyślne dane logowania

**Administrator:**
- Login: `j.nowak0703`
- Hasło: `Julka2001.`

**Klienci testowi:**
- `budimex` / `test123`
- `kghm` / `test123`
- `luxury` / `test123`

## 📁 Struktura projektu

```
M.A strona/
├── server/
│   ├── database/
│   │   ├── db.js          # Połączenie z PostgreSQL
│   │   ├── schema.sql     # Schemat bazy danych
│   │   └── init.js        # Skrypt inicjalizacyjny
│   ├── middleware/
│   │   └── auth.js        # JWT & autoryzacja
│   ├── routes/
│   │   └── auth.js        # Endpointy logowania/rejestracji
│   └── server.js          # Główny plik serwera
├── public/                # Pliki frontend (index.html, login.html)
├── .env                   # Konfiguracja (NIE commitować!)
├── .gitignore
├── package.json
└── README.md
```

## 🛡️ Bezpieczeństwo

- ✅ Hasła szyfrowane (bcrypt)
- ✅ Autoryzacja JWT
- ✅ Walidacja danych wejściowych
- ✅ SQL Injection protection (parametryzowane zapytania)
- ✅ Logi bezpieczeństwa
- ⚠️ **W produkcji:** Włącz HTTPS (SSL/TLS)

## 📡 API Endpoints

### Autentykacja
- `POST /api/auth/login` - Logowanie
- `POST /api/auth/register` - Rejestracja

### Health Check
- `GET /api/health` - Status API

## 🔧 Dalszy rozwój

Następne kroki implementacji:
- [ ] Panel administratora (frontend + API)
- [ ] Panel klienta (różne widoki pakietów)
- [ ] System zadań i Emergency
- [ ] Moduł rozliczeń
- [ ] Upload plików (E-Archiwum)
- [ ] System wiadomości/czatu
- [ ] Automatyczne odnowienia pakietów

## 📞 Kontakt

Julia Nowak - Mobilna Asystentka
- 📞 +48 607 692 526
- ✉️ julia.mobilnaasystentka@gmail.com

---

**Wersja:** 1.0.0  
**Data:** Grudzień 2025
