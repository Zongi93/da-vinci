## Da Vinci board game

This will be the thesis work for my degree. As of august 2019, it is playable, but I haven't made the documentation for it yet.

# Documentation (In progress)

For `.uxf` files I used [UMLet](https://www.umlet.com/).

lásd https://www.inf.elte.hu/content/programtervezo-informatikus-bsc-szakdolgozat-tudnivalok.t.1138?m=192
(Bírálat szempontrendszere)

# Bevezetés

Társasjátékokkal mindig jó a kikapcsolódás. Még egyetemi éveim elején ismerkedtem meg egy számomra nagyon élvezetes játékkal, melyben bár szerepet kap a szerencse, nagyban tudja az eredményt befojásolni ha figyelmesek vagyunk a legapróbb elszórt információ morzsákra is. Ez a társasjáték a Da Vinci címet viseli és rengeteg órát játszottam vele az egyetemen szervezett Társas-Szerepjáték Hétvégéken. A játék során információkat kell szereznünk, akár a játék térről, akár korábbi lépésekből, vagy ellenfeleink testbeszédéből.

Szakdolgozatom célja a fent ismertetett társasjáték számítógépre való átültetése. A játékos legyen képes többedmagával különböző eszközökről egymással játszani az interneten keresztül és ezenkívül gépi ellenfelet is lehessen hozzá adni a játékhoz. A gépi ellenfél jelentsen minél nagyobb kihívást és annak működése legyen független a játékos számtól.

A feladatot egy egymástól független szerver-kliens megoldással szeretném megoldani, ahol a szerver futtatja és ellenőrzi a társasjáték lépéseit, a kliensek pedig a felhasználók lépéseit jelenítik meg és közvetítik.

# 2. Felhasználói leírás

## 2.1 Játékszabályok

A játékban egy kódsort állítunk össze számmal és színnel bíró játék elemekből, az alapjáték 0-tól 11-ig tartalmazó játékelemeket tartalmaz két színből, opcionálisan egy kötőjel karakterrel rendelkező elemet is használhatunk színenként. A játék folyamán minden egyéni kódsorban a számoknak növekvő sorrendben kell lenniük, amennyiben két azonos számmal bíró elemünk is van, akkor valamelyik szín mindig precedenciát élvez a másikhoz képest.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/165978886-1f450938-bf8d-4075-b80c-2ddc1f85f640.png />
   <figcaption align="center"><b>Da Vinci társasjáték</b></figcaption>
</p>
A játék elején helyezzük az összes elemet megkeverve és számmal lefordítva az asztal közepére. Ezután játékos számtól függően tetszés szerinti színből 4 vagy 3 elemet húzzon minden játékos magához, fordítsa fel ügyelve, hogy más az értéket ne lássa, és állítsa fel az elemeket az előbbiek szerint növekvő sorrendbe.
A kezdő játékos ezután rámutat valamelyik ellenfél számára rejtett elemre és mond egy számot. Amennyiben eltalálja a mutatott elem értékét a birtokos játékos azt lefordítja, a játékos aki tippelt pedig dönthet, hogy tippel tovább vagy megáll és magához húz az asztal közepéről egy elemet és beilleszti azt a kódsorába a megfelelő helyre úgy, hogy csak ő lássa az értéket.
Amennyiben az eredeti tippje a játékosnak nem volt jó, vagy úgy döntött, hogy folytatja a tippelést és bármelyik későbbi tippje helytelen volt akkor szintén egy középről húzott elemet kell beilleszteni a kódsorba, viszont oly módon, hogy annak számlapja minden játékos számára is látható legyen. Ha a játékos abba hagyta a tippelést, akkor a soron következő játékos jön a saját tippjével hasonló módon.
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/165978704-ce89c4a7-2ece-4d89-b753-50a4c1f7d322.png />
   <figcaption align="center"><b>Da Vinci társasjáték játék közben</b></figcaption>
</p>
Ha egy játékosnak minden kód eleme ki lett találva, akkor kiesik a játékból. A játéknak akkor van vége ha már csak egy játékosnak van olyan kódsora mely nem teljesen ismert.

## 2.1 Rendszer követelmények

A játékhoz két komponensre, egy szerver és egy kliensre van szükség. Egy szerverre fizikai kapacitástól függően bárhány klienst és játékot ki tud szolgálni ezért a legtöbb esetben elegendő futtatni egy szervert. A kliens alkalmazás egy weboldal amelyet a szerverrel azonos gépen kell hosztolni.

**Kliens követelmények**

A játékhoz a kliensnek nincs másra szüksége mint egy olyan eszközre amely képes egy modern böngészőt futtatni (Firefox vagy bármilyen Chromium alapú böngésző). Ezután a játékot könnyedén el lehet érni a szerver ip címén a 4200-as porton. (Például `http://localhost:4200/`)

**Szerver követelmények**

A szerver futtatásához a [futtatandó kódot innen lehet letölteni](https://github.com/Zongi93/da-vinci). A szerver két komponents kell futtasson, egy frontend komponenst és egy backend komponents. Mindkét komponens futtatásához [Node.js](https://nodejs.org/en/) környezetre van szükség, a szervernek képesnek kell lenni ennek a környezetnek a támogatására.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/165994137-a05c34d1-87c1-48ef-a8b6-f1851f394f8f.png />
   <figcaption align="center"><b>Helyesen telepített Node.js környezet</b></figcaption>
</p>

Ha telepítve van `Node.js` környezet és az `npm` csomagkezelő a képen szereplő verziókkal (bizonyos esetekben magasabb verziók is megfelelhetnek, de a szoftver a fent mutatott verziókon volt futtatva és tesztelve), akkor a következő lépés két terminál megnyitása a projekt gyökérkönyvtárában és elindítani a szervert az alábbiak szerint. (`npm install` parancsot elegendő első indításnál kiadni)

**Első terminál:**

```
cd backend/
npm install
npm run serve
```

**Második terminál:**

```
cd frontend/
npm install
npm run start
```

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166005103-d8c04843-e4e4-4eb0-9f12-bcacc330db95.png />
   <figcaption align="center"><b>Helyesen futó szerver</b></figcaption>
</p>

_**Megjegyzés:** A való világban egy szerver futtatására a fent említett parancsok nem lennének elégségesek, mert bár a dolgunk így egyszerű és praktikus, a fent használt parancsok a fejlesztési és tesztelési folyamat megkönnyítésére valóak inkább. Való világban így futtatni egy éles rendszerben használt szervert felelőtlen és veszélyes lenne._

## 2.3 Felhasználói felület és a program használata

Ha rendelkezünk egy helyesen elindított szerverrel és egy eszközzel ami lokális hálózaton eléri a szervert és képes futtatni egy modern böngészőt (pl Chrome), akkor navigáljunk a szerver ip címére és a 4200-as porton megtaláljuk a futó alkalmazásunkat. (Pl http://192.168.50.159:4200/)

_**Megjegyzés:** Amennyiben az alkalmazás nem érhető el bár látszólag fut a szerveren, akkor forduljunk rendszer karbantartójához segítségért, valószínűleg egy fordított proxy szolgáltatás fut a szerveren ahova be kell regisztrálnunk az alkalmazásunkat, hogy engedélyezze annak elérését._

Az alkalmazás sikeres elérése után az alábbi köszöntő képernyőt fogjuk látni, itt mást nem kell tennünk csak meg kell adnunk egy egyedi felhasználó nevet.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166268099-b631cdd9-8d61-4daa-9e5c-8bf36126919d.png />
   <figcaption align="center"><b>Köszöntő oldal</b></figcaption>
</p>
A következő nézetben az összes asztalt látjuk, ahova van lehetőségünk csatlakozni ott ezt egy gomb nyomással meg is tehetjük. Ezen kívül vagy ha nincs ilyen asztal még egy gombot látunk amivel csatlakozás helyett egy új asztalt kreálunk magunknak a mi vezetésünkel.
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166574470-fdab530b-09d0-46b8-aa4b-6a493daefdbc.png />
   <figcaption align="center"><b>Asztal választó nézet</b></figcaption>
</p>
Az asztal nézetben azt látjuk hányan ültünk eddig az asztalhoz, név szerint fel sorolva, ezen kívül látjuk hány gép ellenfelet adtak a játékhoz, látjuk a választott játékot is és a játékról pár alap információt. Gépi ellenfelet kizárólag az a játékos adhat hozzá a játékhoz aki az asztalt "vezeti", ezen kívül a játékot is csak a "vezető" játékos tudja elindítani. 
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166574565-e46bd666-e61b-4b31-88a0-19c245e386fd.png />
   <figcaption align="center"><b>Választott asztal nézet</b></figcaption>
</p>
A Da Vinci játék nézetében a képernyő alján látjuk a saját kódsorunkat, jobb oldalt a játék cset-jét látjuk amiben a korábbi lépések is el olvashatóak. A képernyő maradék részén pedig ellenfeleink kódsorait láthatjuk. Ha színt vagy extra akciót kell választanunk egy felugró ablakkal megtehetjük azt. Tippet úgy tehetünk hogy a megfelelő lapkán kiválasztjuk a tippelni való számot és megnyomjuk a kártyán megjelenő gombot. 
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166574958-db7d55e6-0a68-4318-9c0b-5f47880a29b6.png />
   <figcaption align="center"><b>Da Vinci játék közben nézet</b></figcaption>
</p>

Ha bármikor megszakadna az internet kapcsolat játék közben, egy oldal frissítéssel/újra töltéssel azonnal visszatérhetünk a játék folytatásához. Játék végén a játék kiírja a nyertest és vissza kerülünk a tábla választó nézetre.

# 3. Fejlesztői leírás

## 3.1. Elemzés

### 3.1.1. Feladat leírás

Jelen szakdolgozatom céljai:

- A 2.1-es fejezetben részletezett játékszabályokkal rendelkező társasjáték megvalósítása
- A játékot egyszerűen böngészőből, bármilyen speciális program telepítését nélkül tudjuk játszani.
- A játékot barátainkal tudjuk játszani a helyi hálózaton különböző kliensekről.
- Legyünk képesek gépi ellenfeleket hozzáadni a játékhoz.
- A gépi ellenfelek nyújtsanak kihívást.

### 3.1.2. Funkcionális leírás

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166482988-f1ce1b99-ae0f-43fc-a7c9-b836d114cfac.png />
   <figcaption align="center"><b>Felhasználói eset diagram</b></figcaption>
</p>
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/167259212-083f6b01-1b59-4ac6-b1bb-be4a7d0cc8db.png />
   <figcaption align="center"><b>Felhasználói történet</b></figcaption>
</p>

A kész programnak a fenti képeken mutatott funkciókkal kell rendelkeznie a felhasználók számára. Kiemelendő különbség a való élettel szemben, hogy a játék megvalósítása miatt nincs szükség arra, hogy a tippeket az adott játékos ellenőrizze, hanem ezt a szerver végzi mindenki helyett.

### 3.1.3. Nem-funkcionális leírás

A tervezés során a következő szempontokat támasztjuk elvárásul a megvalósított program iránt. Ezen szempontokra fordítsunk kiemelt figyelmet.

Főbb szempontok:

- Az alkalmazás ne legyen platformfüggő.
- Az alkalmazás támogasson több képernyő méretet és beviteli módszert.
- Legyen az alkalmazás stabil az internet kimaradással szemben.
- Alapvető kiberbiztonsági megoldásokat valósítsunk meg elvi szinten.
- Célpont, hogy a megoldás könnyen bővíthető legyen más társasjátékokkal.
- Legyen elfedve, hogy a játékos gépi vagy emberi.
- A kliens és szerver közti kommunikációra használjunk REST végpontokat és websocket kapcsolatot.

## 3.2. Tervezés

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/167267666-f41ec2dd-d0da-4030-b345-ce39f0600e49.png />
   <figcaption align="center"><b>Magas szintű ábrázolása a teljes architektúrának</b></figcaption>
</p>

A fenti ábrán látható az arhitektúra felületes ábrázolása. Mind a két komponensben hasonló struktúrával szeretnénk, külön kommunikációs réteget és külön adattárolás és logikáért felelős réteget. Ezen kívül a frontend biztosítja még a felhasználó felé a felület megjelenítését, és a felhasználói interrakciók fogadását.

### 3.2.1 A Backend komponens tervezése

### 3.2.1.1 Architektúra

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166569875-4032895d-5f09-4c6e-8abc-ba83edde70af.png />
   <figcaption align="center"><b>A Backend komponens REST API használata</b></figcaption>
</p>

A Backend komponens tervezésekor a filozófia a következő volt:

- Az alapvető kommunikáció folyjon REST-en és csak értelem szerűen egészítsük ki a funkciókat websocket használatával.
- Minden végpont amely pusztán csak adatot olvas (GET) legyen hozzáférhető autentikálás nélkül is.
- Használjunk `CSRF-token`-t annak ellenőrzésére, hogy kizárólag a saját frontendünk küldhet nekünk olyan kérést ami adatot is módosít (POST).
- A felhasználó megállapításához írjunk és olvassunk egy `http-only` beállítással rendelkező sütit (kliens csak olvasni képes).
- A megfelelő autentikáció és autorizáció ellenőrzését végezzük middleware komponensekben.
- Értelem szerűen bontsuk szét a feladat körök és felelősségek mentén a végpontokat külön csoportokra, és tegyük azoknak kezelését külön singleton osztályokba.
- Azonos csoportokban lévő végpontoknak legyen egy közös prefix-e az elérési útvonalban.
- Szoruljunk minél kevésbé a frontend által szolgáltatott (ezáltal hamisítható) információkra. Például azt hogy melyik felhasználó intézi az adott kérést ne egy paraméterként kérjük, hanem használjunk csak a szerver által módosítható sütiket, és használjuk azt a felhasználó azonosítására.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166662648-ac9e4ad9-7738-42d5-8f4e-e1e177cf44e1.png />
   <figcaption align="center"><b>A különböző végpontok részletezése felhasználás szerint</b></figcaption>
</p>

**\*Megjegyzés:** Ahol nincsen várt adat, ott a szerver elegendő információt tud szerezni a regisztrált sütikből, és abból melyik végpont-ra érkezett a kérés.\*

### 3.2.2. Modell

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169716990-11a107c0-9cb0-4763-bff4-530dd79559c4.png />
   <figcaption align="center"><b>A különböző végpontok részletezése felhasználás szerint</b></figcaption>
</p>

**\*Megjegyzés:** Minden osztály minden publikus adattagja nyelv által támogatott readonly módban legyen, azaz az objektum konstruálásánál beállíthatóak egy értékre, de utána már mindenki csak olvasni tudja a beállított értéket.\*

**Game::Table osztály**

Célja egy asztal minden funcióját mely felelősségi körök mentén jól elkülöníthető megvalósítani. Lehetőséget kell biztosítania játékosok csatlakozására, gépi ellenfelek számának módosítására és a játék elindítására.

- id : number - Egyedi azonosítót biztosít az asztalok megkülönböztetésére
- nOfAiOpponents : number - Az asztalhoz hozzáadott gépi ellenfelek száma
- players : User[] - Az asztalhoz csatlakozott felhasználók listája
- game : TableGame - Az asztalnál játszani kívánt játék

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169702255-ad53e9da-a51e-4311-a4b7-c7693ea7c36c.png />
   <figcaption align="center"><b>Table osztály függvényei</b></figcaption>
</p>

**Game::User osztály**

Célja információt szolgáltatni a különböző csatlakozott játékosokról.

- id : number - Egyedi azonosítóval látja el a felhasználókat
- userName : string - Adott felhasználó neve

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169717021-d7a7649c-823f-4964-aa66-5451030288a1.png />
   <figcaption align="center"><b>Game::User osztály függvényei</b></figcaption>
</p>

**Game::TableGame absztrakt osztály**

Célja alapvető információt szolgáltatni a különböző játékokról. Biztosítja annak lehetőségét, hogy a kiválasztott játék pontos ismerete nélkül meg tudjuk kérdezni, hogy elindítható e a játék, és lehetőséget ad a válaszott játéknak az elindítására is.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169702270-fc0b5d96-ae0c-40c1-acbb-8081ab0b3df3.png />
   <figcaption align="center"><b>Game::TableGame osztály függvényei</b></figcaption>
</p>

**Game::TableGameInfo osztály**

- gameTitle : string - A játék elnevezése
- minPlayer : number - A játék szabályai szerinti minimum játékos szám
- maxPlayer : number - A játék szabályai szerinti maximum játékos szám
- aiSupport : boolen - Támogatja e a játék megvalósítása gépi ellenfelek hozzáadását

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169702285-44d1be2f-f506-4046-abbf-2ecbdd61644b.png />
   <figcaption align="center"><b>Game::TableGameInfo osztály függvényei</b></figcaption>
</p>

**DaVinci::TableGameService osztály**

Feladata a teljes Da Vinci játék ellenőrzött szabály szerinti lebonyolitása, az ő felelőssége minden ami ehhez szükséges, tehát a kód elemek inicializálása, a játékosok sorrendjének megállapítása, a körök lebonyolítása, a játékos lépésének ellenőrzése, nyilvántartani a még életben lévő játékosokat, kódelemek húzása kérésre megfelelő színben és a játék vége állapot észlelése és lekezelése.

- activeActor : number - Az aktuális játékos indexe az actors listában
- freePieces : GamePiece[] - Azon kód elemek halmaza amelyeket még nem húzott fel egyik játékos sem.
- actors : Actor[] - A játékban résztvevő játékosok listája

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169702316-b9da5eb6-378f-4313-8dde-044e3b923ea6.png />
   <figcaption align="center"><b>DaVinci::TableGameService osztály függvényei</b></figcaption>
</p>

**DaVinci::GamePiece osztály**

Feladata tárolni az egy kódelemre vonatkozó minden információt és végrehajtani annak ellenőrzött állapot átmeneteit a kód elem életciklusa alatt.

- id : number - Egyedi azonosítója a kódelemnek
- number : number - A kódelem szám értéke (Alap szabályok szerint 0 és 11 közötti)
- color : PieceColor - A kódelem szine (Alap szabályok szerint fehér és fekete)
- state : PieceState - A kódelem állapota (nem ismert, privát, publikus)

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169702296-c00a7318-6678-4119-b9f8-5ad397b985c0.png />
   <figcaption align="center"><b>DaVinci::GamePiece osztály függvényei</b></figcaption>
</p>

**DaVinci::Actor absztrakt osztály**

Felelőssége a kódsor rendben tartása, új elem megfelelő helyre való beszúrása, azon tippek ellenőrzése ahol ezen Actor kódelemére vonatkozott a tipp. Továbbá felelősség a játék által kért lépéseknek végrehajtatása. Ezen funkcióra absztrakt függvényeket használunk, melyek különböző játékos típusoknál különféle implementációt kapnak, ezáltal kiszolgálva a játékos típus egyedi igényeit.

- id : number - Egyedi azonosító az actoroknak
- ownedPieces : GamePiece[] - Az actor által birtokolt kódelemek rendezett tömbje.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169702305-495dbcaa-580c-467f-99ba-6117cb56f0dc.png />
   <figcaption align="center"><b>DaVinci::Actor osztály függvényei</b></figcaption>
</p>

**DaVinci::Player osztály**

Az Actor absztrakt osztály megvalósítása emberi játékos számára. Feladata a kért lépések kommunikálása websocketen keresztül a kliens felé és a válasz lépések továbbítása a TableGameService felé. További feladata esetleges kapcsolat bontás esetén szinkronizálni az állapotokat. A tényleges állapotot is ő tartja számon, a kliens egyoldalúan/szabályokat meg kerülve azt nem tudja megváltoztatni. Részletesebb ismertetésre a 3.2.4-es fejezetben kerül sor.

**DaVinci::Computer osztály**

Az Actor absztrakt osztály megvalósítása gépi ellenfél számára. A működés részletes ismertetésére egy külön (3.2.5) fejezetben kerül sor.

**DaVinci::Guess osztály**

Feladata az egy tipp-hez tartozó minden adatot tartalmazni. Külön logikát nem végez.

- actorId : number - A cél actor egyedi azonosítója, akinek az elemére tippelünk
- position : number - Az kódelem indexe a sorban
- value : number - A tippelt érték

### 3.2.3. Nézet tervek

Az oldal első megnyitásakor a köszöntő oldalt fogjuk látni, ennek pusztán annyi lenne a célja, hogy a felhasználóhoz választhasson egy egyedi felhasználó nevet. Belépés után a felhasználó az asztal választó nézetre kerülne automatikusan.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166516012-6f51703a-29ce-4d2c-aa47-1f2449c3f850.png />
   <figcaption align="center"><b>Köszöntő oldal</b></figcaption>
</p>
Ezen a nézeten jelenítenénk meg az elérhető asztalokat, sorolnánk fel az azokhoz csatlakozott játékosokat, és adnánk lehetőséget, hogy a jelenlegi felhasználó új asztalt hozhasson létre.
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166268407-de8bbc6d-1056-4a99-8f0d-364add0f4886.png />
   <figcaption align="center"><b>Asztal választó nézet</b></figcaption>
</p>
Ezt a nézetet látnánk akkor ha csatlakozunk egy asztalhoz és várunk arra, hogy az elinduljon. Ha mi kreáltuk az asztalt akkor extra funkciók érhetőek el a felületen található gombok segítségével, mint például el tudjuk indítani a játékot és tudunk gépi ellenfeleket hozzáadni vagy elvenni az asztalhoz.
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166269319-7b4df74b-004f-4a7c-b01f-c527d7eaf70d.png />
   <figcaption align="center"><b>Választott asztal nézet</b></figcaption>
</p>
Alább a Da Vinci játék tervezett nézete látható, a saját kódsorunk a nézet alján, egy chat log a nézet jobb szélén és az ellenfelek kódsorai a maradék rendelkezésre álló helyen látható. Tippeléshez a kódkártyákon elhelyezett extra felületi elemeket használhatjuk majd. Extra akció vagy szín választáshoz egy felugró ablakot fogunk mutatni az aktuális játékosnak.
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166269704-939ac84b-d2a1-4ccf-a71d-21d04a6fe193.png />
   <figcaption align="center"><b>Da Vinci játék közben nézet</b></figcaption>
</p>

### **3.2.4. A játék lebonyolításának terve**

Mivel a játék megköveteli a folyamatos kétirányú kommunikációt, ezért elengedhetetlen a websocket technológia használata. Legyen minden kliens felé egy egyedi websocket kapcsolatunk és legyünk képesek klienseknek különböző üzeneteket küldeni. A rendszerezett működéshez használjunk úgynevezett topik alapú kommunikációt a websocket csatornán, ezzel az érdeklődési körök mentén elvágva jól elkülöníthető eseményekre lehet lebontani a kommunikációt. Topik alapú kommunikációnál általában a websocket kiépítéséért felelős service fogad minden üzenetet és a regisztrált topikok alapján delegálja az üzenetek feldolgozását az arra feliratkozott komponenseknek.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169838339-f11053bf-647a-4acb-8fa5-6188bea4ff2a.png />
   <figcaption align="center"><b>Websocketen folyó topik alapú kommunikáció részletezése</b></figcaption>
</p>

A fenti táblázatban a teljes websocketen folyó kommunikáció látható. Használjuk a teljes tábla lista szinkronizálására minden kliensnél, és továbbá használjuk a teljes játék lebonyolitására. Olyan topikok mint `guess`, `pick-color`, `take-extra-action` és `game-over` jól megfeleltethetőek a `DaVinci::Actor` osztály aszinkron függvényeinek, melyek valamilyen interakciót várnak a játékostól. A játék logika által kért lépések ily módon vannak kommunikálva a megfelelő kliens felé és ugyanezen topikok használatával is válaszol ezen kérésekre a kliens.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/167702507-2e8bf9f0-b911-4108-b578-6ab61d8720fc.png />
   <figcaption align="center"><b>Felhasználót igénylő lépések lebonyolitása</b></figcaption>
</p>

Felhasználót igénylő interrakciók lebonyolitása szemléletesen a fenti ábrán látható. A `GameDaVinciService` meghívja az `Actor` absztrakt osztály egyik függvényét, az alapján hogy adott `Actor` gépi ellenfél e vagy rendes játékos, annak függvény implementációjában különbség lesz. Gépi ellenfél esetén azonnal megválaszoljuk a kérést, emberi ellenfélnél websocketen a megfelelő topik használatával jelezzük a kliens felé, hogy továbbítsa a kérdést a felhasználó felé. A kliens ekkor a játék felületén valamilyen módon jelzi a kérelmet és lehetőséget biztosít annak megválaszolására is, például egy felugró ablakkal amely mutatja a választható színeket mint gombok. Ha felhasználó választott, akkor a kliens a kéréssel azonos topikot használva válaszol a kérésre a szervernek melyet a `Player` osztály fogad, és válaszként továbbítja a `GameDaVinciService` felé ami ekkor értékeli a választ és a következő lépéssel folytatja a játék lebonyolítását..

### **3.2.5. Gépi ellenfél**

A gépi ellenfél tervezésekor a filozófia a következő volt:

- Minden döntésnél állítsunk elő egy valószínűségi változót, ezzel el kerülve a determinisztikus működést.
- A valószínűségi változók előállításához használjunk erős heurisztikát amivel a játék állapotát jellemezni tudjuk.
- A heurisztikák oly módon jelemezzék a helyes lépést, hogy ha minél helyesebbnek gondolunk egy lépést, annál jobban tendáljon a valószínűségi változónk annak a lépésnek irányába.

 <p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169714927-d3e3e211-9c19-4f12-99f7-b4ec975e0433.png />
   <figcaption align="center"><b>Az osztály diagram kiegészítése a gépi ellenfél megvalósításához</b></figcaption>
</p>

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169714513-5d3af9d6-f192-4a14-b74f-c0b2a904b312.png />
   <figcaption align="center"><b>DaVinci::ComputerLogic osztály függvényei</b></figcaption>
</p>

A Gépi ellenfél logikáját egy külön `DaVinci::ComputerLogic` osztályban valósítottuk meg. A `DaVinci::Computer` osztály minimális felelősséggel rendelkezik szemben a `DaVinci::Player` osztállyal, hiszen itt csupán egy szinkron időben futtatott fügvény hívással választ tudunk adni a kérésre míg `DaVinci::Player` osztályban a websocketen való kommunikáció miatt rengeteg extra munkánk volt. Például játék vége esetén egy játékostól elvárjuk, hogy erre reagáljon, de ilyen elvárásunk gépi ellenfelé természetesen nincsen.

A játék szempontjából három esetben van szükségünk a `DaVinci::ComputerLogic` által megvalósított kiértékelő logikára:

- Ha tippet kell tennie
- Ha színt kell választania
- Ha extra akciót kell választania

### **A gépi ellenfél tipp számolásának ötlete:**

Vegyük az összes kód elemet melyek az ellenfelek kódsoraiban vannak még privát állapotban, a már felfedett kódelemek felhasználásával és a saját kódsorunk felhasználásával számoljuk ki ezen összes elemekre a szabályoknak megfelelő lehetséges értékeket. Vegyük azt az elemet, amelynél a legkevesebb opció van és tegyünk egy tippet az egyik opciót felhasználva.

**Példa:**

- Ellenfelünk 2. kódelemének értékei minden információnk és a szabályok szerint lehet: 4,5,6
- Minden más eleménél három darabnál több lehetséges értéket állapítottunk meg.
- Tegyünk egy tippet a 4,5,6 opciók egyikét felhasználva az ellenfelünk 2. kódelemére.

**E megoldás hiányosságai:**

- Nem használ fel információt a játék korábbi lépéseiből ("nincs memória")

### **A gépi ellenfél szín választásának ötlete:**

Vegyük a játékosok kódsorait és számoljuk meg melyikük melyik színből mennyi információval rendelkezik. Ezután a `mapColorToDesire` függvény segítségével állapítsuk meg, melyik szín adhat nekünk több információt vagy jelent nagyobb veszélyt. Figyeljünk arra, hogy ha minden elem egy színből fel van húzva csupán két játékos által, akkor ők ketten könnyedén kitalálhatják egymás kódsoruk adott színben lévő elemeiknek értékét.

A `mapColorToDesire` függvényben alkalmazzunk heurisztikát:

 <p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169799785-ba8cceec-42d4-4bf2-9e6b-71bee1032013.png />
   <figcaption align="center"><b>Heurisztikát segítő függvények</b></figcaption>
</p>

- Abban az esetben ha egy színből még sok elem van a "húzódobozban", akkor azt a színt tartsuk érdekesnek amiből a legtöbbel rendelkezünk ügyelve arra, hogy viszont ne húzzuk fel az összes elemet a színből. (Ábrán kék függvény)
- Abban az esetben ha egy színből már kevés elem van a húzódobozban, akkor ha nekünk nagy a kitettségünk ebből a színből akkor ne akarjuk belőle húzni, viszont ha másik játékos kitettsége nagy és nekünk elenyésző, akkor törekedjünk felhúzni a maradék elemeket a színből, hiszen ha minden elem játékban van egy színből akkor könnyedén megfejthetjük a teljes kódsorát az ellenfelünknek. (Ábrán narancssárga függvény)

Miután minden színre és játékosra kiszámoltuk a húzási vágy értékét, akkor átlagoljunk, normalizáljunk és a színekből készítsünk egy valószínűségi változót majd annak használatával válasszunk színt.

**Példa:**

- Vegyünk egy két játékos játszmát ahol színt kell választanunk egy helyes tippünk után.
- Fehér színből nálunk 5 darab van, ellenfelünknél 2, a dobozban még 5.
- Fekete színből nálunk 3 darab van, ellenfelünknél 6, a dobozban még 3.
- Fehér színből mi az elemek 5/12 százalékát birtokoljuk (~0.4116), a dobozban még elegendő elem van tehát a kék függvényt használva a húzási vágyunk kb 77%.
- Fekete színből mi az elemek 3/12 százalékát birtokoljuk (0.25), a dobozban már kevés elem van tehát a narancssárga függvényt használjuk: 70%
- Mivel csak egy ellenfelünk van ezért az átlagoló lépésre ellenfelenként számolt értékekre most nincs szükség.
- Normalizáljuk a kapott értékeket és készítsünk egy valószínűségi változót: 52.3%-ban húzzunk fehéret, 47.7%-ban feketét.
- Dobjunk egy kockával véletlenszerűen generálva egy értéket 0 és 100 között, legyen eredménye `x`, ha `x` értéke 52.3% alatt van, akkor fehéret kérjünk, ha nagyobb akkor feketét.

**E megodás hiányosságai:**

- Nem veszi figyelembe, hogy a húzott kódelem privát vagy publikus lesz-e.
- Talán pontosabb képet kaphatnánk, ha minden húzható elemre kiszámolnánk, hogy tippelésnél melyik húzott kártya birtokában könnyebbülne meg legjobban a dolgunk, ezt színekre összegeznénk és ennek fényében döntenénk a színről.

### **A gépi ellenfél extra akció választásának ötlete:**

Számoljuk ki, hogy a jelen helyezetben milyen tippet tennénk, nézzük meg milyen magabiztosak vagyunk ebben a tippben, ha biztosabbak vagyunk a tippben mint amekkora maximális kockázatot aktuálisan vállalnánk, akkor válasszuk az extra akciók közül a tipp megtételét, ha túl nagy kockázatnak véljük akkor kérjünk kód elemet helyette inkább.

Magabiztosságot számolni a legjobb tippünkhoz egyszerű, csak meg kell nézni hány lehetséges értéket vehet fel a tippelni kívánt elem és vesszük a darabszám reciprokát.

A `certantyThreshold` függvény avagy kockázatvállaló késség számolásához használt heurisztika:

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169833104-2855fa99-edc5-4fc1-b248-e8aaf5e12a27.png />
   <figcaption align="center"><b>A játék lefolyásának részleges folyamatábrája</b></figcaption>
</p>

Ha még a játék elején vagyunk, akkor kevés kockázatot kell vállalnunk, a játék vége felé viszont már nagyobb kockázatot is vállalunk.
A kapott értéket még minimálisan el toljuk annak függvényében, hogy jelenleg hány életünk van, azaz hány olyan elem van a kódsorunkban amelyek még privát állapotban találhatóak.

**Példa:**

- Sikeresen tettünk egy tippet, választhatunk, hogy extra akcióként tovább tippelünk vagy húzunk egy kód elemet.
- Mivel a játék csak most kezdődött, ezért csak az elemek 30% van játékban. (8 elem a 24-ből)
- A certantyThreshold függvényünk 100%ban biztos tippnél vállalná a kockázatot.
- Mivel ilyet a játék elején valószínűleg nem ismerünk, inkább válasszuk a kód elem húzását extra akcióból.

**E megodás hiányosságai:**

- A gépi ellenfél talán túl konzervatív, nem elég merész.
- A gépi ellenfél csak becsüli azt, hogy veszíthet e a következő körben, ténylegesen nem "szimulálja le". Valószínűleg ezáltal pontosabb eredményt kaphatnánk pedig.

## 3.3. Megvalósítás

eltérések a tervtől, hol kellett gányolni a tervhez képest

### **3.3.1. Felhasznált technológiák**

### **Backend:**

A backend komponens megvalósításához `Express.js` keretrendszert használtunk, amely a REST szerver megvalósításában játszott nagy szerepet. A websocket szerver kezeléséhez `Socket.IO` szervert használtunk. Ezen kívül érdemes még megemlíteni az `RxJS` könyvtárat mely az adatok "push" alapú elven való folyását tette lehetővé.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169912439-dff624ed-c7ea-4394-8f24-135817a53252.png />
   <figcaption align="center"><b>Express.js könyvtár használatából egy részlet</b></figcaption>
</p>

**Push alapú adat mozgás:**

Mind a frontend és a backend komponens is hasonló "push" alapú elvet alkalmaz adatok mozgatására. Ezt az általam nagyon kedvelt `RxJS` könyvtár használatával érjük el. Hogy szemléletes példát adjak, ezen könyvtár használatával olyan getter függvényeket deklarálhatunk, amelyek önmaguktól szólnak ha változott az értékük. Minden helyen ahol ezen getterek értékeit használjuk, ott továbbra is szemléletesen, függőségeket kell csak megadnunk, hogy mely getterek érték változásának esetében szeretnénk újboli kód futtatást elérni. Ezáltal ahol a getterek értékeik bizonyos események bekövetkeztekor frissülnek (például REST hívásban regisztrálunk egy új felhasználót), a belőlük származtatott minden adat is automatikusan frissül.

**Aszinkron függvények előnyei:**

A javascript által támogatott `Promise` generikus osztály segítségével könnyedén tudunk aszinkron függvényeket futtatni és az `await` kulcsszóval "callback" függvények regisztrálása nélkül tudjuk azokat helyben kezelni. Aszinkron függvények használata azzal az előnnyel jár, hogy nem kell tudnunk, hogy egy folyamat mennyi ideig tart, mi az eredménnyel ugyanúgy tudunk dolgozni mintha szinkron időben futnának a függvények, viszont amíg várunk a válaszra addig a javascript motor a háttérben tud foglalkozni más feladatokkal, nem blokkoljuk a fő szálat.

 <p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169913273-d4239291-445f-4bb9-8d4c-77afe808d6b9.png />
   <figcaption align="center"><b>A Game::TableManagerService startTable függvényének megvalósítása</b></figcaption>
</p>

A fenti példán szépen látható a jól struktúrált aszinkron függvények használatából fakadó előny. A `start` függvény elkezdi a játékot futtatni. Ez egy aszinkron függvény mely akkor tér vissza, ha vége van a játéknak. Mi könnyedén tudunk a játék vége eseményre reagálni és szépen kitakarítani a memóriát a befejezett játék után. Az említett `await` kulcsszót a hibakezelés miatt nem használtuk.

**Példa a játék lefolyására**

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/168590342-eeb422de-a145-4210-bcc0-fe81a603c087.png />
   <figcaption align="center"><b>A játék lefolyásának részleges folyamatábrája</b></figcaption>
</p>

### 3.3.2

### 3.3.2. Esetleges eltérések a tervtől

## 3.4. Tesztelés

A gépi ellenfél véleményezése
(ki ismerhető a gép logikája, hány játék következik ez be)

### 3.4.1. Egység tesztek

### 3.4.2. Végfelhasználói tesztesetek

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/169161813-2c887991-c7ed-4cad-a0e4-a2e51362f4c4.png />
   <figcaption align="center"><b>Végfelhasználói tesztesetek</b></figcaption>
</p>

A kliens átfogó általános tesztelésére a fenti teszteseteket használtuk.

## 3.5 Lehetséges jővőbeni fejlesztések

- Ellenőrizzük le, hogy a pair-socket végpont mindenképpen a legjobb megoldás amit választhattunk.
- Adjuk hozzá a játékhoz a tippek azon információját, hogy melyik kód elemre és milyen értékkel történt a tipp ki által.
- Tanítsuk meg a gépi ellenfelet arra, hogy vegye figyelembe ellenfelei és saját korábbi tippjeit, de figyeljen az ez általi becsapásra is (blöffölésre).
- Dinamikus micro-frontend architektúrára váltás azzal a céllal, hogy új társasjátékokat akár részleges release-el is már tudjunk hozzáadni a játékhoz.
- További társas játékok implementálása.

# 4. Irodalom jegyzék

- A társas játékot ma már sajnos nagyon kevés helyen lehet meg kapni, de itt még talán igen: https://www.aliexpress.com/item/32715285100.html
- Angular dokumentációja: https://angular.io/
- Express.js dokumentációja: https://expressjs.com/
- Socket.io dokumentációja: https://socket.io/
- RxJS dokumentációja: https://reactivex.io/

hivatalos linkje játéknak ()
nem csak plágium problémákra
hogyan kapcsolódunk a világhoz
ha valakit érdekelne bővebben a téma linkek
