# 📂 Panel Archiwum i Memorium - Pełna Instrukcja

## 🎯 Jak używać

### Otwórz Panel
Kliknij przycisk **"📂 ARCHIWUM"** po prawej stronie ekranu (pulsuje gdy są nowe elementy w Memorium)

---

## 📦 Sekcja Archiwum - Hierarchiczna Struktura

### **Poziom 1: Lata (2024, 2025, 2026...)**
- Kliknij na rok aby rozwinąć listę miesięcy
- Lata sortowane od najnowszych
- Automatycznie zliczane z danych

### **Poziom 2: Miesiące**
- Kliknij na miesiąc aby zobaczyć klientów
- Wyświetla statystyki:
  - 👥 Liczba klientów
  - 📋 Liczba zadań
  - 💰 Przychód w PLN
- Miesiące sortowane od najnowszych (Grudzień → Styczeń)

### **Poziom 3: Klienci**
- Lista klientów z danymi z danego miesiąca
- Wyświetla:
  - Nazwa firmy
  - Pakiet
  - Liczba zadań
  - Przychód
- Kliknij aby zobaczyć szczegóły

### **Poziom 4: Szczegóły Archiwum**
Modal z pełnymi danymi klienta za dany miesiąc:
- 📦 Pakiet
- 📋 Liczba zadań
- 🚗 Wykorzystane wizyty
- ⏰ Wykorzystane godziny
- 💰 Przychód
- 📅 Data archiwizacji

**🔒 Ochrona danych:**
Dane archiwalne są **trwale chronione** i nie mogą być usunięte, nawet po usunięciu klienta z systemu.

---

## 💀 Sekcja Memorium

**Co to jest Memorium?**
- Przechowuje nieaktywnych klientów
- Klienci ze statusem "memorium" są tutaj automatycznie wyświetlani
- Dane są zachowane, ale klient nie jest widoczny w głównej liście aktywnych

### **Jak przenieść klienta do Memorium:**

1. **Z Dashboard lub Sekcji Klienci:**
   - Kliknij w kartę klienta
   - W szczegółach kliknij **"💀 Memorium"**
   - Potwierdź akcję
   - Klient pojawi się w panelu Memorium
   - Przycisk Archiwum zacznie pulsować 🔴

2. **Automatyczne powiadomienie:**
   - Czerwony badge pokazuje liczbę klientów w Memorium
   - Przycisk pulsuje aby zwrócić uwagę

### **Jak przywrócić z Memorium:**

1. Otwórz panel Archiwum (📂)
2. Znajdź klienta w sekcji Memorium
3. Kliknij **"↩️ Przywróć"**
4. Potwierdź akcję
5. Klient wraca do statusu "Aktywny"
6. Licznik aktualizuje się automatycznie

### **Informacje wyświetlane:**
- 📛 Nazwa firmy
- 📦 Pakiet
- 📅 Data przeniesienia do Memorium

---

## 🛡️ Bezpieczeństwo Danych

### **Archiwum:**
- ✅ Dane **NIE MOGĄ** być usunięte
- ✅ Usunięcie klienta **NIE usuwa** jego archiwum
- ✅ Zachowane na zawsze dla celów audytu i raportowania
- ✅ CASCADE DELETE wyłączone dla tabel archiwalnych

### **Memorium:**
- ✅ Dane klienta zachowane w pełni
- ✅ Możliwość przywrócenia w każdej chwili
- ✅ Historia aktywności dostępna
- ✅ Liczniki i pakiety niezmienione

---

## 🎨 Interfejs

### **Hierarchiczne rozwijanie:**
```
📅 2025 ▼
  ├─ 📅 Styczeń ▼
  │   ├─ Budimex S.A. (18 zadań, 5000 PLN)
  │   └─ [kliknij aby zobaczyć szczegóły]
  │
  └─ 📅 Grudzień ▼
      ├─ Budimex S.A. (15 zadań, 5000 PLN)
      ├─ KGHM Polska (10 zadań, 3800 PLN)
      └─ Luxury Estate (6 zadań, 3200 PLN)
```

### **Oznaczenia kolorystyczne:**
- 🟡 **Złoty** - Aktywne elementy i akcenty
- 🔵 **Niebieski** - Lata
- 🟢 **Zielony** - Miesiące
- ⚪ **Szary** - Klienci
- 🔴 **Czerwony** - Powiadomienia Memorium

### **Animacje:**
- Płynne rozwijanie/zwijanie (0.3s)
- Chevron (▼) obraca się przy otwarciu
- Hover effects na wszystkich poziomach
- Smooth scroll dla długich list

---

## 📊 Struktura Danych w Bazie

### **Tabela: monthly_archives**
```sql
- id              (PRIMARY KEY)
- user_id         (Integer, klient)
- client_name     (Text, zachowane imię)
- year            (Integer, 2024, 2025...)
- month           (Integer, 1-12)
- tasks_count     (Integer, liczba zadań)
- visits_used     (Integer, wykorzystane wizyty)
- hours_used      (Integer, wykorzystane godziny)
- revenue         (Real, przychód w PLN)
- package_name    (Text, nazwa pakietu)
- archive_data    (Text/JSON, dodatkowe dane)
- created_at      (Datetime, data archiwizacji)
```

**BEZ CASCADE DELETE** - dane są trwałe!

---

## 🚀 API Endpoints

### **Archiwum:**
- `GET /api/tasks/archive` - Lista lat
- `GET /api/tasks/archive/:year` - Miesiące dla roku
- `GET /api/tasks/archive/:year/:month` - Klienci dla miesiąca
- `GET /api/tasks/archive/:year/:month/:userId` - Szczegóły archiwum

### **Memorium:**
- `GET /api/clients` - Zawiera klientów z status='memorium'
- `PUT /api/clients/:id/status` - Zmiana statusu active ↔ memorium

---

## 💡 Tips & Tricks

### **Archiwum:**
1. **Szybka nawigacja**: Kliknij rok → miesiąc → klient
2. **Porównywanie**: Otwórz kilka miesięcy aby porównać wyniki
3. **Raportowanie**: Użyj danych do tworzenia raportów rocznych
4. **Audit trail**: Wszystkie dane historyczne zawsze dostępne

### **Memorium:**
1. **Regularne przeglądanie**: Sprawdzaj co miesiąc czy ktoś nie powinien wrócić
2. **Organizacja**: Trzymaj nieaktywnych osobno od aktywnych
3. **Bezpieczeństwo**: Przenieś do Memorium zamiast usuwać
4. **Reaktywacja**: Szybkie przywrócenie bez ponownego wprowadzania danych

---

## 🔄 Auto-refresh

- ✅ Panel odświeża się co 30 sekund (gdy otwarty)
- ✅ Liczniki aktualizują się automatycznie
- ✅ Powiadomienia sprawdzane w tle
- ✅ Synchronizacja z głównym dashboardem

---

## 🚧 Planowane Funkcje

### **Archiwum:**
- [ ] Ręczne tworzenie archiwów (przycisk "Archiwizuj miesiąc")
- [ ] Eksport do PDF/CSV
- [ ] Wykresy i statystyki porównawcze
- [ ] Wyszukiwarka w archiwum
- [ ] Filtry: rok, miesiąc, klient, pakiet
- [ ] Notatki do archiwów

### **Memorium:**
- [ ] Komentarze przy przenoszeniu do Memorium (powód)
- [ ] Historia zmian statusu
- [ ] Masowe przywracanie (zaznacz wiele klientów)
- [ ] Przypomnienia o klientach w Memorium (>6 miesięcy)
- [ ] Export listy Memorium

---

## 📱 Responsywność

- 🖥️ **Desktop (1920px+)**: Panel 400px szerokości
- 💻 **Laptop (1024px)**: Panel 320px szerokości
- 📱 **Mobile (<768px)**: Panel pełna szerokość ekranu

---

## 🐛 Rozwiązywanie Problemów

### **"Brak zarchiwizowanych danych"**
→ To normalne przy nowym systemie. Dane pojawią się po pierwszej archiwizacji końca miesiąca

### **Liczniki się nie aktualizują**
→ Odśwież panel (zamknij i otwórz) lub poczekaj na auto-refresh (30s)

### **Nie mogę usunąć archiwum**
→ To celowe! Archiwum jest chronione i nie może być usunięte

### **Klient usunięty ale jest w archiwum**
→ Tak ma być! Dane archiwalne są zachowane nawet po usunięciu klienta

---

## 📖 Przykłady Użycia

### **Scenariusz 1: Przenieś nieaktywnego klienta**
```
1. Dashboard → Kliknij "Luxury Estate"
2. Modal → "💀 Memorium"
3. Potwierdź
4. Zobacz notyfikację: "Klient przeniesiony do Memorium" ✅
5. Przycisk Archiwum zaczyna pulsować 🔴
```

### **Scenariusz 2: Przejrzyj historię klienta**
```
1. Kliknij "📂 ARCHIWUM"
2. Kliknij "2024"
3. Kliknij "Grudzień"
4. Kliknij "Budimex S.A."
5. Zobacz pełne dane za Grudzień 2024 📊
```

### **Scenariusz 3: Przywróć klienta**
```
1. Otwórz panel Archiwum
2. Sekcja Memorium → Znajdź klienta
3. Kliknij "↩️ Przywróć"
4. Potwierdź
5. Klient wraca do Dashboard ✅
```

---

**Status:** ✅ W pełni funkcjonalne  
**Wersja:** 2.0  
**Data aktualizacji:** 27.12.2025  
**Autor:** GitHub Copilot
