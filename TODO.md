# To-do

Erste Überarbeitung am 4. September 2026 umgesetzt und geprüft. Das anschließende Spielerfeedback erfordert die folgenden offenen Nacharbeiten; die Liste ist daher noch nicht abgeschlossen. Details zum bisherigen Stand stehen in `README.md`; die aktuellen Raumdaten stehen in `levels.js`.

## Offene Nacharbeiten aus dem Spielerfeedback

- [ ] Zusammenhängende Layouts bauen: Statische Blöcke müssen sinnvoll mit Boden, Wänden oder Decke verbunden sein. Unbegründet frei schwebende Blöcke wie im Screenshot entfernen oder in die Raumgeometrie integrieren. Ausnahmen sind bewegliche Blöcke oder vergleichbare Elemente mit einer konkreten spielerischen Funktion.
- [ ] Tür vereinfachen: eine schlichte Öffnung mit rundem Bogen im passenden Pixelstil gestalten. Die bisherigen kleinteiligen Verzierungen und Türfüllungen entfernen.
- [ ] Keine fliegenden oder frei schwebenden Stacheln: Stacheln müssen an Boden, Wand, Decke oder einem beweglichen Mapteil sitzen. Auch während ihrer gesamten Bewegung muss diese Verbindung erhalten bleiben; bestehende Fälle korrigieren.
- [ ] Layouts funktional gestalten: Höhen, Schächte, Wände und Wege müssen für den tatsächlichen Spielablauf eine Aufgabe erfüllen. Raumformen nicht bloß zur optischen Abwechslung hinzufügen.
- [ ] Start- und Türpositionen stärker variieren: beispielsweise oben starten und zur Tür hinuntergelangen, unten starten oder mitten im Raum beginnen. Daraus unterschiedliche notwendige Wege und Fallenabläufe entwickeln.
- [ ] Level 35 als positives Beispiel für ein funktionales Layout heranziehen. Seine Verbindung von Raumaufbau und Spielablauf als Maßstab nutzen, ohne den Aufbau einfach zu kopieren.
- [ ] Begonnene Animationen vollständig bis zu ihrem vorgesehenen Endzustand laufen lassen. Abbrüche und vorzeitig stehenbleibende Bewegungen untersuchen; Bewegungswege und Platzbedarf so abstimmen, dass die Abläufe vollständig funktionieren.
- [ ] Überlappende Items und Spielelemente weiterhin konsequent beseitigen. Alle Level über vollständige Abläufe prüfen, einschließlich Auslösen, Bewegung und Endpositionen; die bisherigen Prüfungen auf Gewinnwegen reichen dafür nicht aus.

## Bedienung und Erkennbarkeit

- [x] Den leeren oberen Bereich hinter den Anzeigen und Steuerelementen durch eine durchgehende Wand bis zum oberen Rand ersetzen (siehe Screenshot); dort keinen freien Hintergrundstreifen lassen.
- [x] Die oberen Steuerelemente und Anzeigen auf der Wand gut sichtbar und lesbar gestalten: deutliche Kontraste, erkennbare Symbole und klare Umrandungen.
- [x] Die obere Bedienleiste schöner und pixeliger gestalten, mit zum Spiel passenden Pixel-Symbolen, Rahmen und Schaltflächen.
- [x] Restart-Button genauso wie den Level-Button gestalten.
- [x] Knöpfe im Level deutlich vom Hintergrund abheben.
- [x] Hintergrund und spielbare Flächen klarer voneinander unterscheiden; den Hintergrund bei Bedarf anpassen.
- [x] Ausgangstür kleiner und schöner gestalten, passend zum bestehenden Grafikstil.

## Raumaufbau und Abwechslung

- [x] Noch einmal viele Bilder verschiedener Level-Devil-Level ansehen und deren Raumaufbau als Referenz nutzen. Dashier bleibt ein eigenes Spiel, kein Plattformer.
- [x] Viele unterschiedliche Szenen und Raumformen entwerfen. Böden und Wände sind bisher zu ähnlich; ihre Anordnung, Höhen, Aussparungen und Wege stärker variieren.
- [ ] Ungewollte Überschneidungen von Elementen vermeiden; auch Bewegungswege und Endpositionen kontrollieren. Durch Spielerfeedback wieder geöffnet; siehe offene Nacharbeiten.
- [x] Das wiederholte Muster „Boden schiebt den Spieler in eine extra Stacheldecke“ aufbrechen. Stattdessen unterschiedliche Fallenabläufe und plötzlich auftauchende Stacheln einsetzen.

## Stacheln und Überraschungen

- [x] Stachel- und Wandfallen weniger vorhersehbar gestalten: wiederkehrende Positionen, Abstände und Auslöser aufbrechen. Fallen dürfen sowohl an erwarteten als auch an unerwarteten Stellen erscheinen; erwartete Fallen gelegentlich auslassen.
- [x] Bewegliche Stacheln einsetzen.
- [x] Bereits sichtbare Stacheln verschwinden lassen, sodass zuvor versperrte Wege frei werden.
- [x] Stacheln bei passenden Auslösern plötzlich erscheinen lassen.

## Bewegliche Wände und Böden

- [x] Wandbewegungen beschleunigen; Geschwindigkeit und Bewegungsverlauf je Falle abstimmen.
- [x] Bewegungen flüssiger animieren und ruckelige Übergänge vermeiden.
- [x] Positionen, Abmessungen, Einfahrwege und Endpunkte besser an die Umgebung anpassen.
- [x] Bewegliche Teile unterschiedlich einsetzen: Sie können helfen, heben, schieben oder den Spieler hereinlegen und dürfen erst während des Versuchs auftauchen beziehungsweise losfahren.

## Knöpfe und ihre Folgen

- [x] Auch Knöpfe gegen den Spieler arbeiten lassen: Größenänderungen, Türen und verschobene Böden oder Wände können sowohl hilfreich als auch eine Falle sein.

## Regeln für die Umsetzung

- Ragebait statt Education: Überraschung und falsche Erwartungen prägen die Level.
- Jeder Versuch desselben Levels verhält sich identisch: feste Stachelpositionen, Auslöser, Zeitabläufe, Bewegungen, Knopfwirkungen und Portalziele; kein Zufall zwischen Versuchen.
- Wände und andere Map-Teile verursachen keinen Kontaktschaden. Sie schieben oder heben; tödlich werden beispielsweise Stacheln oder ein Sturz in ein Loch.
- Kategoriegrenzen beibehalten: zuerst Stacheln, danach bewegliche Map-Teile, ab Level 30 Portale, anschließend Knöpfe. Freigeschaltete Mechaniken müssen nicht in jedem weiteren Level vorkommen.
- Portale erhalten keine Farbcodierung, die das Ziel verrät; ihre Verbindungen bleiben trotzdem fest.
- Bestehenden Grafikstil beibehalten und die oben gewünschten Anpassungen an Erkennbarkeit, Buttons und Tür darin umsetzen.
