miserend.hu 
============
2024 Szent Józseg Hackathon
============================
## Összefoglaló

## Probléma összefoglaló
A jelenlegi felhasználói felület adatbevitele nem felhasználóbarát. Nem intuitív és nem is könnyen tanulható.
A probléma megoldását nem a jelenlegi felület javításában látjuk, hanem annak koncepcionális megváltoztatásában.
A Google naptár szolgáltatása világszerte elterjedt. A Google cég elvégezte a felhasználhatósági tanulmányokat (usability studies), és egy intuutív felületet nyújtanak a naptári események adatbevitelére.
Felhsználói esetek:
- ismétlődő események/szentmisék
- adott időszakhoz tartozó szentmisék/liturgiák (pl. advent / nagyböjt / egységhét)
- egyedi szentmisék / igeliturgiák
- [szentségimádások](#chapter-szentsegimadas)

Jelenlegi felhasználói szerepkörök:
- lekérdező - authentikáció nélkül - templom keresés után - képes lekérdezni egy adott napra a megadott templomban bemutatott szentmiséket
- plébános (mezei szerkesztő) - normal módban. Plébános, plébániai megbízott. Egy vagy a plébániához tartozó templomok miserendjét tudja szerkeszteni.
- püspök (egyházmegyei megbízott szerkesztő) - az adott egyházmegye összes templomához van jogosultsága
- adminisztrátor (a.k.a Isten mód) - a redszerben levő összes templomhoz hozzáfér, új templomokat tud regisztrálni
- (esperes) - szerintem ez nem létező szerepkör. Egy adott esperesi kerület templomait szerkesztheti

Jelenlegi kiegészítések a napári adatokon túl:
<ul>
    <li>ha idegen nyelven van a szentmise, ezt külön lehet jelezni </li>
    <li>egyéb misére jellemző attribútumok tárolása (akár több is egyszerre)</li>
        <ul>
            <li>családos</li>
            <li>gitáros</li>
            <li>csendes</li>
            <li>görögkatolikus</li>
            <li>igeliturgia</li>
            <li>szentégimádás</li>
            <li>...</li>
        </ul>
</ul>
Bármilyen szabad szöveges megjegyzés is felvihető.

Technikailag nem szerencsés a monolitikus kód, mely egybefoglalja a frontend és backend szolgáltatásokat.

## Vizió (Vision)
### Szolgáltatás alapú hosszú távú vízió (long term vision)
A hosszú távra tervezve a jelenlegi technológiai stack teljes átalakításra kerülne. A frontendet Javascript alapú keretrendszer (React/VueJs/AngularJs) futtatná.
A backend-en pedig nodeJS (Typescript) szolgáltatások futnának. 
Az adatbázisban dokumentum alapon tárolnánk az adatokat. Preferrált NoSQL adatbázis: [MongoDB](https://www.mongodb.com/).
Authentikáció: [OIDC](https://openid.net/)
Authorizáció: [OAuth 2.0](https://oauth.net/2/)

Mit nyerünk? - Könnyen értelmezhető, kvázi szabványos adatbevitel.
Mit veszítünk? - Idő, erőforrás ráfordítást

### Szolgáltatás alapú rövid távú vízió (short term vision / a.k.a MVP)
Alapvetően a jelenlegi szoftver architektúra (HTML,PHP, MySQL) megmarad az authentikációhoz és a templomok kezeléséhez. 
A miserend rész egészül ki egy beágyazott adatbeviteli modullal a frontenden. Továbbá az ehhez kapcsolódó backend endpoint-okat nodeJS szerviz szoljálja ki.
Az adatforgalom a kliens és a szerver közöett egy API gateway-en (praktikusan nginx) keresztül megy. Ez a web kiszolgáló irányítja az adatokat a megfelelő szervizhez (PHP/nodeJS) az URL-ben található path alapján.
Az adattárolás vagy [iCalendar](https://icalendar.org/) formátumban, vagy pedig OSM formátumban tárolná az egyes templomok mise időpontjait.
Ez valójában az első lépés a távlati vízió felé úgy, hogy a felhasználói élmény már jelentősen javul, és a szabványos adattárolás miatt más rendszerekkel való együttműködés könnyebben lehetővé válik.

### Miserend a felhőben
Ez a hosszú távú víziónak a kiegészítése.
Az esemény után merült fel ötletként, hogy a miserend.hu felhős alkalmazásként teljesen serverless módon működhetne. És vélhetően az üzemeltetés így lenne a legolcsóbb. 
Ennek bizonyítására szükség lenne egy tanulmánymunkára. Amennyiben a typescript service-ek a hosszú távú vision-ben több rétegre választják szét a megvalósítást (controller és service layer), a felhősítést serverless erőforrásokkal már gyerekjáték megvalósítani.

## Együttműködés más rendszerekkel (3rd party integration)
### <a id="chapter-szentsegimadas></a>Együttműködés szentségimádás szervező programmal
A távlati vízióhoz hozzátartozik a szentségimádásokat szervező szoftverrel való együttműködés. A következőkben szentsegimadas.hu-ként hivatkozom erre a szoftverre, bár nem biztos, hogy ezen a domain-en fog futni.
A tervek szerint a szentsegimaadas.hu egy API-t fog kínálni a külvilág felé, melyben azok az időpontok szerepelnek, amikor már visszaigazoltan lesz szentségimádás az kérdezett napon/napokon. Az API OSM (openstreetmap) [opening_hours](https://wiki.openstreetmap.org/wiki/Key:opening_hours) formátumban küldi az adatokat a kliensnek. 
Az authentikációt nem beszéltük meg. Két lehetőséget látok:
1. Az szentsegimadas.hu ezen végpontja publikus, bárki azonosítás nélkül eléri.
2. service-to-service authentikáció access-key alapon [OIDC client credential flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)

### Templomok meglévő google calendar-janak integralasa a miserend.hu-ra
Sok templomnak létezik meglévő eseménynaptára. Sok esetben google calendar alapon. Ezeket az adatokat export-álva egy végponton keresztül be tudjuk illeszteni a saját adatbázisunkba. 

## Hackathon projekt
A II. Szent József Hackathon-on a rövid távú vízió irányába indultunk el.
Egy proof of concept-et (POC) szerettünk volna létrehozni csak az adatbevitelre, és az adattárolásra. Tehát a meglevő HTML, PHP, MySql kódot teljesen figyelmen kívül hagytuk és új GitHub repository-kba kezdtünk dolgozni.
Először egy meglévő UI modult kerestünk, amely úgy működik mint a Google Calendar, de ugyanakkor szabad hozzáférés van a kódhoz, hogy testre szabható legyen.
Első pillanatra jónak tűnt a [Calendar.js](https://calendar-js.com/) nyitott forráskódú termék. Több előnyét vettük figyelembe:
- usability szempontból megfelelő (Google Calendar klón)
- nincsenek külső függőségei (dependeciák)
- testre szabható - könnyen átírható a meglevő forráskód (14000 sor egy forrásfile-ban :-))
- magyar fordítás rendelkezésre áll
A Calendar.js git repo-ját fork-oltuk a saját repo-ba: https://github.com/szentjozsefhackathon/miserend_Calendar.js

Továbbá a projekthez készítettünk egy másik repository-t, ahol a backend hívásokat valósítottuk meg:
https://github.com/szentjozsefhackathon/miserend_backend

### Hogyan build-eljük a komponens-t (Howto build)
#### Frontend
A frontend-et nem kell build-elni. Statikus html, mely alapvetően javascript elemekből építi fel a GUI-t. A formázást css-sel valósítja meg.
Alapvetően a project strutúrája (src, dist könyvtárak) arra utal, hogy ezt a forráskódot is lehet build-elni, de nem jöttünk rá hogyan.
A dist könyvtár is a repo-ban volt tartalmazta a webpack által kigenerált és lerövidített js file-t. Így mi az src-ben található eredeti javascript file-t szerkesztettük tovább. Amíg nem hívunk backend komponenseket a filerendszerből megnyitva az src/calendar.js.html file-t. Minden működőképes kell legyen.
#### Backend
A backend-en nodeJS service fut, ami Typescript programozási nyelven van implementálva.
node és egy npm programokra lesz szükség a fordításhoz és a futtatáshoz.
a build parancs:
```npm run build```


### Hogyan telepítsük a komonenseket (Howto install)
A projekt futtatásához szükségünk lesz egy web szerverre, ami az API Gateway szerepét fogja betölteni. Ez azért kell feltétlenül, mert a UI kód statikus ugyan, de a filerendszerből betöltve [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) hibához fog vezetni a backend hívás. 
Bármilyen web szerver (Apache, Apache Tomcat, Ngins, Caddy stb.) alkalmas lehet a célra. Mi az nginx szerver-t használtuk erre a célra Ubuntu Linux operációs rendszeren, ezért ennek a konfigurálását írjuk le ebben a fejezetben. Windows-on teljesen analóg módon működik.
1. Telepítsük az Nginx programot
2. Adjuk hozzá az alábbi kódrészletet a /etc/nginx/nginx.conf http szekciójához
```
	server {
    		listen 80;
    		server_name localhost;
    		# server context

	    	location / {
        		root /var/www/src; 
        		index calendar.js.html;
        	# first location context

    		}
		location /api/miserend {
			proxy_pass http://localhost:3000;
		}
		
	}
```
Ugyanebben a szekcióban kommentezzük vagy töröljük az alábbi sort:
```
	include /etc/nginx/sites-enabled/*;
```
Másoljuk át a repository-ból az src könyvtárt a /var/www/src könyvtárba.
Indítsuk újra a web server-t.

#### MongoDB
Telepítsünk [MongoDB](https://www.mongodb.com/)-t a localhostra.

### Hogyan futtasuk (How to run)
Ha a frontend telepítést elvégeztük, a backend-et kell elindítani.
A miserend_backend repository könyvárában a következő paranccsal:
```
    npm start
```
Ezután egy böngészőben nyissuk meg a ```localhost``` oldalt. Voila!!! A rendszer működőképes kell legyen.

## Tanulságok
Az eredeti jCalendar GUI, perzisztens backend nélkül működik. Az entry-ket a html-ben tárolja, valamint minimális perzisztenciaként a böngésző local storage-ében. Emiatt nem vesznek el az adatok, ha az oldalt frissítjük, mert a local storage-ből újratölti.
Az elképzelés az volt, hogy a jCalendar-ban a lehető legkevesebb módosítást hajtsuk végre, és külső file-okban adjuk hozzá a kiegészítő function-öket amiket aztan importálunk a központi file-ba.
Ez a megközelítés két ponton is elbukott:
- javascript tudásbeli hiányosságok: az importálást nem tudtuk megoldhani sem az import sem a require kulcsszavakkal. Ezen a problémán biztosan túl lehet jutni, de az POC és hackathon fejlsztési módszertan miatt nem vesztegettük az időt a megoldás keresésével
- a meglévő javascript file nagyon sok számunkra felesleges dolgot tartalmaz (pl. local storage használata, extra funkciók a UI-on), így mindenképp viszonylag sok helyen kell hozzányúlni az eredeti kódhoz, ami a későbbi merge-eléseket megnehezíti. Ugyanakkor néha érthetetlenül furcs logikával dolgozik a frontend - például egy elem módosítását egy törlés és létrehozás kombinációjával valósítja meg. Ami a célnak ugyan megfelel, de semmiképp nem szép és fenntartható módszer.



## Következő lépések (Next steps)
