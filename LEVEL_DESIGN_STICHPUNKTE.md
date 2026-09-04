# Levelplan in Stichpunkten

Ragebait-Plan · 4. September 2026 · 50 Räume implementiert.

**Überarbeiteter Spielstand:** Die To-do-Punkte sind umgesetzt. Alle Räume haben eigene Wandkonturen; zusätzliche Terrassen und Senken variieren die Böden. Neun wiederholte Stacheldecken-Aufbauten wurden durch andere Fallen ersetzt. Wandernde und verschwindende Stacheln, schädliche Knöpfe, schnellere weich animierte Mapteile, kleinere Türen und die Pixel-Bedienleiste ergänzen die ursprüngliche Vorlage unten. Verbindliche aktuelle Abläufe und Positionen stehen in `levels.js`; alle 50 Erfolgswege wurden neu geprüft.

## Grundregeln
- Kategorien schalten Möglichkeiten frei. Jeder Raum verwendet nur die Mechaniken, die zu seiner Fallenidee passen.
- Erwartbare und unerwartete Fallen, falsche Sicherheit und Gemeinheiten direkt vor dem Ziel.
- Im selben Level immer dieselben Orte, Auslöser, Zeitabläufe, Bewegungen und Portalverbindungen.
- Wände und Plattformen töten nicht durch Kontakt. Sie drücken oder heben dich in Stacheln oder Abgründe.
- Mapteile können erst helfen und dann verarschen.
- Portalfarben verraten keine Ziele; Ausgänge über Abgründen sind ausdrücklich erlaubt.
- Buttons wirken fest: größer, kleiner, breiter, schmaler, Tür öffnen, Wand/Boden bewegen.
- Grafikstil bleibt erhalten. Kulissen nach erneut betrachteten [Level-Devil-Bildserien](https://level-devil.org/walkthrough): Korridore, U-Mulden, Schächte, Nischen und verschachtelte Gänge.
- **Umfangsvorschlag: 50 Level.** Portalstart 30 folgt deiner Vorgabe; Bewegungsstart 15 und Buttonstart 40 sind Planungsannahmen.
- Die vollständige Fassung in LEVEL_DESIGN_PLAN.md enthält pro Level Kulisse, festen Fallenablauf und internen Erfolgsweg.

## 01–14 · Nur Stacheln und statische Map

- **01 · Letzter Schritt:** Verborgene Stacheln direkt vor der Tür.
- **02 · Schon wieder?:** Die erwartete Türfalle bleibt aus; der Absprungpunkt ist tödlich.
- **03 · Landung gebucht:** Stacheln erscheinen auf der naheliegenden Landestelle hinter einer Lücke.
- **04 · Kopf hoch:** Bodenstachel provoziert einen Sprung in versteckte Deckenstacheln.
- **05 · Nachzügler:** Stacheln hinter dir bestrafen den reflexhaften Rückzug.
- **06 · Unten wartet's:** U-Mulde mit Fallen unten und kurz vor dem oberen Ausgang.
- **07 · Die freie Mitte:** Scheinbar sichere Mitte wird nach der Landung zur Stachelfalle.
- **08 · Um die Ecke:** Seitliche Stacheln lauern hinter einer engen Ecke.
- **09 · Tür links:** Von rechts nach links laufen; Falle vor einer Bodenvertiefung.
- **10 · Nicht stehen bleiben:** Erstes Podest sicher, zweites bestraft Stehenbleiben.
- **11 · Der Rückzieher:** Stachelfeld macht Platz und schließt den Rückweg wieder.
- **12 · Zahn im Schacht:** Im Schacht in die freie Seite steuern statt direkt zur Tür fallen.
- **13 · Doppelt gemoppelt:** Ähnliche Hügel verlangen gegensätzliche Bewegungen: springen, dann unten bleiben.
- **14 · Endlich durch:** Drei Stacheltäuschungen; die letzte lauert nach dem vermeintlich schweren Teil.

## 15–29 · Bewegliche Mapteile zusätzlich

- **15 · Platz da:** Plötzlich auftauchende Wand schiebt dich auf ein Loch zu.
- **16 · Hoch hinaus:** Aufzug fährt an der Tür vorbei Richtung Deckenstacheln.
- **17 · Der freundliche Boden:** Brücke rettet dich und trägt dich anschließend zur Stachelwand.
- **18 · Seitenschub:** Seitenschub unter niedriger Decke: zum richtigen Zeitpunkt über die Grube.
- **19 · Unter dir weg:** Boden zieht sich weg; nur das untere Podest rettet die Landung.
- **20 · Rettung mit Zähnen:** Rettende Säule fährt nach kurzer Pause weiter in die Gefahr.
- **21 · Treppenwitz:** Stufen heben sich: oben drohen Stacheln, unten entsteht der Weg.
- **22 · Nicht quetschen:** Zusammenfahrende Wände drücken zur Grube; ihre Oberseite bietet die Flucht.
- **23 · Die Tür fährt mit:** Türinsel fährt weg und zurück; Hinterherspringen endet im Abgrund.
- **24 · Decke als Fähre:** Sinkender Deckenbalken wird zur Fähre und steigt danach zu hoch.
- **25 · Gegenverkehr:** Zwei gegensätzliche Schubrichtungen auf Hin- und Rückweg.
- **26 · Der falsche Schutz:** Ein Lift rettet vor Seitenstacheln und schiebt zu Deckenstacheln.
- **27 · Domino-Boden:** Drei Bodenstücke sinken nacheinander; der letzte bricht den erwarteten Takt.
- **28 · Wand oder Weg:** Seitliche Wand wird zum rettenden Boden und fährt danach zu weit.
- **29 · Alles gegen dich:** Schubwand, helfender Aufzug und verräterische Abschlusswand im Z-Gang.

## 30–39 · Portale zusätzlich

- **30 · Falscher Anschluss:** Drei unmarkierte Portalverbindungen; der erste Transport endet über dem Abgrund.
- **31 · Nah ist nicht verbunden:** Nebeneinanderliegende Portale führen in völlig unterschiedliche Kammern.
- **32 · Ankunft von oben:** Portal wirft dich oben in einen Schacht mit tödlicher Falllinie.
- **33 · Rückfahrkarte:** Portal schickt dich zum Start zurück, während der Startboden wegfährt.
- **34 · Die Ankunft fährt:** Portalankunft startet eine Plattform Richtung Stacheldecke.
- **35 · Umleitung:** Eine Wand drückt dich absichtlich erneut ins Portal und damit weiter.
- **36 · Der Köder über dem Loch:** Gerade das Portal über dem Abgrund ermöglicht den richtigen Weg.
- **37 · Falsche Seite:** Fester Austrittsimpuls zeigt zu Stacheln; der Ausgang liegt hinter dir.
- **38 · Vier falsche Freunde:** Vier Kammern, feste unerwartete Verbindungen und unterschiedliche Ankunftsfallen.
- **39 · Noch ein Portal:** Portal vor der Tür schickt dich bei unvorsichtigem Wiedereintritt zurück.

## 40–50 · Buttons zusätzlich

- **40 · Zu groß gefreut:** Größer werden hilft über die Lücke und gefährdet dich unter der Decke.
- **41 · Klein, aber tot:** Verkleinerung öffnet den Tunnel, macht ein winziges Bodenloch aber tödlich.
- **42 · Breitseite:** Breit über den Schlitz; anschließend schmal durch den Wanddurchgang.
- **43 · Schmaler Grat:** Schmal passt in den Schacht und fällt leicht durch den unteren Schlitz.
- **44 · Tür auf, Falle an:** Button öffnet die Tür und startet gleichzeitig die Schubwand.
- **45 · Boden bestellt:** Button fährt eine Brücke herein, die anschließend zu Deckenstacheln steigt.
- **46 · Der falsche Knopf:** Ein Knopf öffnet die Wand; der andere vergrößert dich in Stacheln.
- **47 · Erst breit, dann klein:** Erst breit über den Spalt, dann klein durch den Tunnel.
- **48 · Wandtausch:** Button öffnet den oberen Rückweg und verschiebt den unteren Boden.
- **49 · Falsche Lieferung:** Button verkleinert dich und verschiebt den Boden unter einem gefährlichen Portal.
- **50 · Jetzt aber wirklich:** Breite, Portale, steigender Block, Verkleinerung und ein letzter Türstachel.



Umsetzungsprüfung: Für alle 50 Räume ist ein vollständiger Erfolgsweg in tools/replays.json gespeichert und gegen dieselbe Simulation wie im Spiel geprüft. Zusätzliche Prüfungen decken Kategoriegrenzen, Neustart-Determinismus, Wandkontakt, Mitfahren, Portal-Wiedereintritt und Buttonwirkungen ab. Das ersetzt keine menschliche Bewertung des Schwierigkeitsgrads.
