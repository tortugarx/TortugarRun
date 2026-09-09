# Verbindlicher Masterplan für 50 Level

Status: **Wand-, Timing- und Portalüberarbeitung nach Spielerfeedback am 9. September 2026 vollständig abgenommen.** Dieser Plan ersetzt frühere grobe Szenenlisten.

## Auswertung des Chats

Folgende Wünsche sind verbindlich:

- Die vorhandenen Grundmechaniken bleiben: Laufen, Springen, Stacheln, bewegte Mapteile, Portale, Knöpfe und Größenänderung.
- Jeder Raum erzählt eine eigene kurze Geschichte und unterscheidet sich schon als schwarze Silhouette von **jedem einzelnen der übrigen 49 Level**, nicht nur von seinen Nachbarn.
- Schwebende Plattformen sind erlaubt, wenn sie Route, Transport, Landung oder Köder sind. Dekorative oder unmotivierte Blöcke entfallen.
- Stacheln, Wände und Plattformen entstehen nie bereits sichtbar schwebend. Bewegliche Teile kommen aus passenden Taschen, Schächten oder Anschlüssen.
- Bewegungen sind weich, kollisionssicher und exakt. Plattformen tragen den Spieler mit; Mitlaufen beschleunigt, Gegenlaufen bremst relativ zur Weltbewegung.
- Stein tötet nie durch bloßen Kontakt. Bewegte Wände halten niemals am Spieler an; sie folgen ihrer festen Bahn und schieben die Schildkröte in sichtbare oder ausgelöste Gefahren.
- Fallen sind deterministisch, aber beim ersten Versuch psychologisch überraschend. Das Spiel nutzt Erinnerungen an vorherige Level gegen den Spieler.
- Ein Level bleibt übersichtlich: eine Hauptmechanik, höchstens eine Finte und höchstens ein kurzer Schlussstich.
- Jeder Fall ins Nichts ist tödlich.
- Ein Portal ist ein einzelner Eingang und teleportiert zu einem frei definierten Zielpunkt im Raum. Am Zielpunkt steht kein zweites Portal. Portale, Knöpfe und Türen haben Abstand.
- Die Levelübersicht sieht in allen Kategorien gleich aus und zeigt den aktuellen Level eindeutig.

## Analyse des echten Level Devil

Die untersuchten Spielbilder zeigen als Grundformen unter anderem eine fast leere Laufbahn, ein breites U-Becken, einen langen schwebenden Steg, eine große C-Form, übereinanderliegende Korridore, einen extrem hohen Schacht und einen isolierten Turm in viel Leerraum. Die Unterschiede entstehen vor allem durch die Verteilung großer Massen und Leerflächen. Farbe und zusätzliche Objekte sind zweitrangig.

Level Devil lässt den Raum zunächst verständlich wirken. Die Tür ist sichtbar und die vermeintliche Route lässt sich in einem Blick erfassen. Erst die Handlung des Spielers bricht die Erwartung: Eine Landung wird gefährlich, eine Fläche verschwindet, eine Wand verändert den Rückweg oder eine Bewegung setzt sich länger fort als erwartet. Der Tod liefert Information für den nächsten reproduzierbaren Versuch. Die offizielle Beschreibung nennt einstürzende Plattformen, verschobene Stacheln und spätere Änderungen von Physik und Regeln. Quelle: [Poki – Level Devil](https://poki.com/en/g/level-devil).

Für unser Spiel folgt daraus: Pro Raum zuerst eine unverwechselbare Silhouette, dann eine lesbare Scheinlösung, danach genau ein starker Verrat. Kein Raum darf Grundriss, Hauptroute und Auslöserkombination eines der übrigen 49 Level wiederholen.

### Verbindliche Bildvorlagen

Die Referenzbilder werden als direkte Formvorlage verwendet, ohne ihre konkreten Fallen oder kompletten Screens zu kopieren:

- `/tmp/leveldevil-reference/03.png`: breites, tiefes U-Becken mit treppenförmigen Seiten; Grundlage von Level 03.
- `/tmp/leveldevil-reference/04.png`: einzelner langer Schwebesteg in großer Leerfläche; Grundlage von Level 13.
- `/tmp/leveldevil-reference/05.jpg`: große C- beziehungsweise Hakenform mit massivem Überhang; Grundlage von Level 10.
- `/tmp/leveldevil-reference/07.jpg`: zwei klar getrennte Stockwerke mit wenigen sichtbaren Gefahren; Grundlage von Level 11.
- `/tmp/leveldevil-reference/08.jpg`: extreme Mittelwand beziehungsweise Schachtform mit seitlicher Türnische; Grundlage von Level 12.
- `/tmp/leveldevil-reference/09.jpg`: einzelner hoher isolierter Turm in fast leerem Raum; Grundlage von Level 08.

Die **Portalzeichnung** besteht nach dem jüngsten Spielerfeedback verbindlich aus mehreren neutralgrauen, ineinanderlaufenden Pixelquadraten. Sie pulsiert auch im Leerlauf und verdichtet sich während des Transports. Dadurch ist sie schon in der Silhouette klar von der bogenförmigen Tür getrennt. Es gibt weiterhin keine farbige Paarcodierung und keinen Partikelring.

### Globale Einzigkeitsmatrix

Vor der Umsetzung erhält jeder Raum vier Kennwerte: `Silhouette`, `Hauptrichtung`, `Haupttrigger`, `Türlage`. Keine Kombination darf zweimal vorkommen. Zusätzlich dürfen zwei Level nicht dieselbe Abfolge aus Startfläche, Hauptbewegung und Zielannäherung besitzen.

Die 50 Silhouetten sind verbindlich verschieden: 01 flache Linie; 02 Doppelterrasse; 03 tiefes Treppen-U; 04 niedriger Tunnel; 05 Drei-Insel-Sprung; 06 Mittelsockel mit Seitenarm; 07 Mittelturm mit Ober-/Unterroute; 08 isolierter Hochturm; 09 drei ungleiche Pfeiler; 10 großes C; 11 Doppelstock-Rückweg; 12 enger Vertikalschacht; 13 einzelner Schwebesteg; 14 absteigendes Zickzack; 15 Bodenklappe im Saal; 16 Liftgrube; 17 Zwei-Ufer-Fähre; 18 diagonaler Abstieg; 19 Dreifeld-Korridor; 20 Gegenstromsteg; 21 versetzte Doppeletage; 22 fliehende Türinsel; 23 Segmentbrücke; 24 L-Schacht mit Schubwand; 25 Drei-Haltestellen-Archipel; 26 Domino-Treppe; 27 Zangenhalle; 28 dreistufige Fluchtstrecke; 29 bewegter Innenkern im C-Rahmen; 30 zwei ungleiche Portalräume; 31 Turm mit unterer Nische; 32 Anlauftunnel in offene Kammer; 33 drei Räume in S-Anordnung; 34 Portal über Liftgrube; 35 asymmetrisches Portal-U; 36 gespiegelte Doppel-C-Kammer; 37 Turm mit Fallschlitz; 38 Ufer mit fahrendem Eintrittsportal; 39 hohe Direktabkürzung; 40 Knopfinsel und Brückenschacht; 41 sinkende Mittelhalle; 42 Kriechtunnel plus Schlucht; 43 Balkonzimmer mit fahrender Türinsel; 44 umlaufender Doppelgang; 45 Y-Kammer; 46 langer Größensteg; 47 Doppelturm mit Schalterfähre; 48 rückwärts steigendes Zickzack; 49 drei getrennte Akträume; 50 Turm-U-Nischen-Raum.

**Verbindlicher Portalwelt-Override vom 9. September 2026:** 30 einsamer Mittelturm; 31 senkrechter Schlitz; 32 Impulsinsel im Leerraum; 33 gestapelter Doppelstock; 34 tiefes Portal-U; 35 asymmetrische Rückschleife; 36 gegeneinander gedrehte C-Arme; 37 Fall-Zickzack; 38 diagonale Portal-Fähre; 39 hohe Direktabkürzung. Diese jüngere Liste ersetzt für Level 30–39 die ältere Silhouettenzeile oben.

## Technische Raumregeln

- Spielfeld: 960 × 540. Nutzbarer Spielraum unter der HUD-Decke ungefähr y=96 bis y=540.
- Standardfigur: 24 × 18. Normale Gänge mindestens 34 px hoch; ausdrücklich schmale Gänge 24–29 px und nur mit kleiner Figur.
- Normale sichere Landefläche mindestens 70 px. Präzisionsflächen 42–60 px, höchstens einmal pro Raum.
- Zwischen Portal und Knopf mindestens 140 px; zwischen unsichtbarem Portal-Zielpunkt und unmittelbarer Gefahr mindestens 90 px Reaktionsraum.
- Portal-Daten bestehen aus `x`, `y`, `targetX`, `targetY`, optional `targetVx` und `targetVy`. Es gibt keine Portalpaare und keine Zielportal-ID.
- Versteckte Stacheln fahren in 120–180 ms aus einer bündigen Nut. Bewegte Wände kündigen Bewegung 100–180 ms durch eine Fuge oder ein kurzes Anfahren an.
- Plattformen beschleunigen und bremsen mit Ease-in/out. Richtungswechsel enthalten 250–500 ms Haltezeit, außer der Richtungswechsel selbst ist die klar angekündigte Hauptfalle.
- Offene Unterkante: Tod, sobald die Figur vollständig unter y=585 liegt. Es gibt keine unsichtbaren Rettungsböden.

## Welt I – Stacheln und Erwartung, Level 01–14

### 01 · DER EHRLICHE ZAHN

- **Bild:** Eine einzige flache Bodenlinie bei y≈440; Start links, Tür rechts, ein sichtbarer Stachel mittig.
- **Ablauf:** Keine Trigger, keine versteckten Elemente. Ein normaler Sprung reicht.
- **Psychologie/Lösung:** Das Spiel verdient zuerst Vertrauen und kalibriert Lauf und Sprung.
- **Abgrenzung:** Einziger vollständig gerader und vollständig ehrlicher Raum der Welt.

### 02 · NICHT VOR DER TÜR

- **Bild:** Zwei breite Terrassen auf gleicher Höhe, dazwischen eine kurze Lücke; Türzone auffällig leer.
- **Trigger:** Beim Betreten der letzten 55 px vor der ersten Kante fährt dort ein Stachel aus dem Boden. Vor der Tür geschieht nichts.
- **Lösung:** Triggern, einen Schritt zurück, dann über Stachel und Lücke springen.
- **Psychologie:** Die in Level 1 gelernte Gefahr wandert von der Mitte an den Absprung, nicht ans Ziel.

### 03 · DAS TIEFE U

- **Bild:** Breites symmetrisches U-Becken; Start links oben, Tür rechts oben, große freie Mulde.
- **Trigger:** Am Muldenboden erscheint zuerst ein Stachel hinter dem Spieler, später einer vor ihm. Nie beide gleichzeitig.
- **Lösung:** Nicht zurückweichen; weiterlaufen und nur über den zweiten Stachel springen.
- **Abgrenzung:** Erster tiefer Raum, Bewegung horizontal durch eine Senke statt über eine Lücke.

### 04 · KOPFSACHE

- **Bild:** 320 px langer niedriger Korridor zwischen Boden und massiver Decke; nur ein kleiner Bodenspalt am Ende.
- **Trigger:** Ein hoher Sprung unter der Decke fährt einen Deckenstachel nach unten. Laufen löst ihn nicht aus.
- **Lösung:** Durchlaufen und erst am Bodenspalt kurz springen.
- **Psychologie:** Der gelernte Reflex „bei Gefahr springen“ wird gegen den Spieler verwendet.

### 05 · DIE INSEL

- **Bild:** Zwei massive Ufer und eine einzelne große, klar funktionale schwebende Insel über dem Nichts.
- **Trigger:** Die Insel bleibt ehrlich. Erst die hintere Hälfte des Zielufers fährt bei einer weiten Flugkurve Stacheln aus.
- **Lösung:** Auf der Insel stoppen; kurz und steil auf die vordere Zielkante springen.
- **Abgrenzung:** Maximale Leerfläche, nur drei begehbare Massen.

### 06 · FALSCHE RICHTUNG

- **Bild:** Start auf mittlerem Sockel; Tür links unten, große attraktive Treppe rechts oben.
- **Trigger:** Der rechte Treppenweg endet nach der zweiten Stufe in einer seitlichen Stachelnut.
- **Lösung:** Vom Start nach links auf einen niedrigen unscheinbaren Absatz fallen.
- **Psychologie:** Die aufwendigere sichtbare Route ist Köder; korrekte Lösung ist räumlich rückwärts.

### 07 · UM DEN TURM

- **Bild:** Ein massiver zentraler Turm trennt Start und Ziel; unten ein schmaler Tunnel, oben zwei breite Stufen.
- **Trigger:** Erst tief im Tunnel fährt ein Bodenstachel aus. Der Spieler kann sicher zurück.
- **Lösung:** Tunnel prüfen, umkehren, außen über den Turm gehen.
- **Abgrenzung:** Erste echte Routenauswahl; der Raum verlangt Erkenntnis statt Timing.

### 08 · FALLLINIE

- **Bild:** Sehr hoher Startturm rechts, kleine Türnische links unten, fast der ganze Bildschirm leer.
- **Trigger:** Beim Verlassen des Turms fährt exakt unter der naheliegenden Falllinie ein Stachel aus.
- **Lösung:** Während des Falls deutlich nach links lenken und auf der breiten sicheren Zone landen.
- **Psychologie:** Gefährlich ist der erwartete Landepunkt, nicht der Absprung.

### 09 · DREI PFEILER

- **Bild:** Drei Pfeiler unterschiedlicher Höhe und Breite über dem Nichts; Tür auf Pfeiler drei.
- **Trigger:** Nach Landung auf dem Zielpfeiler wächst hinter der Figur ein Stachel und nimmt die Pausenfläche.
- **Lösung:** Nach der Landung sofort zur Tür weiterlaufen.
- **Abgrenzung:** Rhythmischer Luftlevel; Stillstand statt Sprungweite wird bestraft.

### 10 · DAS GROSSE C

- **Bild:** Eine einzige große C-förmige Masse, Start innen unten, Tür außen oben am kurzen Schenkel.
- **Trigger:** Ein Sprung entlang der direkten Innenkante löst einen Deckenstachel aus.
- **Lösung:** Erst aus dem C herauslaufen, außen über seinen Rücken zur Tür.
- **Psychologie:** Die Tür ist nah sichtbar, der sichere Weg räumlich lang.

### 11 · ZURÜCK ZUM ANFANG

- **Bild:** Zwei Stockwerke; Start oben links, Sackgasse rechts, Tür direkt unter dem Start sichtbar.
- **Trigger:** Am rechten Ende öffnet sich ein Fallschacht. Auf dem unteren Rückweg entsteht nahe der Startposition ein Stachel.
- **Lösung:** Rechts hinunter, unten links zurück, letzten Stachel überspringen.
- **Abgrenzung:** Route verläuft erst vom Ziel weg und danach zurück.

### 12 · DER SCHACHT

- **Bild:** Sehr schmaler vertikaler Schacht mit Tür in einer unteren Seitennische.
- **Trigger:** Beim Fall fahren links, rechts, links drei kurze Wandstacheln nacheinander aus bündigen Taschen.
- **Lösung:** Kleine horizontale Korrekturen; unten liegt eine breite sichere Bremszone.
- **Abgrenzung:** Keine Laufstrecke, vollständig vertikales Spiel.

### 13 · NICHTS PASSIERT

- **Bild:** Ein langer dünner Steg schwebt funktional zwischen Start und Tür in sehr viel Leerraum.
- **Ablauf:** Keine Falle, kein Trigger, kein Einsturz.
- **Lösung/Psychologie:** Einfach gehen. Der Raum löscht den automatischen Glauben an eine Falle vor dem Weltfinale.
- **Abgrenzung:** Ruhiger Ein-Akt-Level ohne Sprung.

### 14 · DAS GELERNTE

- **Bild:** Zickzack aus unterem Start, hoher Mittelterrasse und tiefer Türzone.
- **Trigger:** Sichtbarer erster Stachel ist ehrlich. Die verdächtige Mittelterrasse bleibt sicher. Ein versteckter Stachel erscheint an der letzten Absprungkante, die Türzone bleibt frei.
- **Lösung:** Ersten Stachel normal springen, Terrasse zügig queren, letzten Trigger anlocken und neu abspringen.
- **Abgrenzung:** Abschluss aus drei Erinnerungen, aber maximal eine aktive Gefahr gleichzeitig.

## Welt II – Bewegte Architektur, Level 15–29

### 15 · DER BODEN GEHT

- **Bild:** Breiter leerer Raum mit scheinbar durchgehendem Boden.
- **Trigger/Bewegung:** Das 150-px-Mittelsegment sinkt nach Betreten 180 ms verzögert in 0,9 s vollständig weg.
- **Lösung:** Weiterlaufen oder vom sinkenden Segment abspringen; ein Fall ist immer tödlich.
- **Abgrenzung:** Reine Einführung des verschwindenden Bodens, ohne Stacheln.

### 16 · DER HÖFLICHE LIFT

- **Bild:** Tiefe linke Grube, hohe rechte Türterrasse, breiter Lift bündig im Grubenboden.
- **Bewegung:** Lift steigt 100 px, hält 600 ms auf Türhöhe und steigt danach langsam bis in eine sichtbare Deckennut.
- **Lösung:** Während des Halts rechts aussteigen.
- **Psychologie:** Hilfe wird erst nach einer fairen Chance gefährlich.

### 17 · DIE FÄHRE DREHT UM

- **Bild:** Zwei hohe Ufer, eine einzige breite Fähre dazwischen.
- **Bewegung:** Fahrt Richtung Ziel, deutliches Bremsen 65 px davor, 350 ms Pause, dann schnelle Rückfahrt.
- **Lösung:** In Bremsphase abspringen; Gegenlaufen während der Rückfahrt bleibt möglich, aber langsamer.
- **Abgrenzung:** Horizontale Transportphysik statt vertikalem Lift.

### 18 · NACH UNTEN

- **Bild:** Start oben rechts, Tür weit unten links, eine große diagonale Leere und ein Aufzug am Start.
- **Bewegung:** Der Aufzug senkt den Spieler ruhig in den unteren Gang und stoppt bündig.
- **Lösung:** Mitfahren und links aussteigen; keine Finte.
- **Psychologie:** Nach zwei feindlichen Böden ist die unerwartete Hilfe der Twist.

### 19 · RÜCKWEG GESPERRT

- **Bild:** Drei breite Bodenfelder und eine erhöhte Zielstufe.
- **Trigger:** Nach Überschreiten der Mitte fährt das linke Feld als Wand hinter dem Spieler hoch und schließt bündig an die Decke an.
- **Lösung:** Vorwärts bleiben; die Wand verfolgt den Spieler nicht.
- **Abgrenzung:** Architektur verändert Navigation, ohne direkt zu jagen.

### 20 · GEGEN DEN STROM

- **Bild:** Langer schmaler Steg über dem Nichts, dessen Mittelteil horizontal fährt.
- **Bewegung:** Zuerst 2,2 s gegen das Ziel, 400 ms Halt, danach 1,4 s mit dem Ziel.
- **Lösung:** Gegen die Plattform laufen, Richtungswechsel abwarten, Beschleunigung für den Absprung nutzen.
- **Abgrenzung:** Expliziter Prüflevel für relative Plattformgeschwindigkeit.

### 21 · ZWEI ETAGEN

- **Bild:** Unterer linker und oberer rechter Korridor, mittige Öffnung; zwei große Liftplatten.
- **Bewegung:** Beide tauschen versetzt ihre Höhe. Die zuerst erreichbare fährt unter eine niedrige Decke, die zweite öffnet den Zielweg.
- **Lösung:** Während der Überschneidung einmal die Plattform wechseln.
- **Abgrenzung:** Koordination zweier Bewegungen ohne Fallenobjekte.

### 22 · DIE TÜR FLIEHT

- **Bild:** Großes linkes Festland, kleine Mittelplatte, Tür auf isolierter rechter Insel.
- **Trigger:** Beim Anlauf fährt die Türinsel 110 px weiter weg und stoppt weich.
- **Lösung:** Nicht blind abspringen; nach Bewegung die nun notwendige Mittelplatte verwenden.
- **Psychologie:** Das Ziel selbst ändert die vermeintliche Sprungweite.

### 23 · BRÜCKE AUF ZEIT

- **Bild:** Zwei massive Ufer und vier unsichtbar tief versenkte Brückensegmente.
- **Bewegung:** Segmente steigen als Welle bündig hoch; 500 ms später sinken sie von hinten nach vorn.
- **Lösung:** Mit der Welle laufen, ohne auf einem Segment zu warten.
- **Abgrenzung:** Mehrteilige Bewegung mit einem einzigen klaren Rhythmus.

### 24 · DIE HELFENDE WAND

- **Bild:** Hoher Schacht links, Türnische rechts oben, breite Platte im Boden.
- **Bewegung:** Platte hebt zunächst wie ein Lift, fährt oben jedoch nach rechts und drückt zur Wand.
- **Lösung:** Gegen ihre Richtung gehen und früh in die Nische springen.
- **Psychologie:** Dasselbe Objekt wechselt seine Rolle von Hilfe zu Gegner.

### 25 · HALTESTELLE

- **Bild:** Drei Inseln auf gleicher Höhe, eine lange Fähre verbindet alle.
- **Bewegung:** Fähre stoppt 700 ms an der Mittelinsel; anschließend fährt sie unter einen niedrigen Zielüberhang.
- **Lösung:** Am Mittelhalt aussteigen und über die feste Insel zur Tür springen.
- **Abgrenzung:** Zeitentscheidung statt schneller Reaktion.

### 26 · DOMINO-BODEN

- **Bild:** Fünf breite Stufen abwärts, anfangs komplett fest wirkend.
- **Trigger:** Nach Betreten sinken die Stufen in Reihenfolge 2–4–1–3–5; jede wippt 120 ms vor dem Fall.
- **Lösung:** Die Reihenfolge beobachten und quer auf noch hohe Stufen springen.
- **Abgrenzung:** Kein linearer Einsturz und keine bewegte Wand.

### 27 · DIE ZANGE

- **Bild:** Fast quadratische hohe Kammer; kleine Türgalerie oben in der Mitte.
- **Bewegung:** Seitenwände fahren abwechselnd ein und erzeugen eine wandernde vertikale Lücke. Nie schließen beide Seiten zugleich.
- **Lösung:** Mit der Öffnung über drei Höhen nach oben wandern.
- **Abgrenzung:** Seitliche Raumkompression statt Bodenbewegung.

### 28 · DER JÄGER LÜGT

- **Bild:** Lange Laufbahn mit drei großen Höhenwechseln und komplett freiem Ziel.
- **Bewegung:** Verfolgerwand fährt schnell, wird plötzlich langsam, stoppt scheinbar und startet beim nächsten Absatz erneut schneller.
- **Lösung:** Eigenen Sprungrhythmus halten; die Wand bleibt bei perfektem Lauf mindestens 35 px zurück.
- **Psychologie:** Der Bewegungsrhythmus selbst täuscht, keine zusätzliche Stachelfalle.

### 29 · DAS ZIMMER RUTSCHT

- **Bild:** Großer fester C-Rahmen, zwei Außenanker, eine zusammenhängende innere Bodenroute.
- **Bewegung:** Die Innenroute verschiebt sich erst 120 px seitlich, hält, sinkt dann 90 px. Tür und Außenanker bleiben fest.
- **Lösung:** Ersten Versatz mitfahren, beim Sinken gegenlaufen und auf den festen Anker springen.
- **Abgrenzung:** Weltabschluss mit bewegtem Raumkern statt einzelner Plattform.

## Welt III – Portale und Raumlogik, Level 30–39

### 30 · MITTELTURM

- **Bild:** Ein einziger hoher Turm steht mittig in fast vollständig leerem Raum; zwei niedrige Ufer liegen weit außen.
- **Ablauf:** Der erste Eingang quert den Leerraum, der zweite setzt auf den Turm. Dort löst der letzte kurze Lauf einen späten Stachel aus.
- **Abgrenzung:** Einzige monumentale Mittelturmsilhouette der Portalwelt.

### 31 · DER SENKRECHTE SCHLITZ

- **Bild:** Zwei riesige Seitenmassen lassen nur einen extrem schmalen, senkrechten Schlitz mit drei versetzten Fängen frei.
- **Portal:** Der Eingang oben wirft auf den ersten Fang; danach folgt ein kontrollierter Fall mit spätem Stachel.
- **Abgrenzung:** Einziger nahezu vollständig vertikaler Portalraum.

### 32 · IMPULSINSEL

- **Bild:** Zwei tiefe Außenbänke und eine einzelne kleine Hochinsel in enormem Leerraum.
- **Portal:** Der Eintritt schleudert mit horizontalem Impuls auf die Hochinsel; Insel und Zielbank lösen getrennte späte Stacheln aus.
- **Abgrenzung:** Einziger Portalraum, dessen Hauptroute ein Impulsflug ist.

### 33 · DOPPELSTOCK

- **Bild:** Zwei fast bildschirmbreite, übereinanderliegende Korridore ohne vertikale Kammerteilung.
- **Portalfolge:** Oben vollständig nach rechts, unten vollständig zurück nach links, dann oben erneut nach rechts.
- **Abgrenzung:** Längster horizontaler Richtungswechsel der Portalwelt.

### 34 · DAS TIEFE PORTAL-U

- **Bild:** Zwei sehr hohe Ufer um ein fast leeres, tiefes U; nur am Grund steht ein schmaler Portal-Lift.
- **Trigger:** Betreten startet eine einzige saubere Aufwärtsfahrt. Ein sichtbarer Zahn erzwingt den Einstiegssprung.
- **Abgrenzung:** Einziger tiefer Portal-Lift und einzige U-Silhouette dieser Welt.

### 35 · ZURÜCKGESCHICKT

- **Bild:** Großes U-Becken; Portale oben links/rechts, Tür unten mittig.
- **Ablauf:** Portal links setzt die Figur frei oben rechts ab, wo der Abstieg schließt. Ein zweiter Eingang rechts setzt sie an einem freien Punkt oben links ab; dabei öffnet sich dort ein Fallschacht.
- **Lösung:** Zwei getrennte Eingangsportale benutzen und danach auf der veränderten Startseite hinab.
- **Abgrenzung:** Das Portal verändert die Route hinter dem Spieler.

### 36 · DER SPIEGEL

- **Bild:** Zwei gespiegelt gebaute C-Kammern mit vertauschten Öffnungen.
- **Täuschung:** Das Portal setzt die Figur frei in der Spiegelkammer ab. Der Raum sieht bekannt aus; derselbe Eingabereflex führt wegen Spiegelung in eine Lücke.
- **Lösung:** Nach Ankunft stoppen, Blickrichtung und Öffnung neu lesen.
- **Abgrenzung:** Visuelle Erinnerung statt versteckter Falle.

### 37 · FALL-ZICKZACK

- **Bild:** Zwei riesige Deckenmassen bilden einen horizontal-vertikalen Zickzack mit drei stark versetzten Höhen.
- **Portal:** Zwei Eingänge schneiden die unüberspringbaren Höhenwechsel ab; jede Ankunft ändert sofort die Laufrichtung.
- **Psychologie:** Späte Stacheln bestrafen den gewohnten Geradeauslauf nach jeder Ankunft.

### 38 · BEWEGTE ADRESSE

- **Bild:** Zwei Ufer, zentrale Fähre; das einzige Portal steht mit 100 px freier Zone auf der Fähre.
- **Bewegung:** Die Fähre pendelt einmal. Der Eintrittszeitpunkt entscheidet, ob die danach bewegte Zielterrasse vom fest definierten Zielpunkt erreichbar ist.
- **Lösung:** Fähre und Zielterrasse beobachten, dann das fahrende Portal im richtigen Moment betreten.
- **Abgrenzung:** Timing passiert vor dem Teleport statt danach.

### 39 · DIE LETZTE ABKÜRZUNG

- **Bild:** Hoher Start rechts, tiefe Tür links, zwei auffällige Portalnischen und eine simple offene Sprungroute.
- **Täuschung:** Beide getrennten Eingangsportale teleportieren an ungünstige freie Punkte zurück in den oberen Bereich. Der sichtbare direkte Weg bleibt ehrlich.
- **Lösung:** Portale auslassen und springen.
- **Abgrenzung:** Ruhiger Weltabschluss, der Mechanikabhängigkeit bestraft.

## Welt IV – Knöpfe und Folgen, Level 40–50

### 40 · DER EHRLICHE KNOPF

- **Bild:** Zwei Ufer; Knopf auf linker Empore, verriegelte Tür rechts, breite Lücke dazwischen.
- **Wirkung:** Knopf öffnet Tür und hebt eine bündige Brücke. Keine Nebenwirkung.
- **Lösung:** Drücken, Brücke queren.
- **Abgrenzung:** Saubere Einführung mit mindestens 140 px Abstand zu allen anderen Objekten.

### 41 · BRÜCKE GEGEN BODEN

- **Bild:** Flache Halle, Knopf links, Tür rechts hinter einer Lücke.
- **Wirkung:** Zuerst steigt die Brücke; 300 ms später sinkt das bisher sichere Mittelfeld.
- **Lösung:** Direkt von altem Boden auf neue Brücke wechseln.
- **Abgrenzung:** Knopf hilft und nimmt zugleich eine frühere Option.

### 42 · KLEINER WEG, GROSSER SPRUNG

- **Bild:** Echter 26-px-Tunnel links, offene hohe Schlucht rechts.
- **Wirkung:** Knopf 1 verkleinert für den Tunnel; Knopf 2 liegt 180 px hinter dem Portal-/Tunneleingang und stellt Normalgröße wieder her.
- **Lösung:** Klein durch Tunnel, Größe zurückholen, Schlucht normal springen.
- **Abgrenzung:** Körperform statt Weltbewegung; erster ausdrücklich schmaler Gang.

### 43 · DER KNOPF ZIEHT UM

- **Bild:** Start unten, Knopf auf linkem Balkon, Tür auf einer hohen rechten Insel.
- **Wirkung:** Tür wird entriegelt; ihre komplette Insel fährt weich nach unten und links.
- **Lösung:** Bewegung abwarten und zum neuen Standort springen.
- **Abgrenzung:** Der Knopf bewegt das Ziel statt einen Weg.

### 44 · DER RÜCKWEG

- **Bild:** Zwei lange übereinanderliegende Korridore; Start/Tür links, Knopf weit rechts oben.
- **Wirkung:** Rückwand im oberen Gang schließt; gleichzeitig öffnet rechts ein Fallschacht zum unteren Gang.
- **Lösung:** Hinweg oben, Fall rechts, Rückweg unten.
- **Abgrenzung:** Klarer Rundkurs ohne Portale.

### 45 · ZWEI KNÖPFE, EINE LÜGE

- **Bild:** Y-förmiger Raum, Knöpfe in weit getrennten linken/rechten Armen, Tür oben mittig.
- **Wirkung:** Links öffnet die Tür und senkt die Aufstiegsplatte. Rechts hebt die Platte, ohne die Tür wieder zu schließen.
- **Lösung:** Links zuerst, rechts danach.
- **Abgrenzung:** Reihenfolgerätsel mit zwei klar sichtbaren Wirkungen.

### 46 · NICHT NOCH EINMAL

- **Bild:** Langer Steg, zwei äußerlich gleiche Knöpfe, hohe Zielnische.
- **Wirkung:** Knopf 1 macht groß und ermöglicht die Stufe. Knopf 2 würde klein machen und ist optional.
- **Lösung:** Zweiten Knopf überspringen.
- **Psychologie:** Wiederholung der Optik erzeugt falsche Pflicht; Nichtdrücken ist die Entscheidung.

### 47 · FAHRENDER SCHALTER

- **Bild:** Zwei Türme und eine Fähre; Knopf mittig auf der Fähre, einzelnes Portal weit hinten auf dem rechten Turm.
- **Wirkung:** Drücken öffnet das Portal und kehrt die Fähre sofort nach kurzer Bremsung um.
- **Lösung:** Gegen die Rückfahrt laufen, rechts abspringen, anschließend das Portal zum freien Zielpunkt hinter der Sperrwand nutzen.
- **Abgrenzung:** Plattformphysik und Knopfreaktion in einem übersichtlichen Raum.

### 48 · DIE TÜR WAR HINTER DIR

- **Bild:** Breiter absteigender Zickzack; Knopf unten rechts, Tür hoch am Start links.
- **Wirkung:** Vier Segmente steigen in neuer Reihenfolge als Rücktreppe. Auf der früher sicheren zweiten Landung erscheint ein Stachel.
- **Lösung:** Neue Treppe lesen und die gelernte Landestelle überspringen.
- **Abgrenzung:** Verbindet Rückweg und Stachelerinnerung aus Welt I.

### 49 · DREI GETRENNTE AKTE

- **Bild:** Startkammer links, hohe Portalhalle mittig, Türinsel rechts; große ruhige Abstände.
- **Ablauf:** Knopf hebt in der Portalhalle eine Plattform. Diese fährt leicht gegen den Spieler; oben liegt ein Portal. Es setzt die Figur ohne Zielportal auf der Zielinsel mit sicherer Zone ab, danach folgt ein ehrlicher Sprung.
- **Lösung:** Drücken, gegen den Träger laufen, Portal betreten, springen.
- **Abgrenzung:** Drei Mechaniken, aber zeitlich vollständig getrennt und nie gleichzeitig animiert.

### 50 · DIE LETZTE GESCHICHTE

- **Bild:** Monumentaler Raum aus hohem Startturm rechts, tiefem U im Zentrum und schmaler Türnische links oben; nur vier große Flächen.
- **Akt 1:** Kontrollierter Fall ins U. Der erwartete Stachel vor dem Knopf bleibt aus; Knopf öffnet ehrlich die Tür und startet den Lift links.
- **Akt 2:** Lift fährt zum hoch liegenden einzelnen Portal, bremst davor und kehrt um. Gegenlaufen und im Zeitfenster eintreten.
- **Akt 3:** Das Portal setzt die Figur frei auf dem linken Dach ab; dort steht kein zweites Portal. Nach 120 px Sicherheitszone schützt ein sichtbarer Stachel den letzten Sprung; direkt vor der Tür geschieht nichts.
- **Finale:** Alle gelernten Fähigkeiten werden abgefragt. Nach dem letzten sichtbaren Hindernis gibt es keine nachträgliche Todesfalle.

## Levelübersicht

Die Auswahl erhält vier gleich breite Tabs und in jeder Kategorie dasselbe kompakte Fünf-Spalten-Raster. Karten zeigen nur zweistellige Nummer und Zustand; lange Namen oder Miniaturbilder kommen in einen separaten Detailbereich, damit nichts übersteht. Der aktuelle Level trägt einen doppelten Rahmen und den Text `AKTUELL`. Weitere Zustände sind `FERTIG`, `SPIELEN` und `GESPERRT`. Beim Öffnen wird automatisch die aktuelle Kategorie gewählt. Auf Mobilgeräten wird das gesamte Menü innerhalb der Bildschirmhöhe gescrollt; kein Inhalt darf den Panelrand überdecken.

## Abnahme je Level

Ein Level wird erst abgehakt, wenn alle folgenden Prüfungen bestanden sind:

1. Silhouette, Hauptrichtung, Triggerfolge und Türlage unterscheiden sich von allen übrigen 49 Leveln; dies wird über die globale Einzigkeitsmatrix geprüft.
2. Jede Fläche besitzt eine spielerische Funktion.
3. Erfolgsweg wurde real gespielt; automatische Lösbarkeit dient nur als Zusatzprüfung.
4. Fall ins Nichts, Stacheln, Trigger und Neustart funktionieren reproduzierbar.
5. Bewegte Teile beginnen und enden bündig, tragen den Spieler korrekt und zeigen keine spätere Wand vorzeitig.
6. Höchstens eine große Animation läuft gleichzeitig; Portal und Knopf haben freie Reaktionszonen.
7. Desktop- und Mobilansicht wurden visuell geprüft.

Die Umsetzung erfolgt anschließend in vier Paketen: 01–14, 15–29, 30–39 und 40–50. Nach jedem Paket werden die Räume einzeln visuell verglichen, bevor die nächste Welt beginnt.
