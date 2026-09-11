# Tortuga Trials – Pixel-Plattformer mit fiesen Fallen

50 vollständig neu entworfene Räume. Hohe Abstiege, Aufzüge, bodenverbundene Fähren, Rückwege und Portalräume mit wenigen gezielten Fallen. Referenzanalyse: [REBUILD.md](REBUILD.md); Raumideen: [LEVEL_DESIGN_STICHPUNKTE.md](LEVEL_DESIGN_STICHPUNKTE.md).

Produktionsversion: https://tortugarr.github.io/tortuga-trials/  
Das separate öffentliche Repository `Tortugarr/tortuga-trials` enthält ausschließlich die im Browser benötigten Laufzeitdateien; dieses Entwicklungsrepository bleibt privat.

## Starten

```sh
node tools/serve.cjs
```

Port 4173. Der Server liefert ausschließlich Spielassets aus und deaktiviert Browsercaching. Auf CrazyGames wird zusätzlich das offizielle SDK v3 geladen; außerhalb von CrazyGames und localhost bleibt die Plattformanbindung deaktiviert.

A/D oder Pfeile: laufen. W/↑/Leertaste: springen. R: Neustart. M: Ton. Neue Spielstände beginnen mit Raum 1 und schalten jeden weiteren Raum der Reihe nach frei. Touch-Tasten stehen unter der Spielfläche. Der frühere Fokus-/Sonarbutton wurde entfernt.

Auf Handys nutzt das Spielfeld im Hochformat die gesamte Bildschirmhöhe oberhalb der Touch-Tasten. Mit Tracking `ON` zeigt die unverzerrte Folge-Kamera einen schmaleren Raumausschnitt und folgt der Schildkröte sowie während eines Portalflugs dessen Pixelspur. Mit Tracking `OFF` wird das vollständige 16:9-Level ohne Beschnitt oder Verzerrung eingepasst. Ein hochauflösender, an die Pixeldichte des Displays angepasster Canvas hält die Folgeansicht scharf. Im Querformat arbeitet weiterhin die 1,55-fache Folge-Kamera.

## Regeln

Die Mechaniken werden weiterhin in der Reihenfolge Stacheln, bewegliche Mapteile, Portale und Knöpfe eingeführt. Die Auswahl gruppiert unabhängig davon in fünf gleich große Akte mit je zehn Räumen und zeigt pro Akt ein vollständiges 5×2-Raster. Normale Räume besitzen höchstens drei Stachelfelder; das neue Finale kombiniert bewusst zwölf. Portalziele sind fest und farblich nicht verraten. Steine schieben und tragen, verursachen aber keinen Kontaktschaden.

Versteckte ortsabhängige Stacheln reagieren an einer festen Linie vor ihrer Spitze. Der Sensor reicht vertikal über die Bodenzone, sodass ein gemerkter hoher Sprung die Auslösung nicht umgeht. Je nach Level fahren sie in ungefähr 63–94 ms vollständig aus. Nach einem Treffer laufen Spike-, Mechanik- und Todesanimationen 900 ms sichtbar weiter, bevor der Dialog erscheint.

Level 1 zeigt eine scharf gerenderte, bündig am linken Spielfeldrand sitzende HTML-Tafel in lesbarer Pixeloptik für Laufen, Springen und das Ziel, die Tür zu erreichen. Neue Spielstände beginnen mit Level 1; jeder Abschluss schaltet genau den nächsten Raum frei. Die gesamte sichtbare Oberfläche einschließlich aller Levelnamen, Beschreibungen, Statusangaben und Tooltips ist englisch und verwendet dieselbe Schriftfamilie. Levelnamen erscheinen beim Start eines Raums nicht mehr als Popup; beim erstmaligen Betreten einer neuen Zehnergruppe erscheint stattdessen kurz deren Kategorie. Mehrere englische, humorvolle Todesnachrichten rotieren passend zur konkreten Ursache. Die Tür zerfällt zunächst wie beim Tod in grobe Pixel und wird dann eingesogen. Die fünf Auswahlkategorien heißen `SPIKES`, `MOVING WALLS`, `PORTALS`, `BUTTONS` und `FINAL TRIALS`. Tracking startet auf Mobilgeräten automatisch mit `ON`, auf Desktop und Tablet-Querformat mit `OFF`; der Schalter bleibt auf jedem Gerät bedienbar. Der separate, große ABOUT-Dialog zeigt ohne Changelog Version 1.0 und `by StoiberRules`. Alle Buttons besitzen eckige Pixelkanten und größere, vereinfachte Symbole.

Für Nixpacks liegt eine `nixpacks.toml` bei. Der Startbefehl ist `node tools/serve.cjs`; der Server bindet sich an `0.0.0.0` und übernimmt die vom Host gesetzte Variable `PORT`.

## CrazyGames

`crazygames.js` initialisiert SDK v3, übernimmt Fortschritt und Einstellungen in CrazyGames Data und meldet Lade-, Gameplay- und Fortschrittsereignisse. Der Turtle Shop bietet sechs Skins. Jeder regulär abgeschlossene Raum vergibt 10 Shells mit sichtbarer Animation; eine freiwillige Rewarded Ad im Shop vergibt 50 Shells. Nach jedem zehnten Tod wird an einer natürlichen Unterbrechung eine Midgame Ad angefragt. Im Todesdialog kann der nächste Raum über eine Rewarded Ad oder alternativ für 100 Shells übersprungen werden; ein Überspringen vergibt keine Abschlussbelohnung. Belohnungen und Skips erfolgen ausschließlich nach `adFinished`, nie bei `adError`. CrazyGames steuert Verfügbarkeit, Häufigkeit und tatsächliche Länge der Anzeigen.

Auf einer Plattform addieren sich ihre Verschiebung und die eigene Laufbewegung. Gegenlaufen reduziert den Weg in Fahrtrichtung, Mitlaufen vergrößert ihn. Auch sinkende Plattformen tragen. Bewegte Wände stoppen nicht am Spieler und schieben ihn weiter; tödlich wird erst die echte Gefahr dahinter. Kurze Portalreisen unterbrechen die übrigen Mechaniken nicht.

## Prüfen

```sh
node tools/check-levels.cjs
node tools/check-sequences.cjs
node tools/check-mechanics.cjs
node tools/check-challenge.cjs
node tools/check-game.cjs
node tools/check-chat-requirements.cjs
node tools/check-crazygames.cjs
```

50 gespeicherte Gewinnwege, 50 tatsächlich verschiedene Terrain-Silhouetten, späte Fallenfenster, kontinuierliche Wandbewegungen, Start- und Laufzeitkollisionen, Neustart-Determinismus, Trägerphysik, Portaltransport, Körpergröße und alle Wege durch die tatsächliche Spielanbindung werden geprüft. Die Herausforderungsauswertung verwendet ausschließlich gemessene Eigenschaften der echten Gewinnwege; sie erfindet weder Fehlversuche noch Spielzeit. Die Ablaufprüfung löst Mechaniken gleichzeitig und versetzt aus und prüft bei 120 Hz die kompletten 15-Sekunden-Abläufe einschließlich Befestigungen, Objektabständen und Endpunkten.

`node tools/solve-levels.cjs 1,2,3` sucht neue Wege mit der Spielphysik. `PLAYWRIGHT_MODULE=/pfad/zu/playwright node tools/browser-audit.cjs` prüft mit installiertem Playwright die 50 Browseransichten und erzeugt Screenshots in /tmp.

## Dateien

`levels.js`: Räume, Fallenideen und Abläufe. `world.js`: Physik mit 120 Hz. `game.js`: Canvas, Eingaben und Ökonomie. `crazygames.js`: isolierte Plattformanbindung. `style.css`: Darstellung. `tools/`: Prüfungen, Solver und Assetserver.
