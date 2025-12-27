# 🚀 QUICK START GUIDE

## Uruchomienie w 3 krokach

### Krok 1: Gmail App Password (2 minuty)
```
1. https://myaccount.google.com/apppasswords
2. Zaloguj: julia.mobilnaasystentka@gmail.com
3. App: "Other" → "Mobilna Asystentka"
4. Skopiuj 16 znaków (np. abcd efgh ijkl mnop)
```

### Krok 2: Konfiguracja (.env)
```bash
# Otwórz plik .env
# Znajdź linię:
EMAIL_PASSWORD=YOUR_APP_PASSWORD_HERE

# Zamień na (BEZ SPACJI):
EMAIL_PASSWORD=abcdefghijklmnop
```

### Krok 3: Start!
```bash
npm start
```

Gotowe! Otwórz: http://localhost:3000

---

## Testowanie

### 1. Formularz kontaktowy
- Przewiń stronę do końca
- Wypełnij dane
- Kliknij "PRZEŚLIJ ZAPYTANIE"
- ✅ Sprawdź email (julia.mobilnaasystentka@gmail.com)

### 2. Klikalne linki
- Kliknij telefon: +48 607 692 526 → otwiera aplikację
- Kliknij email → otwiera Gmail

### 3. Panel admina
- Przejdź do: http://localhost:3000/login.html
- Login: `j.nowak0703`
- Hasło: `Julka2001.`
- Sprawdź Dashboard, Zadania, Archiwum

### 4. Rejestracja klienta
- Kliknij "Zarejestruj się"
- Wybierz pakiet (np. P3F Premium Full)
- Wypełnij dane
- Zaloguj → Zobacz swój panel

### 5. Tworzenie zadania
- Panel klienta → "Nowe Zlecenie"
- Wypełnij formularz
- Wyślij
- Zobacz w panelu admina

---

## Checklist przed hosting

- [ ] Gmail App Password wklejony do `.env`
- [ ] Testuj formularz lokalnie
- [ ] Testuj telefon/email linki
- [ ] Testuj logowanie admina
- [ ] Testuj rejestrację klienta
- [ ] Testuj tworzenie zadania
- [ ] Testuj archiwum (2026 → miesiąc)
- [ ] Test na telefonie (responsywność)
- [ ] Backup database.db

---

## Hosting (Railway)

```bash
# 1. Instalacja
npm i -g @railway/cli

# 2. Logowanie
railway login

# 3. Deploy
railway init
railway up

# 4. Variables w Dashboard:
JWT_SECRET=[64 znaki losowe]
EMAIL_USER=julia.mobilnaasystentka@gmail.com
EMAIL_PASSWORD=[nowy App Password dla produkcji]
NODE_ENV=production

# 5. Inicjalizacja (RAZ):
railway run npm run init-db
```

---

## Troubleshooting

### Email nie działa?
1. Sprawdź `.env` → czy `EMAIL_PASSWORD` ma 16 znaków?
2. Sprawdź czy 2FA włączone na Gmail
3. Wygeneruj nowe App Password
4. Zrestartuj serwer: `npm start`

### Nie mogę się zalogować?
- Admin: `j.nowak0703` / `Julka2001.` (z kropką!)
- Reset bazy: `npm run init-db`

### Formularz nie wysyła?
1. F12 → Console → sprawdź błędy
2. Czy serwer działa? `npm start`
3. Sprawdź logi serwera w terminalu

---

## Linki do dokumentacji

📄 [STRONA_GOTOWA.md](STRONA_GOTOWA.md) - Kompletny raport  
📄 [INSTRUKCJA_EMAIL.md](INSTRUKCJA_EMAIL.md) - Szczegóły wysyłki  
📄 [FINAL_PRODUCTION_CHECKLIST.md](FINAL_PRODUCTION_CHECKLIST.md) - Checklist  
📄 [README.md](README.md) - Główna dokumentacja  

---

## Kontakt

📧 julia.mobilnaasystentka@gmail.com  
📞 +48 607 692 526

---

**Status:** ✅ GOTOWA DO UŻYCIA  
**Data:** 27 grudnia 2025  
**Wersja:** 1.1.0
