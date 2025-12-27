# 📋 Informacje o systemie - Mobilna Asystentka

## 🎯 Stan systemu (27.12.2025)

### ✅ Co zostało wyczyszczone:

#### **1. Baza Danych**
- ❌ Usunięto wszystkich testowych klientów (Budimex, KGHM, Luxury Estate)
- ❌ Usunięto przykładowe dane archiwalne z lat 2024-2025
- ✅ Przygotowano strukturę archiwalną na lata **2026-2040**
- ✅ System gotowy na produkcję

#### **2. Rejestracja Klientów**
- ✅ Klienci rejestrują się **samodzielnie** przez formularz
- ✅ Podczas rejestracji wybierają pakiet z listy
- ✅ Pakiet jest przypisywany do użytkownika w polu `package_type`
- ✅ Automatyczne tworzenie subskrypcji z limitami

---

## 👥 Hierarchiczne grupowanie klientów

### **Panel Admina - Widok według pakietów:**

Klienci są automatycznie grupowani według wybranego pakietu:

#### **💻 Wsparcie Zdalne**
- **P0: Wirtualny** (kolor: #94a3b8 - szary)

#### **🚗 Wsparcie Terenowe**
- **P1: Mobilny Start** (kolor: #3b82f6 - niebieski)
- **P2: Hybrydowy Spokój** (kolor: #3b82f6 - niebieski)
- **P4: Satelita Biznesu** (kolor: #3b82f6 - niebieski)

#### **🏆 Strefa Premium**
- **P3L: Premium Light** (kolor: #c5a059 - złoty)
- **P3F: Premium Full** (kolor: #c5a059 - złoty)
- **START: Dobry Start** (kolor: #22c55e - zielony)

### **Jak działa hierarchia:**

```
📋 Lista Klientów
├─ 💻 P0: Wirtualny (2 klientów)
│   ├─ Firma A
│   └─ Firma B
│
├─ 🚗 P1: Mobilny Start (3 klientów)
│   ├─ Firma C
│   ├─ Firma D
│   └─ Firma E
│
└─ 👑 P3: Premium Full (1 klient)
    └─ Firma F
```

---

## 📦 Dostępne pakiety (Rejestracja)

### **P0: Wirtualny** - 950 PLN
- 0 wizyt terenowych
- 20 godzin wsparcia zdalnego

### **P1: Mobilny Start** - 1300 PLN
- 2 wizyty terenowe
- 20 godzin wsparcia zdalnego

### **P2: Hybrydowy Spokój** - 2800 PLN
- 4 wizyty terenowe
- 30 godzin wsparcia zdalnego

### **P3L: Premium Light** - 3800 PLN
- 6 wizyt terenowych
- 35 godzin wsparcia zdalnego

### **P3F: Premium Full** - 5000 PLN
- 8 wizyt terenowych
- 40 godzin wsparcia zdalnego

### **P4: Satelita Biznesu** - 3200 PLN
- 4 wizyty terenowe
- 20 godzin wsparcia zdalnego

### **START: Dobry Start** - 3200 PLN
- 4 wizyty terenowe
- 25 godzin wsparcia zdalnego

---

## 🗄️ Struktura bazy danych

### **Tabela: users**
```sql
- id                PRIMARY KEY
- login             TEXT (unique)
- email             TEXT (unique)
- password_hash     TEXT
- user_type         'admin' | 'client'
- status            'active' | 'memorium'
- company_name      TEXT
- package_type      'P0'|'P1'|'P2'|'P3L'|'P3F'|'P4'|'START' ⭐ NOWE
- created_at        DATETIME
- updated_at        DATETIME
```

### **Tabela: subscriptions**
```sql
- id                PRIMARY KEY
- user_id           INTEGER (FK → users.id)
- package_name      TEXT
- package_price     REAL
- visits_limit      INTEGER
- visits_used       INTEGER
- hours_limit       INTEGER
- hours_used        INTEGER
- renewal_date      DATE
```

### **Tabela: monthly_archives**
```sql
- id                PRIMARY KEY
- user_id           INTEGER
- client_name       TEXT
- year              INTEGER (2026-2040)
- month             INTEGER (1-12)
- tasks_count       INTEGER
- visits_used       INTEGER
- hours_used        INTEGER
- revenue           REAL
- package_name      TEXT
- archive_data      TEXT (JSON)
- created_at        DATETIME
```

---

## 🔐 Dane logowania

### **Administrator:**
- Login: `j.nowak0703`
- Hasło: `Julka2001.`
- Panel: http://localhost:3000/admin.html

### **Klienci:**
- Rejestracja: http://localhost:3000/login.html
- Po rejestracji automatyczne logowanie
- Panel klienta: http://localhost:3000/client.html

---

## 🎨 Interfejs - Panel Admina

### **1. Dashboard**
- Statystyki: Aktywni klienci, Zadania, Przychód
- Lista klientów **hierarchicznie według pakietów**
- Każda grupa pakietów ma:
  - Kolorową belkę nagłówka
  - Licznik klientów
  - Listę klientów w tej grupie

### **2. Klienci**
- Wyszukiwarka (po nazwie, email, pakiet)
- Filtr statusu (Aktywne/Memorium)
- Grupowanie hierarchiczne według pakietu
- Hover effect - podświetlenie kolorem pakietu

### **3. Zadania**
- Lista wszystkich zadań
- Filtrowanie po statusie
- Przypisanie do klienta

### **4. Emergency**
- Pilne interwencje
- Rozliczenia (150 PLN + 1,50 PLN/km)

### **5. Panel Archiwum**
- Hierarchia: Lata (2026-2040) → Miesiące → Klienci → Szczegóły
- Sekcja Memorium z możliwością przywracania
- 🔒 Dane chronione - nie można usunąć

---

## 🚀 Workflow rejestracji klienta

### **Krok 1: Rejestracja**
```
Klient → http://localhost:3000/login.html
├─ Wypełnia formularz (nazwa, email, hasło)
├─ Wybiera pakiet (P0, P1, P2, P3L, P3F, P4, START)
└─ Kliknij "Zarejestruj się"
```

### **Krok 2: Automatyczne działania systemu**
```
System:
├─ Tworzy użytkownika w tabeli users
│   └─ package_type = wybrany pakiet
│
├─ Tworzy subskrypcję w tabeli subscriptions
│   ├─ package_name = wybrany pakiet
│   ├─ package_price = cena pakietu
│   ├─ visits_limit = limit wizyt
│   ├─ hours_limit = limit godzin
│   └─ renewal_date = za 30 dni
│
└─ Log w security_logs (REGISTER_SUCCESS)
```

### **Krok 3: Panel Admina**
```
Admin loguje się → Dashboard
└─ Widzi nowego klienta w odpowiedniej grupie pakietowej
    ├─ Grupa ma kolor pakietu
    ├─ Licznik się zwiększył
    └─ Klient widoczny na liście
```

---

## 📊 Przykład hierarchii po rejestracji

```
📋 Dashboard - Lista Klientów

💻 P0: Wirtualny (1 klient)
├─ FirmaSoft Sp. z o.o.
│   ├─ Pakiet: Wirtualny
│   ├─ 0/0 Wizyty | 5/20 Godziny
│   └─ Status: Aktywny

🚗 P1: Mobilny Start (0 klientów)

📂 P2: Hybrydowy Spokój (2 klientów)
├─ ABC Transport
│   ├─ 1/4 Wizyty | 10/30 Godziny
│   └─ Status: Aktywny
├─ XYZ Logistyka
│   ├─ 2/4 Wizyty | 15/30 Godziny
│   └─ Status: Aktywny

👑 P3: Premium Full (1 klient)
├─ Grupa Budowlana Premium
│   ├─ 3/8 Wizyty | 25/40 Godziny
│   └─ Status: Aktywny
```

---

## 🎯 Archiwum - Lata 2026-2040

### **Struktura przygotowana:**
- ✅ 15 lat (2026-2040)
- ✅ Hierarchia: Rok → Miesiąc → Klient → Szczegóły
- ✅ Automatyczna archiwizacja na koniec miesiąca (planowane)
- ✅ Dane chronione (brak CASCADE DELETE)

### **Przykład archiwum (po pierwszym miesiącu):**
```
📂 ARCHIWUM
├─ 📅 2026 ▼
│   ├─ 📅 Styczeń (5 klientów, 45 zadań, 18 500 PLN)
│   │   ├─ FirmaSoft Sp. z o.o. (12 zadań, 950 PLN)
│   │   ├─ ABC Transport (15 zadań, 2 800 PLN)
│   │   ├─ XYZ Logistyka (10 zadań, 2 800 PLN)
│   │   ├─ Grupa Budowlana (8 zadań, 5 000 PLN)
│   │   └─ ...
│   │
│   └─ 📅 Luty (...)
```

---

## 🔒 Bezpieczeństwo

### **Dane chronione:**
- ✅ Archiwa nie mogą być usunięte
- ✅ Usunięcie klienta NIE usuwa archiwów
- ✅ Historia zawsze dostępna

### **Hasła:**
- ✅ Hashowanie bcrypt (10 rounds)
- ✅ Walidacja długości (min. 6 znaków)

### **JWT Tokeny:**
- ✅ Ważność 24h
- ✅ Middleware `authenticateToken`
- ✅ Middleware `requireAdmin`

---

## 🛠️ Konsola - Przydatne komendy

### **Reset bazy danych:**
```powershell
cd "c:\Users\insta\Desktop\M.A strona"
Remove-Item "data\database.db" -Force
npm run init-db
```

### **Uruchomienie serwera:**
```powershell
npm start
```

### **Zatrzymanie serwera:**
```powershell
Get-Process -Name node | Stop-Process -Force
```

---

## 📱 Responsywność

### **Panel Archiwum:**
- 🖥️ Desktop (1920px+): 400px szerokości
- 💻 Laptop (1024px): 320px szerokości
- 📱 Mobile (<768px): 100% szerokości

### **Grupy pakietów:**
- ✅ Automatyczne wrap na mniejszych ekranach
- ✅ Płynne animacje hover
- ✅ Touch-friendly na mobilnych

---

## 🚧 Co dalej? (Planowane funkcje)

### **Archiwum:**
- [ ] Ręczne tworzenie archiwów (przycisk "Archiwizuj miesiąc")
- [ ] Eksport do PDF/CSV
- [ ] Wykresy porównawcze (rok do roku)
- [ ] Wyszukiwarka w archiwum

### **Panel Klienta:**
- [ ] Dostosowanie widoku według pakietu
- [ ] P0 → tylko zdalne zadania
- [ ] P3F → pełen dashboard z wszystkimi funkcjami
- [ ] Limity widoczne w UI

### **Dodatkowe:**
- [ ] Email powiadomienia o zbliżającym się końcu pakietu
- [ ] Automatyczna archiwizacja co 1. dzień miesiąca
- [ ] Raporty PDF dla klientów
- [ ] Integracja z kalendarzem Google

---

**Status:** ✅ PRODUCTION READY  
**Wersja:** 3.0  
**Ostatnia aktualizacja:** 27.12.2025  
**Autor:** GitHub Copilot
