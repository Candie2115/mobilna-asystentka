# 🚀 JAK POSTAWIĆ STRONĘ NA RENDER.COM

## Będziesz miała adres: **mobilna-asystentka.onrender.com**

---

## KROK 1: Załóż konto na Render (2 minuty)

1. Wejdź na: https://render.com
2. Kliknij **"Get Started"** (w prawym górnym rogu)
3. Wybierz **"Sign Up with GitHub"** LUB **"Sign Up with Email"**
   - Jeśli wybierasz GitHub: kliknij "Authorize Render"
   - Jeśli wybierasz Email: wpisz swój email i hasło

✅ Konto założone!

---

## KROK 2: Przygotuj kod do wysłania (1 minuta)

### Opcja A: Masz już GitHub? (NAJSZYBSZA)

1. Wejdź na: https://github.com
2. Kliknij **"+"** → **"New repository"**
3. Nazwa: **mobilna-asystentka**
4. Kliknij **"Create repository"**
5. W terminalu VS Code wpisz:

```powershell
cd "c:\Users\insta\Desktop\M.A strona"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TWÓJ-USERNAME/mobilna-asystentka.git
git push -u origin main
```

(Zastąp `TWÓJ-USERNAME` swoim username z GitHub)

### Opcja B: NIE masz GitHub? (PROSTSZA)

Po prostu zapamiętaj gdzie masz folder: `c:\Users\insta\Desktop\M.A strona`

---

## KROK 3: Dodaj projekt na Render (3 minuty)

1. Zaloguj się na: https://dashboard.render.com
2. Kliknij **"New +"** → **"Web Service"**

### Jeśli masz GitHub (Opcja A):
3. Wybierz **"Connect a repository"**
4. Znajdź **mobilna-asystentka** i kliknij **"Connect"**

### Jeśli NIE masz GitHub (Opcja B):
3. Wybierz **"Public Git repository"**
4. Wklej: (tutaj musisz wrzucić kod gdzieś - np. GitLab, ale lepiej GitHub)

---

## KROK 4: Skonfiguruj deployment (1 minuta)

Wypełnij formularz:

- **Name**: `mobilna-asystentka`
- **Region**: `Frankfurt (EU Central)`
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: **FREE** (wybierz!)

Kliknij **"Create Web Service"**

---

## KROK 5: Poczekaj na deployment (5-10 minut)

Render zainstaluje wszystko automatycznie. Zobaczysz:
- ⏳ Building...
- ⏳ Deploying...
- ✅ Live!

---

## KROK 6: Twoja strona jest ONLINE! 🎉

Twój adres: **https://mobilna-asystentka.onrender.com**

(Jeśli nazwa mobilna-asystentka jest zajęta, Render zaproponuje: mobilna-asystentka-xyz.onrender.com)

---

## ⚠️ Ważne informacje o darmowym planie:

1. **Strona śpi po 15 minutach nieaktywności**
   - Pierwsze wejście po okresie snu = 30-50 sekund ładowania
   - Potem działa normalnie
   
2. **750 godzin miesięcznie GRATIS**
   - To wystarczy na cały miesiąc jeśli masz regularny ruch

3. **Baza danych SQLite zostanie zachowana**
   - Ale przy każdym redeploy może się zresetować
   - Rozwiązanie: użyj zewnętrznej bazy (PostgreSQL na Render też darmowe)

---

## Jak zaktualizować stronę później?

Jeśli masz GitHub:
```powershell
git add .
git commit -m "Aktualizacja"
git push
```
Render automatycznie wdroży zmiany!

---

## Problemy?

- **Strona nie działa**: Sprawdź logi na Render Dashboard → Twój serwis → "Logs"
- **Baza danych znika**: Skonfiguruj PostgreSQL (też darmowe na Render)
- **Nazwa zajęta**: Użyj mobilna-asystentka-ma lub mobilna-asystentka-julia

---

## Kontakt

Jeśli coś nie działa, wklej screenshot błędu!
