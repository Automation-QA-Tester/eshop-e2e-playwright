# eshop-e2e-playwright

![Playwright Tests](https://github.com/Automation-QA-Tester/eshop-e2e-playwright/actions/workflows/playwright.yml/badge.svg)

Automatizovaná E2E testovacia sada pre e-shop, vytvorená v [Playwrighte](https://playwright.dev) a TypeScripte. Ide o riešenie praktického zadania, ktorého cieľom je navrhnúť udržateľný a rozšíriteľný základ testovacieho frameworku.

Testy bežia proti [Practice Software Testing](https://practicesoftwaretesting.com), demo e-shopu určenému na precvičovanie automatizácie testov.

## Čo sa testuje

| Test | Typ | Čo overuje |
|---|---|---|
| `search-and-cart.spec.ts` | Pozitívny scenár | Vyhľadanie produktu, jeho otvorenie, vloženie do košíka a overenie, že sa v košíku nachádza správny produkt |
| `search-no-results.spec.ts` | Negatívny scenár | Vyhľadanie neexistujúceho produktu a overenie hlášky „There are no products found." a prázdneho zoznamu produktov |
| `cart-price.spec.ts` | Výpočet ceny | Zmena množstva produktu v košíku a overenie, že cena riadku aj celková cena košíka sa rovnajú jednotkovej cene krát množstvo |

Hľadané výrazy a očakávané hodnoty sa načítavajú zo súboru `test-data/products.json`, takže sa dajú meniť bez zásahu do kódu testov.

## Štruktúra projektu

```
.
├── .github/workflows/playwright.yml   # CI pipeline (GitHub Actions)
├── pages/                             # Page Objects (locators a akcie jednej stránky)
│   ├── HomePage.ts
│   ├── ProductPage.ts
│   └── CartPage.ts
├── test-data/products.json            # testovacie dáta
├── utils/price.ts                     # pomocné funkcie (prevod ceny na centy)
├── tests/                             # testovacie scenáre (čo sa overuje)
└── playwright.config.ts               # konfigurácia Playwrightu
```

## Spustenie testov

### Predpoklady

- [Node.js](https://nodejs.org) 22 (LTS) alebo novší
- Git

### Inštalácia

```bash
git clone https://github.com/Automation-QA-Tester/eshop-e2e-playwright.git
cd eshop-e2e-playwright
npm ci
npx playwright install
```

`npm ci` nainštaluje presné verzie závislostí z `package-lock.json`. `npx playwright install` stiahne prehliadače (Chromium, Firefox, WebKit).

### Spustenie

```bash
# všetky testy vo všetkých prehliadačoch
npx playwright test

# len v jednom prehliadači (rýchlejšie)
npx playwright test --project=chromium

# s viditeľným oknom prehliadača
npx playwright test --headed

# interaktívny UI režim na ladenie
npx playwright test --ui
```

### Report

```bash
npx playwright show-report
```

Po každom behu sa vygeneruje HTML report v priečinku `playwright-report/`.

## CI/CD

Testy bežia v [GitHub Actions](.github/workflows/playwright.yml) pri každom pushi do `main`, pri každom Pull Requeste a ručne zo záložky Actions. 

HTML report sa po každom behu ukladá ako artifact `playwright-report` a je dostupný v spodnej časti súhrnu behu workflowu (sekcia **Artifacts**). Po stiahnutí a rozbalení sa dá otvoriť pomocou `npx playwright show-report <priečinok>` alebo priamo cez súbor `index.html`.

## Prístup (approach)

Framework je rozdelený do troch vrstiev, aby bol udržateľný a pripravený na rast:

- **Testy** (`tests/`) opisujú len scenár, čo sa má overiť. Neobsahujú selektory ani technické detaily.
- **Page Objects** (`pages/`) majú pre každú stránku jednu triedu s locators a metódami (`searchFor`, `openProduct`, `addToCart`...). Zmena v UI sa opraví na jednom mieste, nie vo všetkých testoch.
- **Testovacie dáta** (`test-data/`) sú oddelené v JSON, takže sa nemusí meniť kód testov.

Spoločné nastavenia sú v `playwright.config.ts`: `baseURL` (adresa stránky na jednom mieste) a `testIdAttribute: 'data-test'`, vďaka ktorému sa prvky vyhľadávajú pohodlne cez `getByTestId`.

Postupoval som v krokoch: najprv jednoduchý test so všetkým v jednom súbore, ktorý som potom refaktoroval do Page Objects a napojil na dáta. Overenia (`expect`) sú zámerne v testoch a nie v Page Objects. Page Object hovorí, *ako* prvok nájsť a čo s ním spraviť, test hovorí, *čo má platiť*.

## Výzvy (challenges)

### 1. Synchronizácia po vyhľadávaní

Test s hľadaným výrazom `Pliers` prechádzal, hoci bol nesprávne zosynchronizovaný. Produkt `Combination Pliers` je totiž už na úvodnej stránke, takže ho test našiel ešte pred dokončením hľadania. Problém sa ukázal až po zmene na `Hammer`: po kliknutí na Search sa zoznam produktov prepisuje s oneskorením a v tom čase sa na stránke ešte zobrazuje starý zoznam. Test klikol na produkt zo starého zoznamu alebo na nesprávne miesto a padal.

Overenie textu typu „products found" nepomohlo. Pevné pauzy (`waitForTimeout`) som zámerne nepoužil, lebo sú nespoľahlivé: príliš krátke testy rozbijú, príliš dlhé ich spomaľujú. Riešením je čakať na odpoveď servera: metóda `searchFor` pred kliknutím nastaví `waitForResponse` na požiadavku `/products/search` a produkt sa vyberá až po jej doručení.

### 2. Podobné názvy produktov

Produkty majú čiastočne zhodné názvy (`Claw Hammer`, `Claw Hammer with Shock Reduction Grip`, `Claw Hammer with Fiberglass Handle`). Filter podľa podreťazca preto našiel viac produktov naraz. Metóda `openProduct` používa regulárny výraz so zhodou celého názvu, takže vyberie vždy práve ten jeden produkt.

### 3. Potvrdenie množstva v košíku

Po zmene množstva v košíku sa cena riadku prepočíta hneď pri písaní, ale celková cena košíka sa aktualizuje až po opustení poľa: stránka vtedy pošle serveru požiadavku `PUT` na zmenu množstva a následne načíta košík. Playwrightov `fill()` pole neopustí, takže celková cena zostávala na pôvodnej hodnote. Metóda `setQuantity` preto po zápise stlačí `Tab` (ako používateľ) a čaká na odpoveď servera na požiadavku `PUT`. Overenie cien je potom v teste cez `expect.poll`, ktorý hodnotu číta opakovane, kým nesedí.

## Rozhodnutia

- **Page Object Model.** Zadanie požaduje rast (nové testy, stránky a funkcie). Pri stovke testov sa zmena názvu elementu opraví na jednom či dvoch miestach v Page Objects, namiesto úprav v každom teste. Šetrí to čas a predchádza chybám.
- **Dáta v JSON.** Dáta sa dajú dopĺňať a meniť podľa potrieb testu bez zásahu do kódu. Hľadaný produkt je zároveň vždy z jedného miesta.
- **Hľadaný produkt `Hammer`.** Na rozdiel od `Pliers` nie je celý na prvej stránke, takže odhalil problém so synchronizáciou.
- **Iné nastavenie v CI než lokálne** (`playwright.config.ts`): `retries: 2` dá testu pri páde ďalšie pokusy, aby krátkodobý výkyv siete netvoril falošné chyby. `workers: 1` zvyšuje stabilitu a reprodukovateľnosť. `forbidOnly` zlyhá beh, ak niekto v kóde zabudne `test.only`, ktoré by potichu vynechalo ostatné testy.
- **Report sa neotvára automaticky** (`open: 'never'`), aby po zlyhaní neblokoval terminál ani CI.
- **Overenie ceny ako vzťahu, nie ako konkrétnej hodnoty.** Cena produktu sa na demo stránke môže zmeniť, preto test neoveruje absolútnu cenu, ale že cena riadku a celková cena sa rovnajú jednotkovej cene krát množstvo. Ceny sa porovnávajú v centoch ako celé čísla, aby sa predišlo chybám zaokrúhľovania pri desatinných číslach.

## Možný ďalší rozvoj

Pri rastúcom počte testov by som pridal:

- **fixtures**: Page Objects poskytované priamo testom (bez opakovaného `new HomePage(page)`) a before/after logika pre testovacie dáta,
- ďalšie **Page Objects** podľa potreby (prihlásenie, registrácia, kontaktný formulár),
- rozšírenie **utils** o ďalšie pomocné funkcie (napr. generovanie testovacích dát),
- **dátami riadené testy**: zoznam produktov v JSON, z ktorého sa test spustí pre každý produkt,
- **Prettier a ESLint** pre jednotné formátovanie a kontrolu kódu, spúšťané aj v CI,
- **API testovanie** na zrýchlenie prípravy dát a overovania produktov.