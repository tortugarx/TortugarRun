# To-do

Erste Überarbeitung am 4. September 2026 umgesetzt und geprüft. Das anschließende Spielerfeedback erfordert die folgenden offenen Nacharbeiten; die Liste ist daher noch nicht abgeschlossen. Details zum bisherigen Stand stehen in `README.md`; die aktuellen Raumdaten stehen in `levels.js`.

## Offene Nacharbeiten aus dem Spielerfeedback

- [x] Zusammenhängende Layouts bauen: Statische Blöcke sind mit der Raumhülle oder einem funktionalen beweglichen Mapteil verbunden; eine automatisierte Komponentenprüfung sichert das ab.
- [x] Tür vereinfachen: Die Tür ist eine offene, schlichte Pixelbogen-Silhouette ohne Türblatt, Paneele oder Beschläge.
- [x] Keine fliegenden oder frei schwebenden Stacheln: Statische und bewegte Endpositionen sind an Terrain oder Träger gebunden und werden automatisiert geprüft.
- [x] Layouts funktional gestalten: Lose Dekorplattformen wurden entfernt oder als tragende Wände, Wege, Fallenbetten und Rückweg-Mapteile integriert.
- [x] Start- und Türpositionen stärker variieren: Hohe, tiefe, mittige und umgekehrte Start-/Zielwege bleiben über die vollständigen Gewinn-Replays abgedeckt.
- [x] Level 35 als positives Beispiel für ein funktionales Layout heranziehen: Die überarbeiteten Verbindungen koppeln Raumform und notwendigen Ablauf, ohne Raum 35 zu duplizieren.
- [x] Begonnene Animationen vollständig bis zu ihrem vorgesehenen Endzustand laufen lassen: Mapteile dürfen in vorgesehenes statisches Terrain einfahren; alle Endzustände werden separat erzwungen und geprüft.
- [x] Überlappende Items und Spielelemente weiterhin konsequent beseitigen: Startzustände, komplette Gewinnabläufe sowie erzwungene Bewegungsendstände sind Teil der Prüfungen.

## Raumaufbau und Abwechslung

- [x] Ungewollte Überschneidungen von Elementen vermeiden; Bewegungswege und Endpositionen werden zusätzlich zu den Gewinnwegen kontrolliert.

## Regeln für die Umsetzung

- Ragebait statt Education: Überraschung und falsche Erwartungen prägen die Level.
- Jeder Versuch desselben Levels verhält sich identisch: feste Stachelpositionen, Auslöser, Zeitabläufe, Bewegungen, Knopfwirkungen und Portalziele; kein Zufall zwischen Versuchen.
- Wände und andere Map-Teile verursachen keinen Kontaktschaden. Sie schieben oder heben; tödlich werden beispielsweise Stacheln oder ein Sturz in ein Loch.
- Kategoriegrenzen beibehalten: zuerst Stacheln, danach bewegliche Map-Teile, ab Level 30 Portale, anschließend Knöpfe. Freigeschaltete Mechaniken müssen nicht in jedem weiteren Level vorkommen.
- Portale erhalten keine Farbcodierung, die das Ziel verrät; ihre Verbindungen bleiben trotzdem fest.
- Bestehenden Grafikstil beibehalten und die oben gewünschten Anpassungen an Erkennbarkeit, Buttons und Tür darin umsetzen.
