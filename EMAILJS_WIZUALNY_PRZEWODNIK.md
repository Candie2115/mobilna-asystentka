# 📧 EMAILJS - WIZUALNY PRZEWODNIK

## 🎯 CO MUSISZ ZROBIĆ (3 MINUTY)

### Otwórz 2 zakładki w przeglądarce:

1. **EmailJS Dashboard:** https://www.emailjs.com/
2. **Twój kod:** VS Code → `public/index.html` (linia 346)

---

## KROK 1: REJESTRACJA

### Na stronie EmailJS:
```
https://www.emailjs.com/
```

1. Kliknij: **"Sign Up"** (prawy górny róg)
2. Wybierz: **"Continue with Google"**
3. Zaloguj na: **julia.mobilnaasystentka@gmail.com**
4. Zaakceptuj uprawnienia
5. ✅ Jesteś zalogowana!

---

## KROK 2: POŁĄCZ GMAIL

### W Dashboard (po zalogowaniu):

1. Zobaczysz: **"Email Services"** (lewe menu)
2. Kliknij: **"Add New Service"**
3. Zobaczysz listę opcji:
   - Gmail ← **KLIKNIJ TO**
   - Outlook
   - Yahoo
   - ...
4. Kliknij: **"Connect Account"**
5. Wybierz: **julia.mobilnaasystentka@gmail.com**
6. Zaakceptuj
7. ✅ Zobaczysz: **"Service ID: service_xxxxxx"**

### ⚠️ WAŻNE: SKOPIUJ TEN KOD!
```
service_abc123  ← Przykład, Ty będziesz mieć inny
```

**Zapisz go gdzieś** (Notatnik, Notes) - będzie potrzebny za chwilę!

---

## KROK 3: TEMPLATE EMAILA

### W Dashboard:

1. Lewe menu → **"Email Templates"**
2. Kliknij: **"Create New Template"**
3. Wypełnij formularz:

### ✏️ Podstawowe informacje:
**Template Name:** `Formularz Kontaktowy`

### 📧 Email Settings:

**To Email:**
```
julia.mobilnaasystentka@gmail.com
```

**From Name:**
```
Formularz Kontaktowy
```

**Reply-To:**
```
{{email}}
```
⚠️ **Ważne:** Wpisz dokładnie `{{email}}` (z podwójnymi klamrami!)

### 📝 Subject (Temat emaila):
```
🔔 Nowe zapytanie - {{package}}
```

### 📄 Content (Treść emaila):
Skopiuj i wklej dokładnie ten kod:

```html
<h2 style="color: #c5a059;">📬 Nowe zapytanie z formularza kontaktowego</h2>

<div style="background: #f8fafc; padding: 20px; border-left: 4px solid #c5a059; margin: 20px 0;">
    <p><strong>👤 Nazwa:</strong> {{name}}</p>
    <p><strong>📧 Email:</strong> <a href="mailto:{{email}}">{{email}}</a></p>
    <p><strong>📦 Pakiet:</strong> {{package}}</p>
</div>

<h3 style="color: #0f172a;">💬 Wiadomość:</h3>
<div style="background: #f8fafc; padding: 15px; border-radius: 5px;">
    <p>{{message}}</p>
</div>

<hr style="margin: 30px 0;">

<p style="color: gray; font-size: 12px;">
    <strong>Data:</strong> {{current_date}}<br>
    <strong>System:</strong> Mobilna Asystentka<br>
    <strong>IP:</strong> {{ip_address}}
</p>
```

4. Kliknij: **"Save"** (dół strony)
5. ✅ Zobaczysz: **"Template ID: template_xxxxxx"**

### ⚠️ WAŻNE: SKOPIUJ TEN KOD!
```
template_xyz789  ← Przykład, Ty będziesz mieć inny
```

**Zapisz go** obok Service ID!

---

## KROK 4: PUBLIC KEY

### W Dashboard:

1. Lewe menu → **"Account"** (na dole)
2. Znajdź sekcję: **"API Keys"**
3. Zobaczysz: **"Public Key: xxxxxxxxxx"**

### ⚠️ WAŻNE: SKOPIUJ TEN KOD!
```
abcd1234efgh5678  ← Przykład, długi ciąg znaków
```

**Zapisz go** obok dwóch poprzednich!

---

## KROK 5: WKLEJ DO KODU

### Teraz masz 3 kody:
```
Public Key:   abcd1234efgh5678
Service ID:   service_abc123
Template ID:  template_xyz789
```

### Otwórz VS Code:

1. Plik: `public/index.html`
2. Naciśnij: **Ctrl + F** (szukaj)
3. Wpisz: `YOUR_PUBLIC_KEY`
4. Zobaczysz kod (linia ~348):

```javascript
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // <- TUTAJ
})();
```

### Zamień na (PRZYKŁAD):
```javascript
(function() {
    emailjs.init("abcd1234efgh5678"); // Twój Public Key
})();
```

5. Teraz znajdź (Ctrl + F): `YOUR_SERVICE_ID`
6. Zobaczysz (linia ~358):

```javascript
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form)
```

### Zamień na (PRZYKŁAD):
```javascript
emailjs.sendForm('service_abc123', 'template_xyz789', form)
```

### ✅ FINALNY KOD POWINIEN WYGLĄDAĆ TAK:

```javascript
<script>
    // EmailJS Configuration
    (function() {
        emailjs.init("abcd1234efgh5678"); // Twój Public Key
    })();

    var form = document.getElementById("contact-form");
    async function handleSubmit(event) {
      event.preventDefault();
      var status = document.getElementById("form-status");
      var btn = document.getElementById("submit-btn");
      
      btn.innerHTML = "WYSYŁANIE...";
      btn.disabled = true;
      
      // Wyślij przez EmailJS
      emailjs.sendForm('service_abc123', 'template_xyz789', form)
        .then(function() {
          status.innerHTML = "✅ Wysłano pomyślnie! Odpiszę wkrótce.";
          status.style.color = "#22c55e";
          status.style.display = "block";
          form.reset();
          setTimeout(() => {
            btn.innerHTML = "PRZEŚLIJ ZAPYTANIE";
            btn.disabled = false;
            status.style.display = "none";
          }, 5000);
        }, function(error) {
          status.innerHTML = "❌ Błąd wysyłki. Spróbuj ponownie.";
          status.style.color = "#ef4444";
          status.style.display = "block";
          btn.innerHTML = "PRZEŚLIJ ZAPYTANIE";
          btn.disabled = false;
          console.error('EmailJS error:', error);
        });
    }
    form.addEventListener("submit", handleSubmit)
</script>
```

7. **Zapisz plik:** Ctrl + S

---

## KROK 6: TESTUJ!

1. Serwer już działa: http://localhost:3000
2. Przewiń stronę do dołu → sekcja **"Nawiążmy współpracę"**
3. Wypełnij formularz:
   - **Nazwa:** Test
   - **Email:** twoj@email.com
   - **Pakiet:** P3F: Premium Full
   - **Wiadomość:** To jest testowa wiadomość z formularza
4. Kliknij: **"PRZEŚLIJ ZAPYTANIE"**
5. Powinno pokazać się: ✅ **"Wysłano pomyślnie!"**
6. Otwórz Gmail: **julia.mobilnaasystentka@gmail.com**
7. ✅ **Sprawdź skrzynkę odbiorczą!**

---

## 🎯 CHECKLIST

Zaznacz po wykonaniu:

- [ ] Zarejestrowana na EmailJS
- [ ] Połączony Gmail
- [ ] Skopiowany **Service ID**
- [ ] Stworzony Email Template
- [ ] Skopiowany **Template ID**
- [ ] Skopiowany **Public Key**
- [ ] Wklejone 3 kody do `index.html`
- [ ] Zapisany plik (Ctrl + S)
- [ ] Przetestowany formularz
- [ ] Email przyszedł ✅

---

## 🚨 GDZIE SZUKAĆ POMOCY

### Dashboard EmailJS:
https://dashboard.emailjs.com/admin

### Email Log (zobacz wysłane):
Dashboard → Integration → Email Log

### Test Connection:
Dashboard → Email Services → Test Connection

### Support:
https://www.emailjs.com/docs/

---

## ✅ GOTOWE!

Po wykonaniu tych kroków:
- ✅ Formularz działa
- ✅ Emaile przychodzą na Twój Gmail
- ✅ Możesz odpowiadać klientom (Reply-To)
- ✅ 200 emaili/miesiąc za darmo

**Zajęło:** ~3 minuty  
**Prostsze niż:** Gmail App Password  
**Koszt:** Darmowe

🎉 **Strona gotowa do przyjmowania klientów!**
