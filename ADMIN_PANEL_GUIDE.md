# 🎯 Panel Administratora - Kompletny Przewodnik

## 🚀 Dostęp

1. **Otwórz przeglądarkę:** http://localhost:3000
2. **Kliknij:** "Zaloguj się" (prawy górny róg)
3. **Dane logowania:**
   - Login: `j.nowak0703`
   - Hasło: `Julka2001.`

---

## 📊 Dashboard

### Statystyki na żywo:
- **Aktywni Klienci** - liczba klientów ze statusem "active"
- **Zadania (Ten miesiąc)** - zlecenia utworzone w bieżącym miesiącu
- **Przychód** - suma cen pakietów aktywnych klientów

### Lista Klientów:
- Wyświetla wszystkich klientów z podstawowymi informacjami
- Kliknij w kartę klienta aby zobaczyć szczegóły
- Paski postępu pokazują wykorzystanie wizyt

### Auto-refresh:
- Dashboard odświeża się automatycznie co 30 sekund

---

## 👥 Sekcja Klienci

### Funkcje:

#### 🔍 Wyszukiwanie:
- Szukaj po nazwie firmy, emailu lub pakiecie
- Wpisywanie działa w czasie rzeczywistym

#### 🔽 Filtrowanie:
- **Wszystkie** - wszyscy klienci
- **Aktywne** - tylko aktywni klienci
- **Memorium** - tylko klienci w memorium

#### 📝 Szczegóły Klienta (kliknij w kartę):
- **Nazwa firmy** i pakiet
- **Status** (Aktywny/Memorium)
- **Liczniki wizyt:** użyte/limit
  - Kliknij `-` aby zmniejszyć
  - Kliknij `+` aby zwiększyć
- **Liczniki godzin:** użyte/limit
  - Kliknij `-` aby zmniejszyć
  - Kliknij `+` aby zwiększyć
- **Email kontaktowy**

#### 🔄 Akcje:
- **Zmiana statusu:** Przycisk "Memorium" przełącza między active ↔ memorium
- **Usunięcie:** Przycisk "🗑️ Usuń Klienta" - wymaga potwierdzenia

---

## 📋 Sekcja Zadania

### Tworzenie nowego zadania:

1. Kliknij **"+ Nowe Zadanie"**
2. Wypełnij formularz:
   - **Klient:** wybierz z listy aktywnych
   - **Tytuł:** nazwa zadania
   - **Opis:** szczegóły (opcjonalne)
   - **Priorytet:** 
     - Normal - standardowe zlecenie
     - 🚨 Emergency - wymaga późniejszego rozliczenia
3. Kliknij **"Utwórz Zadanie"**

### Filtrowanie zadań:
- **Wszystkie** - wszystkie statusy
- **Nowe** - nierozpoczęte
- **W trakcie** - realizowane
- **Zakończone** - ukończone
- **Odrzucone** - anulowane

### Zarządzanie statusem:

#### Zadanie "Nowe":
- **Rozpocznij** → zmienia status na "in_progress"
- **Odrzuć** → zmienia status na "rejected"

#### Zadanie "W trakcie":
- **Zakończ** → zmienia status na "completed"

### Znaczniki:
- 🚨 Emergency - czerwona ramka, wymaga rozliczenia
- Status badge - kolorowe etykiety statusu

---

## 🚨 Sekcja Emergency

### Co to jest Emergency?
Zlecenia oznaczone jako Emergency wymagają rozliczenia po zakończeniu.

### Rozliczanie Emergency:

1. **Lista nierozliczonych:** pokazuje tylko zakończone Emergency bez rozliczenia
2. **Kliknij "Rozlicz Emergency"**
3. **Wybierz metodę rozliczenia:**

   #### 💰 Dolicz 150 PLN
   - Dodaje 150 PLN do tabeli billing
   - Klient otrzyma fakturę za usługę

   #### 🚗 Wymień na -1 Wizytę
   - Zwiększa licznik `visits_used` o 1
   - Klient płaci wizytą z pakietu

   #### ⏰ Wymień na -2 Godziny
   - Zwiększa licznik `hours_used` o 2
   - Klient płaci godzinami z pakietu

4. Po wyborze Emergency zostaje oznaczone jako rozliczone

---

## 💰 Sekcja Rozliczenia

🚧 **W budowie** - funkcjonalność będzie dostępna wkrótce

Planowane funkcje:
- Historia wszystkich rozliczeń
- Faktury Emergency
- Zestawienia miesięczne
- Eksport do pliku

---

## 🔔 Powiadomienia Toast

System pokazuje powiadomienia w prawym dolnym rogu:

### Sukces (zielone):
- ✅ "Liczniki zaktualizowane"
- ✅ "Status zadania zaktualizowany"
- ✅ "Zadanie utworzone"
- ✅ "Emergency rozliczone: +150 PLN"
- ✅ "Emergency rozliczone: -1 wizyta"
- ✅ "Emergency rozliczone: -2 godziny"
- ✅ "Klient przeniesiony do Memorium/Aktywnych"
- ✅ "Klient usunięty"

### Błąd (czerwone):
- ❌ "Błąd aktualizacji: ..."
- ❌ "Błąd ładowania danych: ..."
- ❌ "Sesja wygasła. Zaloguj się ponownie."

---

## 🛡️ Bezpieczeństwo

### Autoryzacja:
- Wszystkie API wymagają tokenu JWT
- Token weryfikowany przy każdym zapytaniu
- Tylko użytkownicy z `user_type = 'admin'` mają dostęp

### Sesja:
- Token przechowywany w localStorage
- Automatyczne wylogowanie po wygaśnięciu tokenu (24h)
- Redirect do login.html jeśli brak autoryzacji

### Logi:
- Wszystkie zmiany statusu zapisywane w `security_logs`
- Przechowuje: user_id, action, details, ip_address, timestamp

---

## 🎨 Skróty Klawiszowe

(Planowane w przyszłej wersji)
- `Ctrl+K` - Wyszukiwanie klientów
- `Ctrl+N` - Nowe zadanie
- `Esc` - Zamknij modal

---

## 📱 Responsywność

Panel działa na:
- 🖥️ Desktop (1920x1080+)
- 💻 Laptop (1366x768+)
- 🏢 Tablet (zalecane poziome)

---

## 🔧 Rozwiązywanie problemów

### "Sesja wygasła":
→ Zaloguj się ponownie

### "Błąd ładowania danych":
→ Sprawdź czy serwer działa (http://localhost:3000/api/health)

### Liczniki nie aktualizują się:
→ Odśwież stronę (F5)

### Nie widać nowych danych:
→ Zaczekaj na auto-refresh (30s) lub przejdź do innej sekcji i wróć

---

## 📊 Dane Testowe

### Klienci testowi:
1. **Budimex S.A.**
   - Login: `budimex`
   - Hasło: `test123`
   - Pakiet: Premium Full

2. **KGHM Polska**
   - Login: `kghm`
   - Hasło: `test123`
   - Pakiet: Premium Light

3. **Luxury Estate**
   - Login: `luxury`
   - Hasło: `test123`
   - Pakiet: Dobry Start

---

## 🚀 Następne kroki rozwoju

- [ ] Dodawanie nowych klientów przez formularz
- [ ] Edycja danych klienta
- [ ] Import/Export klientów (CSV)
- [ ] Moduł rozliczeń z fakturami
- [ ] System powiadomień email
- [ ] Panel klienta (widok read-only)
- [ ] Kalendarz wizyt
- [ ] Archiwizacja miesięczna
- [ ] E-Archiwum z uplodem plików
- [ ] System wiadomości/czat

---

## 💡 Tips & Tricks

1. **Szybkie filtrowanie:** Użyj wyszukiwarki zamiast scrollować długą listę
2. **Masowe akcje:** W przyszłości będzie można zaznaczyć wiele klientów naraz
3. **Statystyki:** Dashboard to najlepsze miejsce do codziennego przeglądu
4. **Emergency:** Rozliczaj je od razu po zakończeniu, żeby nie zapomnieć
5. **Liczniki:** Aktualizuj je regularnie po każdej wizycie/godzinie pracy

---

**Wersja:** 1.0  
**Data:** 27.12.2025  
**Autor:** GitHub Copilot
