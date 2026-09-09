# Härte- und Layoutpass vom 9. September 2026

- [x] Versteckte Fallen früh genug auslösen und auf 120–180 ms Ausfahrzeit normieren.
- [x] Jeden bewegten Mapteil bei seitlicher/quetschender Kollision tödlich machen, ohne Markierung; korrektes Mitfahren bleibt sicher.
- [x] Portale als animierte, ineinanderlaufende Quadrate klar von Türen unterscheiden.
- [x] Knopfgrafik kleiner, einfacher und ruhiger zeichnen.
- [x] Schwache Silhouetten durch Leerräume, Türme, Engstellen, Zickzack und Vertikalschluchten ersetzen.
- [x] Alle 50 Gewinnwege nach dem Härtepass neu berechnen und im echten Spieladapter prüfen.
- [x] Alle 50 Räume, Portalframes, Knöpfe und das Menü auf Desktop und Mobil visuell abnehmen.

# Überarbeitung vom 8. September 2026

## Freigegebener Szenenplan

- [x] Alle 50 Szenen des freigegebenen Plans exakt in die tatsächlichen Leveldaten übertragen.
- [x] Raum-Silhouetten im Spiel deutlich genug unterscheiden: mehr echte schmale Gänge, Schächte, Türme, Inseln, Etagen und Überhänge.
- [x] Bewegte Böden/Wände pro Level stärker unterscheiden und gegnerische Richtungswechsel ausbauen.
- [x] Plattformimpuls: Mitfahren, Gegenlaufen langsamer, Mitlaufen schneller.
- [x] Globaler Tod beim Fall unter den Spielraum.
- [x] Stachel-Erwartungen konsequent über aufeinanderfolgende Räume verschieben.
- [x] Portal- und Knopflevel vollständig gegen den Szenenplan prüfen und ähnliche Abläufe ersetzen.
- [x] Vier konsistente, klar unterscheidbare Weltpaletten statt wechselnder Farben pro Level.
- [x] Levelübersicht repariert: kein Überlauf, kompakte Karten sowie klare Zustände `AKTUELL`, `FERTIG`, `SPIELEN`, `GESPERRT`.
- [x] Animationsbudget begrenzt; Partikel nur für wichtige Ereignisse.
- [x] Mechanik-, Sequenz- und vollständige 50-Level-Spieltests erfolgreich.

- [x] Alle 50 Räume nach visuellem Vergleich einzeln abnehmen; automatische Lösbarkeit allein reicht nicht.
- [x] Funktionale, baulich verbundene Geometrie ohne Dekorstützen.
- [x] Stacheln durchgehend an Terrain oder Träger befestigt.
- [x] Maximal drei Gefahren und zwei Bewegungsmechaniken pro Raum; gekoppelte Segmente einer Brücke oder Treppe zählen als ein System.
- [x] Hohe, tiefe, mittige und umgekehrte Starts und Ziele.
- [x] Freiraum zwischen Portalen, Knöpfen und Türen.
- [x] Relative Laufbewegung auf Trägern und absteigende Plattformen geprüft.
- [x] Weltbewegung während Portaltransport; weniger Partikel und Kamerawackeln.
- [x] 50 Gewinnwege, alle Spieladapter-Durchläufe und vollständige Mechanik-Zeitachsen geprüft.
- [x] Alle 50 Räume und das Levelmenü nach dem Umbau erneut im Browser visuell kontrolliert (Desktop 1200×800, Mobil 390×844, Gesamttafel aller Räume).

## Verbindliche Regeln

Feste Auslöser und Portalziele, kein Zufall zwischen Versuchen. Jeder bewegte Mapteil kann bei seitlicher oder quetschender Kollision töten, ohne sichtbare oder interne Gefahrenmarkierung; korrektes Mitfahren bleibt sicher. Mechaniken ab Raum 1/15/30/40: Stacheln, bewegte Mapteile, Portale, Knöpfe. Keine verräterischen Portalfarben. Bestehender Pixelstil.

Automatische Lösbarkeit ersetzt keine persönliche Bewertung des Schwierigkeitsgrads. Weiteres Spielerfeedback bleibt maßgeblich.
