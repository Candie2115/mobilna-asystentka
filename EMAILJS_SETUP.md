# 📧 KONFIGURACJA EMAILJS - KROK PO KROKU (3 MINUTY)

## ✅ DUŻO ŁATWIEJSZE NIŻ APP PASSWORD!

EmailJS to bezpłatny serwis, który wysyła emaile bez żadnych haseł!  
**Darmowe:** 200 emaili/miesiąc (wystarczy na początku)

---

## Krok 1: Rejestracja (1 minuta)

1. Przejdź do: **https://www.emailjs.com/**
2. Kliknij **"Sign Up"** (prawy górny róg)
3. Zarejestruj się przez Google:
   - Wybierz: **"Continue with Google"**
   - Zaloguj się na: `julia.mobilnaasystentka@gmail.com`
4. Gotowe! Jesteś zalogowana.

---

## Krok 2: Dodaj Email Service (30 sekund)

1. Po zalogowaniu zobaczysz Dashboard
2. Kliknij: **"Add New Service"**
3. Wybierz: **"Gmail"**
4. Kliknij: **"Connect Account"**
5. Wybierz konto: `julia.mobilnaasystentka@gmail.com`
6. Zaakceptuj uprawnienia
7. **SKOPIUJ** wyświetlony **Service ID** (np. `service_abc123`)

---

## Krok 3: Stwórz Email Template (1 minuta)

1. W menu po lewej kliknij: **"Email Templates"**
2. Kliknij: **"Create New Template"**
3. Wypełnij template:

**Subject:**
```
🔔 Nowe zapytanie - {{package}}
```

**Content (HTML):**
```html
<h2>📬 Nowe zapytanie z formularza kontaktowego</h2>

<p><strong>👤 Nazwa:</strong> {{name}}</p>
<p><strong>📧 Email:</strong> {{email}}</p>
<p><strong>📦 Pakiet:</strong> {{package}}</p>

<h3>💬 Wiadomość:</h3>
<p>{{message}}</p>

<hr>
<p style="color: gray; font-size: 12px;">
Data: {{current_date}}<br>
System: Mobilna Asystentka
</p>
```

**Settings:**
- **To Email:** `julia.mobilnaasystentka@gmail.com` (Twój email)
- **From Name:** `Formularz Kontaktowy`
- **Reply To:** `{{email}}` (email klienta - ważne!)

4. Kliknij **"Save"**
5. **SKOPIUJ** wyświetlony **Template ID** (np. `template_xyz789`)

---

## Krok 4: Znajdź Public Key (10 sekund)

1. W menu po lewej kliknij: **"Account"**
2. Znajdź sekcję: **"API Keys"**
3. **SKOPIUJ** swój **Public Key** (np. `abcd1234efgh5678`)

---

## Krok 5: Wklej do kodu (30 sekund)

1. Otwórz plik: `public/index.html`
2. Znajdź linię (około 346-356):

```javascript
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // <- TUTAJ
})();
```

3. Zamień na:
```javascript
(function() {
    emailjs.init("twój-public-key-tutaj");
})();
```

4. Znajdź linię:
```javascript
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
```

5. Zamień na:
```javascript
emailjs.sendForm('twój-service-id', 'twój-template-id', form)
```

### Przykład:
```javascript
(function() {
    emailjs.init("abcd1234efgh5678"); // Public Key
})();

// ...

emailjs.sendForm('service_abc123', 'template_xyz789', form)
```

---

## Krok 6: Testuj! (10 sekund)

1. Otwórz: **http://localhost:3000**
2. Przewiń do formularza "Nawiążmy współpracę"
3. Wypełnij dane:
   - Nazwa: Test
   - Email: twoj@email.com
   - Pakiet: P3F Premium Full
   - Wiadomość: Test wysyłki
4. Kliknij **"PRZEŚLIJ ZAPYTANIE"**
5. Sprawdź skrzynkę: `julia.mobilnaasystentka@gmail.com`

✅ **Powinien przyjść email!**

---

## 🎉 GOTOWE!

**Nie potrzebujesz:**
- ❌ App Password
- ❌ 2FA na Gmail
- ❌ Konfiguracji serwera
- ❌ Nodemailer

**Masz:**
- ✅ Prosty serwis
- ✅ 200 emaili/miesiąc za darmo
- ✅ Działa od razu
- ✅ Automatyczna odpowiedź (Reply-To)

---

## 📊 Co wysyła EmailJS?

**Email do Ciebie wygląda tak:**
```
🔔 Nowe zapytanie - P3F Premium Full
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nazwa: Jan Kowalski
📧 Email: jan@firma.pl
📦 Pakiet: P3F Premium Full

💬 Wiadomość:
Interesuje mnie pakiet Premium Full.
Proszę o kontakt w sprawie współpracy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Data: 27/12/2025
System: Mobilna Asystentka
```

**Odpowiedź:**
- Kliknij "Reply" w emailu
- Automatycznie adresat: `jan@firma.pl`
- Możesz od razu odpisać klientowi!

---

## 🔧 Troubleshooting

### Problem: "User not found"
**Rozwiązanie:**
- Sprawdź czy Public Key jest poprawny
- Wklej dokładnie (bez spacji)

### Problem: "Service not found"
**Rozwiązanie:**
- Sprawdź Service ID
- Upewnij się, że Gmail połączony

### Problem: "Template not found"
**Rozwiązanie:**
- Sprawdź Template ID
- Upewnij się, że template zapisany

### Problem: Email nie przychodzi
**Rozwiązanie:**
- Sprawdź Spam folder
- Poczekaj 1-2 minuty
- Sprawdź Dashboard EmailJS → Email Log

---

## 💰 Limity (Darmowy Plan)

- **200 emaili/miesiąc** - wystarczy na początku
- Jeśli więcej potrzebne:
  - Personal Plan: $7/miesiąc = 1000 emaili
  - Professional: $15/miesiąc = 3000 emaili

---

## 🚀 Na Produkcji

**EmailJS działa automatycznie!**
- Nie musisz nic zmieniać przy hostingu
- Klucze są w kodzie frontend (bezpieczne dla Public Key)
- Działa na Railway, Render, Vercel, Netlify

---

## 📄 Linki

- Dashboard: https://dashboard.emailjs.com/
- Dokumentacja: https://www.emailjs.com/docs/
- Email Log: https://dashboard.emailjs.com/admin (sprawdź wysłane)

---

## ✅ Checklist

- [ ] Zarejestruj się na EmailJS
- [ ] Połącz Gmail
- [ ] Skopiuj Service ID
- [ ] Stwórz Email Template
- [ ] Skopiuj Template ID
- [ ] Skopiuj Public Key
- [ ] Wklej 3 klucze do `index.html`
- [ ] Testuj formularz
- [ ] Sprawdź email

**Czas:** ~3 minuty  
**Trudność:** Bardzo łatwe  
**Koszt:** Darmowe (200/miesiąc)

---

**Data:** 27 grudnia 2025  
**Status:** ✅ GOTOWE - DUŻO ŁATWIEJSZE!
