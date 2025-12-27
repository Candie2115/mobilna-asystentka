# 📧 JAK AKTYWOWAĆ WYSYŁKĘ EMAILI Z FORMULARZA

## Krok po kroku - zajmie 2 minuty

### 1. Włącz 2-Step Verification (jeśli jeszcze nie masz)
1. Przejdź do: https://myaccount.google.com/security
2. Zaloguj się na `julia.mobilnaasystentka@gmail.com`
3. Znajdź sekcję **"2-Step Verification"**
4. Jeśli wyłączona - włącz (potrzebne do App Password)

### 2. Wygeneruj App Password
1. Przejdź do: https://myaccount.google.com/apppasswords
2. Kliknij **"Select app"** → wybierz **"Other (Custom name)"**
3. Wpisz nazwę: `Mobilna Asystentka`
4. Kliknij **"Generate"**
5. Skopiuj **16-znakowe hasło** (np. `abcd efgh ijkl mnop`)

### 3. Wklej do pliku .env
1. Otwórz plik `.env` w folderze projektu
2. Znajdź linię:
   ```
   EMAIL_PASSWORD=YOUR_APP_PASSWORD_HERE
   ```
3. Zamień na (BEZ SPACJI):
   ```
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
4. Zapisz plik

### 4. Zrestartuj serwer
```bash
# Zatrzymaj serwer (Ctrl+C w terminalu)
# Uruchom ponownie:
npm start
```

### 5. Testuj!
1. Otwórz: http://localhost:3000
2. Przewiń do sekcji **"Nawiążmy współpracę"**
3. Wypełnij formularz:
   - Imię: Test
   - Email: twoj@email.com
   - Pakiet: P3F Premium Full
   - Wiadomość: To jest test formularza
4. Kliknij **"PRZEŚLIJ ZAPYTANIE"**
5. Sprawdź swoją skrzynkę `julia.mobilnaasystentka@gmail.com`

✅ Powinien przyjść email z tytułem: **🔔 Nowe zapytanie - P3F**

---

## ⚠️ Troubleshooting

### Problem: "Invalid login credentials" w konsoli serwera
**Przyczyna:** Źle wklejone App Password  
**Rozwiązanie:**
- Sprawdź czy hasło ma 16 znaków
- Usuń spacje (powinno być: `abcdefghijklmnop`)
- Wygeneruj nowe App Password i spróbuj ponownie

### Problem: Email nie przychodzi
**Możliwe przyczyny:**
1. App Password nie wygenerowane → wróć do kroku 2
2. 2FA wyłączona na Gmail → wróć do kroku 1
3. Literówka w `.env` → sprawdź dokładnie
4. Serwer nie zrestartowany → `npm start`

### Problem: "Cannot find module 'nodemailer'"
**Rozwiązanie:**
```bash
npm install nodemailer
npm start
```

---

## 🚀 Na Produkcji (Railway/Render)

**W panelu hostingu:**
1. Variables / Environment Variables
2. Dodaj nową zmienną:
   - **Name:** `EMAIL_PASSWORD`
   - **Value:** `[twoje-16-znakowe-app-password]`
3. Save → Deploy ponownie

**Ważne:** Nie commituj App Password do GitHuba! Jest w `.env`, który jest w `.gitignore`.

---

## ✅ Gotowe!

Po wykonaniu tych kroków:
- ✅ Formularz kontaktowy działa
- ✅ Emaile przychodzą na julia.mobilnaasystentka@gmail.com
- ✅ Możesz odpowiadać bezpośrednio (reply-to ustawione)
- ✅ Strona gotowa do przyjmowania klientów

**Czas:** ~2 minuty  
**Trudność:** Bardzo łatwe  
**Wymagane:** Dostęp do konta Gmail
