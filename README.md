# Level Devil — eigenes Ragebait-Spiel

50 von Hand angelegte Räume mit festen Überraschungsfallen. Eine Wand kann retten oder in Stacheln schieben; Portalziele sind nicht farblich erkennbar. Jeder Raum verhält sich bei gleichen Eingaben immer gleich.

## Spielen

`index.html` direkt öffnen oder den Ordner über einen lokalen Webserver bereitstellen. Es gibt keinen Build-Schritt und keine externen Laufzeitabhängigkeiten.

- A / D oder ← / →: bewegen
- W, ↑ oder Leertaste: springen
- R: Raum neu starten
- F / linke Umschalttaste oder !: Fokus
- M: Ton umschalten

Touch-Tasten werden auf Geräten mit Touch-Eingabe eingeblendet. Alle 50 Räume sind direkt freigeschaltet, auch ohne URL-Parameter oder bisherigen Fortschritt. Ton und automatischer Neustart werden lokal gespeichert.

## Kategorien

| Räume | Ab hier verfügbar |
|---|---|
| 01–14 | Stacheln in statischen Räumen |
| 15–29 | Zusätzlich bewegliche Mapteile |
| 30–39 | Zusätzlich gerichtete Portale |
| 40–50 | Zusätzlich Buttons und Körperverformungen |

Ein Raum muss nicht alle freigeschalteten Mechaniken verwenden. Mapteile verursachen keinen Kontaktschaden; tödlich sind Stacheln und der Absturz aus dem Raum.

## Aufbau

Die Überarbeitung der To-do-Liste ergänzt für alle 50 Räume eigene Wandkonturen, unter anderem Terrassen, Senken, niedrige Gänge und Schächte. Der obere Rand ist durchgehend Wand; die Bedienleiste trägt kontrastreiche Pixel-Symbole. Hintergrundblöcke ohne Kollision entfallen. Die kleinere Tür besitzt eine entsprechend verkleinerte Trefferfläche.

Stacheln können feste Bewegungsfolgen abfahren, auf beweglichen Teilen mitfahren oder nach einem Auslöser dauerhaft verschwinden. Beispiele: wandernde Landefalle in Raum 3, verschwindende Stacheln in Raum 7, rettender Boden mit verzögerter Falle in Raum 20 und schädlicher Knopf in Raum 46. Bewegte Mapteile beschleunigen und bremsen weich; ihre Fahrtzeiten sind gegenüber dem vorherigen Stand verkürzt, bewusste Wartezeiten bleiben erhalten. Das Portal in Raum 34 fährt mit seinem Träger, seine Zielverbindung bleibt fest.

- `levels.js`: Geometrie, feste Auslöser, Bewegungsfolgen, Portalziele und Buttontypen für alle 50 Räume.
- `world.js`: Gemeinsame Simulation mit 120 festen Schritten pro Sekunde, ohne Spielzufall.
- `game.js`: Canvas-Darstellung, Eingaben, Menüs und Fortschritt im bestehenden Stil.
- `LEVEL_DESIGN_PLAN.md` und `LEVEL_DESIGN_STICHPUNKTE.md`: Designvorlage und Kurzfassung. Die abgestimmten Raumdaten stehen in `levels.js`.

## Prüfungen

Mit Node.js ausführen:

```sh
node tools/check-levels.cjs
node tools/check-mechanics.cjs
node tools/check-game.cjs
```

Die erste Prüfung kontrolliert Kategorien, Startpositionen, Portalziele, Determinismus und alle 50 gespeicherten Erfolgswege. Die zweite prüft Schieben ohne Kontakttod, blockierte Wände, Mitfahren, gerichtete Portale, Größenänderung und gekoppelte Buttonwirkungen. Die dritte führt die tatsächliche Spielanbindung mit einem simulierten DOM aus und prüft Zeichnen, Raumwahl, fünf vollständige Spielabläufe, Abschlussbildschirm, Touch-Eingabe und Neustart-Timer.

Nach Änderungen kann `node tools/solve-levels.cjs 1,2,3` neue Erfolgswege für ausgewählte Räume suchen. Die Suche ist ein Entwicklungswerkzeug, keine automatische Aussage über Spielspaß oder den idealen Schwierigkeitsgrad.

Zusätzlich prüfen die Tests sichtbare Türen, Portale und Knöpfe gegen die Startgeometrie sowie Spieler, Türen und Portale während sämtlicher Erfolgswege gegen bewegte Mapteile. Eigene Mechanikprüfungen decken verschwindende und wandernde Stacheln, Wiederherstellung beim Neustart, schädliche Knöpfe und Stacheln auf beweglichen Trägern ab. Gedrückte Bodenknöpfe werden von darüberfahrenden Wänden verdeckt und nicht auf deren Vorderseite gezeichnet.
