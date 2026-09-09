# Level Devil – eigener Ragebait-Plattformer

50 vollständig neu entworfene Räume. Hohe Abstiege, Aufzüge, bodenverbundene Fähren, Rückwege und Portalräume mit wenigen gezielten Fallen. Referenzanalyse: [REBUILD.md](REBUILD.md); Raumideen: [LEVEL_DESIGN_STICHPUNKTE.md](LEVEL_DESIGN_STICHPUNKTE.md).

## Starten

```sh
node tools/serve.cjs
```

Port 4173. Der Server liefert ausschließlich Spielassets aus und deaktiviert Browsercaching. Keine externen Laufzeitbibliotheken.

A/D oder Pfeile: laufen. W/↑/Leertaste: springen. R: Neustart. F: Fokus. M: Ton. Alle Räume sind freigeschaltet. Touch-Tasten stehen unter der Spielfläche.

Auf Handys nutzt das Spielfeld im Hochformat die gesamte Bildschirmhöhe oberhalb der Touch-Tasten. Die unverzerrte Folge-Kamera zeigt einen schmaleren Raumausschnitt und folgt der Schildkröte sowie während eines Portalflugs dessen Pixelspur. Im Querformat arbeitet weiterhin die 1,55-fache Folge-Kamera.

## Regeln

Räume 1–14: Stacheln; ab 15: bewegliche Mapteile; ab 30: Portale; ab 40: Knöpfe. Pro Raum maximal drei Stachelfelder und zwei bewegliche Bauteile. Portalziele sind fest und farblich nicht verraten. Steine schieben und tragen, verursachen aber keinen Kontaktschaden.

Auf einer Plattform addieren sich ihre Verschiebung und die eigene Laufbewegung. Gegenlaufen reduziert den Weg in Fahrtrichtung, Mitlaufen vergrößert ihn. Auch sinkende Plattformen tragen. Bewegte Wände stoppen nicht am Spieler und schieben ihn weiter; tödlich wird erst die echte Gefahr dahinter. Kurze Portalreisen unterbrechen die übrigen Mechaniken nicht.

## Prüfen

```sh
node tools/check-levels.cjs
node tools/check-sequences.cjs
node tools/check-mechanics.cjs
node tools/check-challenge.cjs
node tools/check-game.cjs
```

50 gespeicherte Gewinnwege, 50 tatsächlich verschiedene Terrain-Silhouetten, späte Fallenfenster, kontinuierliche Wandbewegungen, Start- und Laufzeitkollisionen, Neustart-Determinismus, Trägerphysik, Portaltransport, Körpergröße und alle Wege durch die tatsächliche Spielanbindung werden geprüft. Die Herausforderungsauswertung verwendet ausschließlich gemessene Eigenschaften der echten Gewinnwege; sie erfindet weder Fehlversuche noch Spielzeit. Die Ablaufprüfung löst Mechaniken gleichzeitig und versetzt aus und prüft bei 120 Hz die kompletten 15-Sekunden-Abläufe einschließlich Befestigungen, Objektabständen und Endpunkten.

`node tools/solve-levels.cjs 1,2,3` sucht neue Wege mit der Spielphysik. `PLAYWRIGHT_MODULE=/pfad/zu/playwright node tools/browser-audit.cjs` prüft mit installiertem Playwright die 50 Browseransichten und erzeugt Screenshots in /tmp.

## Dateien

`levels.js`: Räume, Fallenideen und Abläufe. `world.js`: Physik mit 120 Hz. `game.js`: Canvas und Eingaben. `style.css`: Darstellung. `tools/`: Prüfungen, Solver und Assetserver.
