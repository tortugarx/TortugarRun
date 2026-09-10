# Level Devil – eigener Ragebait-Plattformer

50 vollständig neu entworfene Räume. Hohe Abstiege, Aufzüge, bodenverbundene Fähren, Rückwege und Portalräume mit wenigen gezielten Fallen. Referenzanalyse: [REBUILD.md](REBUILD.md); Raumideen: [LEVEL_DESIGN_STICHPUNKTE.md](LEVEL_DESIGN_STICHPUNKTE.md).

## Starten

```sh
node tools/serve.cjs
```

Port 4173. Der Server liefert ausschließlich Spielassets aus und deaktiviert Browsercaching. Keine externen Laufzeitbibliotheken.

A/D oder Pfeile: laufen. W/↑/Leertaste: springen. R: Neustart. M: Ton. Alle Räume sind freigeschaltet. Touch-Tasten stehen unter der Spielfläche. Der frühere Fokus-/Sonarbutton wurde entfernt.

Auf Handys nutzt das Spielfeld im Hochformat die gesamte Bildschirmhöhe oberhalb der Touch-Tasten. Die unverzerrte Folge-Kamera zeigt einen schmaleren Raumausschnitt und folgt der Schildkröte sowie während eines Portalflugs dessen Pixelspur. Im Querformat arbeitet weiterhin die 1,55-fache Folge-Kamera.

## Regeln

Die Mechaniken werden weiterhin in der Reihenfolge Stacheln, bewegliche Mapteile, Portale und Knöpfe eingeführt. Die Auswahl gruppiert unabhängig davon in fünf gleich große Akte mit je zehn Räumen und zeigt pro Akt ein vollständiges 5×2-Raster. Normale Räume besitzen höchstens drei Stachelfelder; das neue Finale kombiniert bewusst zwölf. Portalziele sind fest und farblich nicht verraten. Steine schieben und tragen, verursachen aber keinen Kontaktschaden.

Versteckte ortsabhängige Stacheln reagieren an einer festen Linie vor ihrer Spitze. Der Sensor reicht vertikal über die Bodenzone, sodass ein gemerkter hoher Sprung die Auslösung nicht umgeht. Je nach Level fahren sie in ungefähr 63–94 ms vollständig aus. Nach einem Treffer laufen Spike-, Mechanik- und Todesanimationen 900 ms sichtbar weiter, bevor der Dialog erscheint.

Level 1 zeigt eine hoch platzierte Pixeltafel für Laufen, Springen und das Ziel, die Tür zu erreichen. Sie liegt außerhalb der Sprunghöhe und bleibt im mobilen Kamerafenster sichtbar. Levelnamen erscheinen beim Start eines Raums nicht mehr als Popup. Todesnachrichten unterscheiden die konkrete Ursache; die Tür löst die Figur in dieselben groben Pixelpartikel wie die Todesanimation auf. Die fünf Auswahlkategorien heißen `STACHELN`, `BEWEGUNG`, `PORTALE`, `KNÖPFE` und `FINALE`. Auf Computern und Tablets im Querformat ist der Trackingmodus automatisch deaktiviert und wird als `OFF` angezeigt; auf unterstützten Mobilgeräten lässt er sich zwischen `ON` und `OFF` umschalten. Unter den Optionen zeigt `ABOUT` Version 1.4.1, die letzten Änderungen und `BY StoiberRules`.

Für Nixpacks liegt eine `nixpacks.toml` bei. Der Startbefehl ist `node tools/serve.cjs`; der Server bindet sich an `0.0.0.0` und übernimmt die vom Host gesetzte Variable `PORT`.

Auf einer Plattform addieren sich ihre Verschiebung und die eigene Laufbewegung. Gegenlaufen reduziert den Weg in Fahrtrichtung, Mitlaufen vergrößert ihn. Auch sinkende Plattformen tragen. Bewegte Wände stoppen nicht am Spieler und schieben ihn weiter; tödlich wird erst die echte Gefahr dahinter. Kurze Portalreisen unterbrechen die übrigen Mechaniken nicht.

## Prüfen

```sh
node tools/check-levels.cjs
node tools/check-sequences.cjs
node tools/check-mechanics.cjs
node tools/check-challenge.cjs
node tools/check-game.cjs
node tools/check-chat-requirements.cjs
```

50 gespeicherte Gewinnwege, 50 tatsächlich verschiedene Terrain-Silhouetten, späte Fallenfenster, kontinuierliche Wandbewegungen, Start- und Laufzeitkollisionen, Neustart-Determinismus, Trägerphysik, Portaltransport, Körpergröße und alle Wege durch die tatsächliche Spielanbindung werden geprüft. Die Herausforderungsauswertung verwendet ausschließlich gemessene Eigenschaften der echten Gewinnwege; sie erfindet weder Fehlversuche noch Spielzeit. Die Ablaufprüfung löst Mechaniken gleichzeitig und versetzt aus und prüft bei 120 Hz die kompletten 15-Sekunden-Abläufe einschließlich Befestigungen, Objektabständen und Endpunkten.

`node tools/solve-levels.cjs 1,2,3` sucht neue Wege mit der Spielphysik. `PLAYWRIGHT_MODULE=/pfad/zu/playwright node tools/browser-audit.cjs` prüft mit installiertem Playwright die 50 Browseransichten und erzeugt Screenshots in /tmp.

## Dateien

`levels.js`: Räume, Fallenideen und Abläufe. `world.js`: Physik mit 120 Hz. `game.js`: Canvas und Eingaben. `style.css`: Darstellung. `tools/`: Prüfungen, Solver und Assetserver.
