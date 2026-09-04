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

## Raumaufbau und Abwechslung

- [ ] Ungewollte Überschneidungen von Elementen vermeiden; auch Bewegungswege und Endpositionen kontrollieren. Durch Spielerfeedback wieder geöffnet; siehe offene Nacharbeiten.

## Regeln für die Umsetzung

- Ragebait statt Education: Überraschung und falsche Erwartungen prägen die Level.
- Jeder Versuch desselben Levels verhält sich identisch: feste Stachelpositionen, Auslöser, Zeitabläufe, Bewegungen, Knopfwirkungen und Portalziele; kein Zufall zwischen Versuchen.
- Wände und andere Map-Teile verursachen keinen Kontaktschaden. Sie schieben oder heben; tödlich werden beispielsweise Stacheln oder ein Sturz in ein Loch.
- Kategoriegrenzen beibehalten: zuerst Stacheln, danach bewegliche Map-Teile, ab Level 30 Portale, anschließend Knöpfe. Freigeschaltete Mechaniken müssen nicht in jedem weiteren Level vorkommen.
- Portale erhalten keine Farbcodierung, die das Ziel verrät; ihre Verbindungen bleiben trotzdem fest.
- Bestehenden Grafikstil beibehalten und die oben gewünschten Anpassungen an Erkennbarkeit, Buttons und Tür darin umsetzen.
