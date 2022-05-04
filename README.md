## Da Vinci board game

This will be the thesis work for my degree. As of august 2019, it is playable, but I haven't made the documentation for it yet.

# Documentation (In progress)

For `.uxf` files I used [UMLet](https://www.umlet.com/).

## Use Cases (GIVEN/WHEN/THEN)

## UML Use Case diagrams

![image](https://user-images.githubusercontent.com/36570468/163158397-db881b45-551e-463d-a1f7-3648a11bb6e5.png)

UML Aktivizációs diagram
![image](https://user-images.githubusercontent.com/36570468/163158444-5fe62dc4-c709-4edf-b57a-0b44b07fb882.png)

## UML Class Diagram (server side)

számosságokat, enumerációnál nyilak fordítottva szaggatva

![image](https://user-images.githubusercontent.com/36570468/163157707-c1e8f3a3-1acd-45cb-97a7-26176a875450.png)

## UI Mock ups

# 1. Bevezetés

Társasjátékokkal mindig jó a kikapcsolódás. Még egyetemi éveim elején ismerkedtem meg egy számomra nagyon élvezetes játékkal, melyben bár szerepet kap a szerencse, nagyban tudja az eredményt befojásolni ha figyelmesek vagyunk a legapróbb elszórt információ morzsákra is. Ez a társasjáték a Da Vinci címet viseli és rengeteg órát játszottam vele az egyetemen szervezett Társas-Szerepjáték Hétvégéken. A játék során információkat kell szereznünk, akár a játék térről, akár korábbi lépésekből, vagy ellenfeleink testbeszédéből.

## 1.1 Játékszabályok

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

## 1.2 A szakdolgozat célja

Szakdolgozatom célja a fent ismertetett társasjáték számítógépre való átültetése. A játékos legyen képes többedmagával különböző eszközökről egymással játszani az interneten keresztül és ezenkívül gépi ellenfelet is lehessen hozzá adni a játékhoz. A gépi ellenfél jelentsen minél nagyobb kihívást és annak működése legyen független a játékos számtól.

A feladatot egy egymástól független szerver-kliens megoldással szeretném megoldani, ahol a szerver futtatja és ellenőrzi a társasjáték lépéseit, a kliensek pedig a felhasználók lépéseit jelenítik meg és közvetítik.

# 2. Felhasználói leírás

## 2.1 Felhasználói esetek

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166482988-f1ce1b99-ae0f-43fc-a7c9-b836d114cfac.png />
   <figcaption align="center"><b>Felhasználói eset diagram</b></figcaption>
</p>
<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/163157597-e4e85a31-63cc-4a2d-a7c5-62e68b316398.png />
   <figcaption align="center"><b>Felhasználói történet</b></figcaption>
</p>

## 2.2 Rendszer követelmények

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

lásd https://www.inf.elte.hu/content/programtervezo-informatikus-bsc-szakdolgozat-tudnivalok.t.1138?m=192
(Bírálat szempontrendszere)

# 3. Fejlesztői leírás

## 3.1. Elemzés

### 3.1.1. Feladat leírás

Jelen szakdolgozatom céljai:

- Az 1.1-es fejezetben részletezett játékszabályokkal rendelkező társasjáték megvalósítása
- A játékot egyszerűen böngészőből, bármilyen speciális program telepítését nélkül tudjuk játszani.
- A játékot barátainkal tudjuk játszani a helyi hálózaton különböző kliensekről.
- Legyünk képesek gépi ellenfeleket hozzáadni a játékhoz.
- A gépi ellenfelek nyújtsanak kihívást.

### 3.1.2. Funkcionális leírás

user story
usecase diagram

### 3.1.3. Nem-funkcionális leírás

## 3.2. Tervezés

### 3.2.1 A Backend architektúrája

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166569875-4032895d-5f09-4c6e-8abc-ba83edde70af.png />
   <figcaption align="center"><b>A Backend komponens REST API-ja</b></figcaption>
</p>

A Backend komponens tervezésekor a filozófia a következő volt:

- Az alapvető kommunikáció folyjon REST-en és csak értelem szerűen egészítsük ki a funkciókat websocket használatával.
- Minden végpont amely pusztán csak adatot olvas (GET) legyen hozzáférhető autentikálás nélkül is.
- Használjunk `CSRF-token`-t annak ellenőrzésére, hogy kizárólag a saját frontendünk küldhet nekünk olyan kérést ami adatot is módosít (POST).
- A felhasználó megállapításához írjunk és olvassunk egy `http-only` beállítással rendelkező sütit (kliens csak olvasni képes).
- A megfelelő autentikáció és autorizáció ellenőrzését végezzük middleware komponensekben.
- Értelem szerűen bontsuk szét a feladat körök és felelősségek mentén a végpontokat külön csoportokra, és tegyük azoknak kezelését külön singleton osztályokba.
- Azonos csoportokban lévő végpontoknak legyen egy közös prefix-e az elérési útvonalban.

<p align="center">
   <img src=https://user-images.githubusercontent.com/36570468/166662648-ac9e4ad9-7738-42d5-8f4e-e1e177cf44e1.png />
   <figcaption align="center"><b>A különböző végpontok részletezése felhasználás szerint</b></figcaption>
</p>

### 3.2.2. Modell

osztály diagram
osztályok

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

### 3.2.4. Gépi ellenfél

## 3.3. Megvalósítás

### 3.3.1. Felhasznált technológiák

### 3.3.2. Esetleges eltérések a tervtől

## 3.4. Tesztelés

### 3.4.1. Egység tesztek

### 3.4.2. Végfelhasználói tesztesetek

user story táblázat alapján generált táblázat

## 3.5 Lehetséges jővőbeni fejlesztések

- pair-socket végpont létszükségének megkérdőjelezése

# 4. Irodalom jegyzék
