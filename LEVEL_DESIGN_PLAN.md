# Leveldesign: Ragebait mit festen Fallen
Stand: 4. September 2026 · Entwurf und Umsetzungsgrundlage · 50 Räume implementiert.

**Überarbeitung nach To-do-Liste:** Die aktuelle Umsetzung erweitert die ursprünglichen Raumideen unten um individuelle Wandkonturen für alle 50 Räume, zusätzliche Bodenformen, wandernde und dauerhaft verschwindende Stacheln sowie weitere schädliche Knopfwirkungen. Neun ähnliche Stacheldecken-Konstruktionen sind durch Fallen auf Wegen und Trägern ersetzt. Mapteile fahren schneller mit weichen Übergängen. Die obere Wand ist geschlossen, die Bedienleiste erhält klare Pixel-Symbole und Türen sind kleiner. Die konkreten aktuellen Geometrien, Auslöser und Bewegungsfolgen in `levels.js` ersetzen abweichende Details dieser ursprünglichen Vorlage; alle 50 Räume besitzen erneut geprüfte Erfolgswege.

## Richtung
Das Spiel soll den Spieler verarschen: Ein erwartetes Hindernis kann harmlos sein, die scheinbar sichere Landestelle tödlich, eine rettende Wand im nächsten Moment der Grund für den Absturz. Es gibt keine pädagogische Pflicht, jede Mechanik zuerst ungefährlich vorzuführen. Überraschende Tode, falsche Sicherheit, Wiederholungen mit einem anderen Haken und Fallen unmittelbar vor der Tür gehören ausdrücklich dazu.

Die Ungewissheit besteht beim ersten Entdecken. Die Regeln des einzelnen Levels ändern sich niemals zufällig. Wer Ort, Reihenfolge und Timing kennt, kann denselben Lösungsweg wiederholen. Die unterschiedlichen Fallenreaktionen zwischen zwei Levels sind Absicht; wechselnde Fallenreaktionen im selben Level sind es nicht.

Der bisherige freundliche Rätselplan wird durch diesen Entwurf ersetzt. Allgemeine Mindestwarnzeiten, garantierte sichere Portalankünfte, ausschließlich hilfreiche Raumveränderungen und überall sichere Wartezonen entfallen. Auch ein beim ersten Kontakt kaum vermeidbarer Tod darf Teil des Witzes sein. Es muss aber einen reproduzierbaren vollständigen Erfolgsweg geben.

## Umfang und Kategorien
Deine Angabe „beim 30. Level kommen Portale dazu“ wird wörtlich übernommen. Weil danach noch eine Button-Kategorie folgt, geht dieser Vorschlag über die bisherigen 30 Räume hinaus. Als **Planungsannahme** werden 50 Level angesetzt; Start von Kategorie 2 bei 15 und Kategorie 4 bei 40 sind Vorschläge, keine von dir bereits festgelegten Grenzen.

| Level | Erlaubte Mechaniken |
|---|---|
| 01–14 | Statische Map, feste Löcher und Stacheln; Stacheln dürfen verborgen sein und ausgelöst werden. |
| 15–29 | Zusätzlich bewegliche, plötzlich hervorkommende, sinkende oder zurückweichende Mapteile. |
| 30–39 | Zusätzlich Portale mit festen, visuell nicht verratenen Zielverbindungen. |
| 40–50 | Zusätzlich Buttons für Körpermaße, Türen und das Verschieben von Mapteilen. |

Die Kategorien bestimmen ausschließlich die Verfügbarkeit. Kein Raum muss alle bis dahin eingeführten Mechaniken enthalten; nur die zur jeweiligen Fallenidee passenden Elemente werden verwendet. Frühere Mechaniken bleiben in späteren Kategorien erlaubt. Vor Level 15 bewegt sich kein Boden und keine Wand. Vor Level 30 gibt es kein Portal. Vor Level 40 gibt es keinen Button; vorherige Bewegungen entstehen durch feste Orts-, Kontakt- oder Bewegungsereignisse.

## Grafik und räumlicher Aufbau
Farbstimmung, bestehender Zeichenstil, Figurendesign, Oberfläche und Effekte bleiben erhalten. Geändert werden die Form der Räume, Positionen der Objekte und deren Verhalten. Körperverformungen ab der Button-Kategorie sind die ausdrücklich gewünschte Mechanik, kein neues Figurendesign. Portalverbindungen werden nicht durch ein neues Farbsystem erklärt.

Erneut visuell geprüft: [Level-Devil-Bildserien](https://level-devil.org/walkthrough), Kapitel 1 Gruppen 1, 2, 3, 8 und 9 sowie Kapitel 2 Gruppe 5. Darunter flache Korridore, ein abgestuftes U-Becken, tiefe vertikale Schächte, versetzte Türnischen, übereinanderliegende Gänge und Räume um große massive Blöcke. Die Nummern sind die Beschriftungen der inoffiziellen Galerie. Die Bilder zeigen Geometrie; konkrete Trigger und Zeitabläufe unten sind unsere eigenen Entwürfe.

Unsere Kulissen verwenden ähnliche Grundformen: wenige große rechteckige Massen, klare Hohlräume dazwischen, kleine Figur im vergleichsweise großen Raum und eine sichtbare, oft verdächtig nahe Tür. Nicht jeder Raum ist eine Reihe schwebender Plattformen. Vertikale Räume, Rückwege, Sackgassen, niedrige Tunnel und einzelne tiefe Einschnitte wechseln sich ab. Kein Kopieren der Farben oder Grafiken der Referenz.

## Verbindliche Spielregeln
1. **Tod:** durch Stacheln oder Fall aus dem Spielbereich. Wände, Böden, Decken und Plattformen töten bei Kontakt niemals. Sie schieben, blockieren oder heben die Figur, auch in eine gefährliche Situation hinein.
2. **Quetschen:** Kontakt zwischen zwei Mapteilen ist kein unsichtbarer Quetschtod. Bewegung endet an einem vorgesehenen Anschlag oder verdrängt die Figur entlang eines festgelegten freien Wegs. In den Raumdaten muss diese Bewegung tatsächlich geometrisch möglich sein.
3. **Fallen:** Position, Auslöser, Verzögerung, Bewegung, Geschwindigkeit und Endposition sind pro Level fest. Es gibt keine zufälligen Stachelpositionen oder an die bisherigen Tode angepasste Varianten.
4. **Zeit:** Alle Zeitabläufe beginnen mit Raumstart oder einem bestimmten Ereignis, nicht mit einer global weiterlaufenden Uhr. Dieselbe Eingabefolge nach Neustart erzeugt denselben Ablauf.
5. **Portale:** Kein verlässlicher Farbcode, keine Paarlinien, keine Zielvorschau. Falls vorhandene Farben verwendet werden, haben sie keinerlei Bedeutung für die Verbindung. Ein Portal darf über einem Abgrund oder neben Stacheln enden. Drei Portale sind möglich; Verbindungen sind gerichtete Zuordnungen statt zwingend symmetrischer Paare.
6. **Portalzustand:** Die Buchstaben A/B/C/D im Plan sind ausschließlich interne Bezeichnungen. Position, Ziel, Austrittsrichtung und Austrittsgeschwindigkeit sind fest. Buttons verändern in diesem Entwurf keine Portalverbindungen. Ein belegter Ausgang löst nicht automatisch endlose Teleportationen aus: Erst nach Verlassen und erneutem Betreten wird er wieder als Eingang aktiv.
7. **Buttons:** Wirkung darf überraschen und mehrere feste Folgen haben. Keine zufälligen Effekte. Größen beziehen sich auf die unveränderte Standardfigur. Größer/kleiner verändert beide Maße, breiter/schmaler nur die Breite. Bewegung und Sprungkraft bleiben grundsätzlich gleich. Soweit nicht anders angegeben ist ein Button einmalig pro Versuch.
8. **Körper und Kollision:** Größenänderungen verändern die tatsächliche Kollisionsform. Füße bleiben beim Skalieren auf dem Boden; horizontale Verankerung und freie Wachstumsrichtung werden pro Button festgelegt. Berühren neu gewachsene Körperteile Stacheln, ist das tödlich. Überlappung mit einer gewöhnlichen Wand allein ist kein Todesgrund.
9. **Fokus:** Keine Pflicht zur Benutzung und keine erklärende Tutorialfunktion. Falls die bestehende Anzeige erhalten bleibt, darf sie den kompletten Überraschungsablauf nicht verraten. Eine spätere Anpassung wäre Logikarbeit; der Plan führt keine neue Grafik dafür ein.
10. **Versuche:** Keine Regeländerung nach dem Tod. Alle Schalter, Größen, Portale und bewegten Teile werden zurückgesetzt. Neustart bleibt jederzeit verfügbar. Ein Level darf nach einer falschen Entscheidung verloren sein; es darf nicht das Spiel technisch festsetzen.
11. **Ragebait-Rhythmus:** Leere Strecken, offensichtliche Fallen, versteckte zweite Fallen und kurze scheinbar geschenkte Abschnitte bewusst mischen. Nicht jedes Level hat den gleichen Dreifach-Twist. Nach echtem Sieg keine nachträgliche Aberkennung.

## Vollständiger Plan
Die Lösungswege sind Produktionsnotizen. Sie werden Spielern nicht als Hinweise eingeblendet. Alle Entwürfe müssen später mit tatsächlichen Körpermaßen und Sprungweiten auf Durchspielbarkeit geprüft werden.

## Kategorie 1 · Nur Stacheln

### 01 · Letzter Schritt
**Kulisse:** Flacher langer Korridor, links Start, rechts Tür; fast der ganze Boden ist leer.

**Falle und fester Ablauf:** Erst einen Schritt vor der Tür fährt ein verborgenes Stachelfeld aus. Die große leere Mitte macht unvorsichtig.

**Geplanter Erfolgsweg:** Vor dem letzten Feld abspringen und hinter ihm direkt vor der Tür landen.

### 02 · Schon wieder?
**Kulisse:** Gleiche grobe Korridorform, aber Tür auf einem niedrigen festen Absatz.

**Falle und fester Ablauf:** Die erwartete Stelle vor der Tür bleibt leer. Stattdessen sitzen Stacheln auf dem üblichen Absprungpunkt davor.

**Geplanter Erfolgsweg:** Früher abspringen und auf dem Absatz landen. Das aus Raum 01 übernommene Timing scheitert.

### 03 · Landung gebucht
**Kulisse:** Zwei breite feste Ufer mit einer kurzen offenen Lücke; Tür rechts.

**Falle und fester Ablauf:** Beim Überqueren der Lücke erscheinen Stacheln genau auf der naheliegenden Landestelle.

**Geplanter Erfolgsweg:** Den Sprung kurz halten und am vorderen Rand landen oder das Feld vollständig überspringen; beide Varianten geometrisch ermöglichen.

### 04 · Kopf hoch
**Kulisse:** Niedriger Tunnel mit einem kleinen sichtbaren Bodenstachel und etwas höherem Deckenbereich daneben.

**Falle und fester Ablauf:** Über dem offensichtlichen Hindernis fahren Deckenstacheln aus, sobald der Sprung beginnt.

**Geplanter Erfolgsweg:** Mit einem kurzen Sprung unter der Decke bleiben. Ein hoher Standardsprung trifft die zweite Falle.

### 05 · Nachzügler
**Kulisse:** Gerader Gang, drei voneinander getrennte Stachelstellen, rechts eine feste Stufe.

**Falle und fester Ablauf:** Nach dem Passieren erscheinen Stacheln hinter der Figur; vor der Stufe kommt ein weiteres Feld. Zurückweichen führt in die erste Falle.

**Geplanter Erfolgsweg:** Vorwärts bleiben und das letzte Feld aus bekannter Position überwinden.

### 06 · Unten wartet's
**Kulisse:** Breite U-Mulde mit festen Stufen hinunter und wieder hinauf; Tür oben rechts.

**Falle und fester Ablauf:** Am Muldenboden sitzt das erwartbare Feld. Das unerwartete liegt auf der vorletzten Stufe des Aufstiegs.

**Geplanter Erfolgsweg:** Unten kurz und oben früher springen; das Aufstiegstiming unterscheidet sich bewusst vom Abstieg.

### 07 · Die freie Mitte
**Kulisse:** Zwei sichtbare Stachelgruppen begrenzen eine großzügig wirkende Landefläche.

**Falle und fester Ablauf:** Beim ersten Betreten dieser Mitte erscheint dort nach fester kurzer Verzögerung ein drittes Feld.

**Geplanter Erfolgsweg:** Die Mitte nur kurz berühren und sofort weiterspringen. Die Verzögerung wird so abgestimmt, dass dies zuverlässig möglich ist.

### 08 · Um die Ecke
**Kulisse:** L-förmiger Gang um einen festen Deckenblock, Tür im unteren rechten Schenkel.

**Falle und fester Ablauf:** Kurz hinter der Ecke fahren seitliche Stacheln aus der festen Wand. Wer an der Ecke springt, trifft außerdem ein höheres Stachelpaar.

**Geplanter Erfolgsweg:** Mit Abstand zur Wand unten passieren und erst hinter dem seitlichen Feld springen.

### 09 · Tür links
**Kulisse:** Start rechts, Ausgang links; niedriger gerader Gang mit einer kleinen Bodenvertiefung.

**Falle und fester Ablauf:** Ein verborgenes Feld aktiviert sich bei Bewegung nach links vor der Vertiefung. Die üblichen Rechtslauf-Erwartungen greifen nicht.

**Geplanter Erfolgsweg:** Den Auslöser von rechts erkennen und in einem kurzen Sprung über das Feld in die Vertiefung gelangen.

### 10 · Nicht stehen bleiben
**Kulisse:** Zwei breite feste Podeste in einer flachen Senke, Tür rechts.

**Falle und fester Ablauf:** Das erste Podest ist sicher; auf dem optisch ähnlichen zweiten fahren nach Bodenkontakt verzögerte Stacheln aus.

**Geplanter Erfolgsweg:** Das zweite Podest mit unmittelbarem Folgesprung verlassen. Kein Timer läuft vor dem Kontakt.

### 11 · Der Rückzieher
**Kulisse:** Gerader Raum mit einem breiten sichtbaren Feld vor der Mitte und einem kurzen versteckten dahinter.

**Falle und fester Ablauf:** Annäherung fährt das sichtbare Feld einmal ein. Beim Durchlaufen fährt es hinter der Figur wieder aus; das hintere Feld erscheint.

**Geplanter Erfolgsweg:** Durch die entstandene Lücke laufen und am festen zweiten Auslöser springen. Rückzug wird bestraft.

### 12 · Zahn im Schacht
**Kulisse:** Oben links ein Startabsatz, darunter ein breiter fester Schacht mit Ausgang in einer rechten Seitennische.

**Falle und fester Ablauf:** Beim Fallen wachsen an der rechten Schachtwand Stacheln auf der direkten Linie zur Tür.

**Geplanter Erfolgsweg:** Zunächst links fallen, unter dem Wandfeld nach rechts steuern und in der Seitennische landen.

### 13 · Doppelt gemoppelt
**Kulisse:** Zwei feste niedrige Hügel mit freier Fläche dazwischen, Tür hinter dem zweiten.

**Falle und fester Ablauf:** Am ersten Hügel erscheint ein Bodenfeld, am zweiten ein Deckenfeld über der typischen Sprungbahn.

**Geplanter Erfolgsweg:** Den ersten Hügel überspringen, den zweiten bodennah passieren. Wiederholung derselben Bewegung endet tödlich.

### 14 · Endlich durch
**Kulisse:** Langer flacher Raum mit einer festen Mittelerhebung und drei getrennten Engstellen.

**Falle und fester Ablauf:** Erst Absprungstacheln, dann verzögerte Landestacheln, zuletzt ein Feld direkt vor der Tür. Der letzte Abschnitt wirkt absichtlich leer.

**Geplanter Erfolgsweg:** Drei festgelegte Sprungstellen verbinden; nach dem zweiten Hindernis noch nicht auf Autopilot schalten.

## Kategorie 2 · Bewegliche Mapteile kommen hinzu

### 15 · Platz da
**Kulisse:** Ebener Gang mit einem einzelnen Loch kurz vor der Tür; links davon viel freier Boden.

**Falle und fester Ablauf:** Eine unsichtbar im Boden versenkte Wand fährt hinter der Figur hoch und schiebt nach rechts auf das Loch zu.

**Geplanter Erfolgsweg:** Beim bekannten Auslöser vor der Wand bleiben und den Schub für den Sprung über die Lücke nutzen. Die Wand selbst tötet nicht.

### 16 · Hoch hinaus
**Kulisse:** Breiter Mittelblock als Aufzug, niedrige Decke mit Stacheln, Tür rechts auf einer festen Galerie.

**Falle und fester Ablauf:** Beim Betreten fährt der Block hoch und hält nicht auf Türhöhe an, sondern weiter in Richtung Deckenstacheln.

**Geplanter Erfolgsweg:** Auf Höhe der Galerie seitlich aussteigen; oben bleiben bedeutet Tod an Stacheln.

### 17 · Der freundliche Boden
**Kulisse:** Kurze feste Ufer und eine zunächst fehlende Brücke über einer breiten Grube.

**Falle und fester Ablauf:** Annäherung schiebt eine Bodenplatte rettend in die Lücke. Nach dem Betreten zieht sie sich weiter und trägt die Figur Richtung Stachelwand.

**Geplanter Erfolgsweg:** Mitfahren, aber an der festen Ausstiegsstelle abspringen. Derselbe Helfer wird zum Verräter.

### 18 · Seitenschub
**Kulisse:** Niedriger Korridor, kleine Grube in der Mitte, breite Wand rechts.

**Falle und fester Ablauf:** Eine Wand links wächst seitlich in den Gang und drückt die Figur zur Grube. Ihr Endanschlag liegt unmittelbar davor.

**Geplanter Erfolgsweg:** Den ersten Teil des Schubs zulassen und beim Anschlag über die Grube springen. Zu frühes Springen kollidiert nur mit der niedrigen Decke.

### 19 · Unter dir weg
**Kulisse:** Breiter waagerechter Mittelboden über einer tiefen Senke, Tür auf dem rechten Ufer.

**Falle und fester Ablauf:** Nach Überschreiten der Mitte gleitet die Bodenhälfte nach links weg. Rechts bleibt kein normaler Landepunkt; unten steht ein kleines festes Podest zwischen Stacheln.

**Geplanter Erfolgsweg:** Am festen Auslöser zurücksteuern, auf dem unteren Podest landen und über eine feste Seitentreppe hinausgehen.

### 20 · Rettung mit Zähnen
**Kulisse:** Offene Mulde mit Stacheln am Boden und einer versenkten breiten Säule.

**Falle und fester Ablauf:** Die Säule schießt hoch und fängt einen vermeintlich verlorenen Fall ab. Nach kurzer Pause fährt sie weiter zu einem seitlichen Stachelvorsprung.

**Geplanter Erfolgsweg:** Die erste Rettung annehmen, dann während der Pause links auf den festen Rand wechseln.

### 21 · Treppenwitz
**Kulisse:** Drei breite Stufen, dahinter der Ausgang; darunter liegt ein niedriger durchgehender Gang.

**Falle und fester Ablauf:** Beim Betreten der mittleren Stufe fahren alle drei Stufen hoch. Wer oben bleibt, landet an Deckenstacheln; unten öffnet sich ein Durchgang.

**Geplanter Erfolgsweg:** Nach Auslösung zurück vom Stufenrand fallen und unter den angehobenen Stufen hindurchgehen. Kein Button.

### 22 · Nicht quetschen
**Kulisse:** Zwei gegenüberliegende Schiebewände, in der Mitte eine Bodenaussparung mit Stacheln.

**Falle und fester Ablauf:** Die Wände fahren zusammen und drücken die Figur zur Aussparung. Der Kontakt mit beiden Wänden ist kein Todesgrund.

**Geplanter Erfolgsweg:** Vor dem Schließen auf die Oberkante der niedrigeren Wand springen und mitfahren. Tod nur beim Absturz in die Aussparung.

### 23 · Die Tür fährt mit
**Kulisse:** Ausgang auf einer breiten Bodeninsel, davor ein kleiner fester Tritt, darunter Stacheln.

**Falle und fester Ablauf:** Nähe zur Insel startet eine horizontale Fahrt von der Figur weg. Nach festem Anschlag fährt sie einmal zurück; beim zweiten Annähern startet sie nicht erneut.

**Geplanter Erfolgsweg:** Auf dem Tritt warten und beim Rückweg auf die Insel wechseln. Hinterherzuspringen führt in die Grube.

### 24 · Decke als Fähre
**Kulisse:** Tiefe U-Mulde, am oberen Rand ein großer Deckenbalken, Tür gegenüber.

**Falle und fester Ablauf:** Der Balken sinkt in die Mulde und trägt die Figur über das Stachelfeld, hebt sich am Ende aber wieder unter eine Stacheldecke.

**Geplanter Erfolgsweg:** Auf den sinkenden Balken gelangen und am rechten Ufer rechtzeitig absteigen. Der Fall des Balkens allein verletzt nicht.

### 25 · Gegenverkehr
**Kulisse:** Zwei breite Laufbahnen um einen rechteckigen Mittelblock; Start unten links, Tür oben links.

**Falle und fester Ablauf:** Im unteren Gang fährt ein Block nach links gegen die Figur; oben fährt ein zweiter nach rechts. Beide drücken Richtung verschiedener Stachelstellen.

**Geplanter Erfolgsweg:** Unten in einer festen Aussparung vorbeilassen, rechts aufsteigen und oben auf der Rückseite des zweiten Blocks mitgehen.

### 26 · Der falsche Schutz
**Kulisse:** Niedriger Gang mit sichtbaren Wandstacheln rechts und einem mittigen Bodenblock.

**Falle und fester Ablauf:** Der Block hebt die Figur über die seitlichen Stacheln, aber in eine zweite, zunächst verborgene Stachelreihe an der Decke.

**Geplanter Erfolgsweg:** Nur bis zur halben Höhe mitfahren und auf einen seitlichen festen Absatz wechseln.

### 27 · Domino-Boden
**Kulisse:** Drei große Bodenstücke über einer Grube, dazwischen kurze feste Stege.

**Falle und fester Ablauf:** Nach dem Betreten des ersten Stücks kippt keine Grafik: Die Stücke fahren nacheinander senkrecht nach unten, jeweils mit festem Zeitversatz.

**Geplanter Erfolgsweg:** Über die Stege im bekannten Takt weitergehen und springen. Der dritte Abschnitt beginnt früher als die regelmäßige Folge vermuten lässt, aber immer gleich.

### 28 · Wand oder Weg
**Kulisse:** Raum mit hohem zentralem Block, Start links oben, Ausgang rechts unten, Stacheln in der direkten Senke.

**Falle und fester Ablauf:** Beim Fallen fährt eine Wand seitlich unter die Figur und wird zum Boden. Sie schiebt anschließend unter den Zielabsatz weiter und könnte die Figur an seitliche Stacheln tragen.

**Geplanter Erfolgsweg:** Auf der neuen Oberseite landen, bis zum Zielabsatz mitfahren und rechtzeitig abspringen.

### 29 · Alles gegen dich
**Kulisse:** Breiter Z-förmiger Gang mit einer Grube pro waagerechtem Abschnitt und Tür unten rechts.

**Falle und fester Ablauf:** Zuerst schiebt eine Wand zur Grube, dann hilft ein hochfahrender Boden darüber, zuletzt drückt eine zweite Wand vom Ausgang weg in Stacheln.

**Geplanter Erfolgsweg:** Ersten Schub nutzen, auf dem Aufzug früh aussteigen und die letzte Wand auf ihrer Oberkante überqueren. Keine neue Mechanik, drei wechselnde Rollen.

## Kategorie 3 · Portale kommen hinzu

### 30 · Falscher Anschluss
**Kulisse:** Ein flacher Gang mit drei gleichartig dargestellten Portalen: A links, B auf dem Zielufer, C über der mittleren Grube.

**Falle und fester Ablauf:** Der vermeintlich passende Eingang A führt zu C über dem Abgrund. Die Verbindungen sind fest: A→C, C→B, B→A.

**Geplanter Erfolgsweg:** A betreten, bei C seitlich auf den schmalen festen Grubenrand landen, C bewusst erneut betreten und so B erreichen. Wer nach dem Auftauchen nur rechts hält, fällt.

### 31 · Nah ist nicht verbunden
**Kulisse:** Zwei übereinanderliegende Gänge und eine getrennte Türkammer; vier Portale A unten links, B daneben, C oben, D im Zielraum.

**Falle und fester Ablauf:** Die räumlich nahen Portale gehören nicht zusammen. A→C, C→A, B→D, D→B. Im oberen Gang erscheint ein Stachelfeld am Ausgang von C.

**Geplanter Erfolgsweg:** A ist die Falle; das erreichbare B führt zum Zielraum. Keine Farbe und keine Vorschau verrät dies.

### 32 · Ankunft von oben
**Kulisse:** Hoher rechteckiger Schacht, Ausgang seitlich unten, Portal A am Start und B über dem Schacht.

**Falle und fester Ablauf:** A→B, B→A. Nach dem Transport fällt die Figur immer mit derselben Anfangsgeschwindigkeit; in der direkten Falllinie liegen Stacheln.

**Geplanter Erfolgsweg:** Schon beim Ende der Teleportation nach links steuern, auf dem festen Zwischenabsatz landen und zur Tür wechseln.

### 33 · Rückfahrkarte
**Kulisse:** U-förmiger Raum mit drei Portalen: A unten, B rechts vor der Tür, C oben am Start.

**Falle und fester Ablauf:** A→C, C→B, B→A. Das scheinbar hilfreiche untere Portal schickt zunächst zurück. Bei der Ankunft an C fährt der Startboden seitlich weg.

**Geplanter Erfolgsweg:** Nach Ankunft von C auf den festen Rand ausweichen und C erneut betreten, um B zu erreichen.

### 34 · Die Ankunft fährt
**Kulisse:** Zwei Ufer über Stacheln, A am Start, B auf einer breiten beweglichen Platte.

**Falle und fester Ablauf:** A→B, B→A. Ankunft bei B löst nach fester Verzögerung die Platte aus; sie fährt unter eine niedrige Stacheldecke.

**Geplanter Erfolgsweg:** Nach Teleportation sofort auf den rechten festen Absatz wechseln. Die Platte startet bei jedem Versuch erst durch dieselbe Ankunft.

### 35 · Umleitung
**Kulisse:** Drei durch feste Wände getrennte Kammern: A in Startkammer, B mittig, C im Zielraum.

**Falle und fester Ablauf:** A→B, B→C, C→A. Die Wand neben B fährt bei Ankunft vor und drückt die Figur zurück in B, wodurch sie überraschend weitertransportiert wird.

**Geplanter Erfolgsweg:** Den ersten Schub zulassen, im Zielraum sofort seitlich aus C herausgehen. Gegen die Wand anzukämpfen führt zu Bodenstacheln.

### 36 · Der Köder über dem Loch
**Kulisse:** Breiter Raum mit sichtbarer Tür rechts; A auf normalem Boden links, B unmittelbar am Grubenrand, C über dem Abgrund.

**Falle und fester Ablauf:** A→C, C→A, B→A. Die direkte Türroute ist zu weit; bei Ankunft an C steigt eine rettende Säule hoch, fährt anschließend jedoch zu Deckenstacheln.

**Geplanter Erfolgsweg:** A nutzen, auf der Säule landen und auf halber Höhe zum Zielufer abspringen. Das bedrohliche Portal ist der richtige Weg.

### 37 · Falsche Seite
**Kulisse:** Zwei getrennte niedrige Gänge mit A unten rechts und B oben rechts, Tür oben links.

**Falle und fester Ablauf:** A→B, B→A. Ausgangsimpuls von B zeigt fest nach rechts zu Wandstacheln, obwohl der richtige Weg links liegt.

**Geplanter Erfolgsweg:** Nach dem Transport sofort nach links gegensteuern und im oberen Gang zur Tür gehen. Verbindung und Impuls bleiben konstant.

### 38 · Vier falsche Freunde
**Kulisse:** Vier kleine Kammern um einen massiven Kreuzblock; A links unten, B links oben, C rechts unten, D rechts oben bei der Tür.

**Falle und fester Ablauf:** A→C, C→B, B→D, D→A. Jede Zwischenankunft hat eine andere Falle: Bodenstacheln bei C, ein schiebender Block bei B.

**Geplanter Erfolgsweg:** Bei C links herausgehen und erneut eintreten, bei B auf den Block steigen und B wieder betreten; bei D seitlich zur Tür aussteigen.

### 39 · Noch ein Portal
**Kulisse:** Langer niedriger Gang, in der Mitte zwei Ebenen, Tür rechts. A am Start, B mittig oben, C direkt vor der Tür.

**Falle und fester Ablauf:** A→B, B→C, C→A. C steht so im Weg, dass ungebremstes Weiterlaufen den Spieler kurz vor dem Ziel zum Start schickt.

**Geplanter Erfolgsweg:** A und B nutzen, bei Ankunft C seitlich verlassen und anschließend über den Portalbereich zur Tür springen. Ausstieg und Sprungraum bleiben technisch erreichbar.

## Kategorie 4 · Buttons kommen hinzu

### 40 · Zu groß gefreut
**Kulisse:** Ebener Raum mit Button vor einer niedrigen Decke und einer breiten Grube; Tür rechts.

**Falle und fester Ablauf:** Der Button setzt Breite und Höhe auf 150 %. Die größere Figur kann die kleine Lücke überbrücken, berührt unter dem niedrigen Dach aber Deckenstacheln.

**Geplanter Erfolgsweg:** Den Button von seiner rechten Seite auslösen, sodass der Körper in den hohen Raum hineinwächst, dann über die Grube. Die Größe bleibt bis zum Neustart bestehen.

### 41 · Klein, aber tot
**Kulisse:** Hoher Startbereich, niedriger Tunnel, danach ein kleines Loch und Ausgang.

**Falle und fester Ablauf:** Button setzt Breite und Höhe auf 60 %. Man passt durch den Tunnel, fällt nun aber durch die kleine Lücke, die der normale Körper noch überspannt hätte.

**Geplanter Erfolgsweg:** Verkleinern, durch den Tunnel gehen und das kleine Loch bewusst überspringen. Kein automatischer Sicherheitsausgleich.

### 42 · Breitseite
**Kulisse:** Raum mit kurzem Bodenschlitz und dahinter engem vertikalem Wanddurchgang.

**Falle und fester Ablauf:** Erster Button setzt nur die Breite auf 180 %. Damit überbrückt die Figur den Schlitz, trifft danach aber seitliche Stacheln am engen Durchgang. Zweiter Button vor dem Durchgang setzt die Breite auf 70 %.

**Geplanter Erfolgsweg:** Breit über den Schlitz, zweiten Button drücken und schmal durch den Durchgang. Die Höhe bleibt gleich.

### 43 · Schmaler Grat
**Kulisse:** Schmaler senkrechter Schacht neben einer breiten Türkammer, am Start ein Button.

**Falle und fester Ablauf:** Button setzt nur die Breite auf 55 %. Der Schacht wird passierbar, aber am Boden öffnet sich zwischen zwei festen Kanten ein sehr schmaler tödlicher Schlitz.

**Geplanter Erfolgsweg:** Schmal in den Schacht fallen und vor dem unteren Schlitz nach rechts in die Türkammer steuern.

### 44 · Tür auf, Falle an
**Kulisse:** Langer Gang mit einer sichtbaren verschlossenen Tür rechts und Button in der linken Hälfte.

**Falle und fester Ablauf:** Der Button öffnet die Tür und fährt gleichzeitig eine Wand hinter der Figur nach rechts. Sie drückt auf ein Stachelfeld kurz vor dem Ausgang.

**Geplanter Erfolgsweg:** Button auslösen, mit dem Schub mitgehen und das Stachelfeld an der festen Stelle überspringen. Die Wand selbst richtet keinen Schaden an.

### 45 · Boden bestellt
**Kulisse:** Große Grube trennt Start und Ziel; Button am linken Rand, darüber ein niedriger fester Deckenblock.

**Falle und fester Ablauf:** Button fährt eine Brücke von rechts herein. Nach voller Ausfahrt steigt die Brücke bis unter Deckenstacheln; ein zweiter Druck ändert nichts.

**Geplanter Erfolgsweg:** Erste waagerechte Bewegung abwarten, zügig überqueren und vor dem anschließenden Hub abspringen. Der Button ist einmalig.

### 46 · Der falsche Knopf
**Kulisse:** Zwei Buttons auf einem kleinen mittleren Podest, Tür hinter einer Schiebewand rechts.

**Falle und fester Ablauf:** Linker Button setzt den Körper auf 150 % und drückt ihn dadurch gegen nahe Seitenstacheln; rechter Button öffnet die Wand. Keine Beschriftung erklärt die Wirkung.

**Geplanter Erfolgsweg:** Den linken Button überspringen und rechts landen. Beide Knöpfe behalten in jedem Versuch exakt ihre Wirkung.

### 47 · Erst breit, dann klein
**Kulisse:** Drei Kammern: Bodenschlitz, niedriger Tunnel, hoher Zielraum. Vor jeder Verbindung steht ein Button.

**Falle und fester Ablauf:** Button A setzt Breite 180 % und Höhe 100 %; B setzt beide auf 60 %. Wer B zu früh über eine Abkürzung erreicht, wird vor dem Schlitz zu klein.

**Geplanter Erfolgsweg:** Erst mit A den Schlitz überbrücken, dann B für den Tunnel auslösen. Transformationen setzen absolute Größen, sie stapeln sich nicht.

### 48 · Wandtausch
**Kulisse:** Zwei parallele Gänge, Tür links oben, Start links unten; Button ganz rechts.

**Falle und fester Ablauf:** Button zieht die obere Trennwand zurück und fährt gleichzeitig den unteren Boden nach rechts über Stacheln. Der zuerst sicher wirkende Rückweg verschwindet.

**Geplanter Erfolgsweg:** Beim Drücken nach oben auf den festen Quersteg springen, dann durch den neu geöffneten oberen Gang zurückgehen.

### 49 · Falsche Lieferung
**Kulisse:** Drei Portale A im Startgang, B in einer Buttonkammer, C über einer Grube vor der Tür; niedrige Nische am Zielufer.

**Falle und fester Ablauf:** A→B, B→C, C→A. Der Button in B verkleinert auf 60 % und verschiebt den Boden unter C nach links. Ohne Betätigung führt C zum Tod, weil die große Figur die niedrige rettende Nische nicht erreicht.

**Geplanter Erfolgsweg:** In B den Button auslösen, erneut B betreten, bei C auf dem verschobenen Boden landen und rechtzeitig in die niedrige Nische wechseln.

### 50 · Jetzt aber wirklich
**Kulisse:** Großer rechteckiger Raum mit unterem Hinweg, oberem Rückweg, Mittelschacht und Ausgang nahe dem Start. Zwei Buttons und drei Portale.

**Falle und fester Ablauf:** A unten rechts→C über dem Mittelschacht, C→B oben rechts, B→A. Button 1 unten setzt Breite 180 % und öffnet den Weg zu A. Die Ankunft bei C hebt einen Block Richtung Deckenstacheln. Button 2 oben setzt beide Maße auf 60 % und öffnet den niedrigen Gang zur Tür; vor ihr liegt das letzte verborgene Stachelfeld.

**Geplanter Erfolgsweg:** Mit Button 1 den Bodenschlitz überwinden, A nutzen, von der steigenden Fläche seitlich aussteigen und C erneut für B betreten. Oben Button 2 auslösen, links zurückgehen und den letzten Türstachel kurz überspringen. Erst tatsächlicher Türkontakt beendet den Raum.

## Umsetzung und Prüfung
Umgesetzt in levels.js und world.js: 50 einzeln definierte Räume, deterministische Ereignisse, bewegte Kollisionskörper, gerichtete Portale und Buttons. Die Raumideen unten sind die Designvorlage; für die tatsächlich abgestimmten Koordinaten, Objektpositionen und Zeiten ist levels.js maßgeblich. Bei der Umsetzung wurden Engstellen, Plattformpausen und einige Wege an die vorhandene Sprungphysik angepasst. Der bestehende Zeichenstil bleibt erhalten.

Raumauswahl, Fortschritt und Abschlussbedingung unterstützen die 50 Räume und vier Kategorien. Die alten Raumlisten und der ungenutzte Generator wurden durch die expliziten Definitionen in levels.js ersetzt. world.js simuliert mit 120 festen Schritten pro Sekunde; game.js übernimmt Bedienung und bestehende Darstellung.

Jede Falle erhält eine eigene feste Kennung und einen konkreten Auslöser: etwa Eintritt in ein Rechteck, Verlassen einer Bodenfläche, erster Bodenkontakt, Sprungbeginn in einer Zone oder Ankunft an einem bestimmten Portal. Keine pauschale globale Bedingung wie „Spieler ist irgendwann rechts von x“ für Rückwege verwenden. Zweite Aktivierungen erfolgen nur, wenn sie ausdrücklich Teil des Entwurfs sind.

Für jeden Raum prüfen:
- Erfolgsweg vollständig auf Tastatur und Touch möglich; Abstände, Plattformhöhe, Portalwiedereintritt und Körpermaße passen zusammen.
- Naheliegender Erstversuch scheitert an der geplanten Falle und nicht an fehlerhafter Kollision.
- Wände tragen oder schieben korrekt; kein Tod nur durch Wandkontakt, kein Durchdrücken durch undurchlässige Mapteile.
- Ein hilfreicher Block darf später gefährlich werden, aber weder Trigger noch Bewegung ändern sich zufällig.
- Portalziel ist konstant; ein Ausgang über der Grube hat die geplante feste Fall-/Austrittsbewegung. Bei erforderlichem Wiedereintritt liegt ein tatsächlich erreichbarer Rand oder Absatz in Sprungweite.
- Wachstum an Buttons ist geometrisch definiert. Absolute Größen verhindern unabsichtliches Stapeln bei wiederholten Kontakten.
- Nach Neustart denselben Ablauf mehrfach mit derselben Eingabefolge reproduzieren; unterschiedliche Bildraten dürfen die Ereignisreihenfolge nicht verändern.
- Kategoriegrenzen automatisch gegen die verwendeten Objekttypen prüfen.
- Grafikvergleich gegen den bisherigen Stil; keine farblichen Lösungshinweise ergänzen.

Es werden keine garantierten Warnfenster oder sicheren Portalankünfte nachträglich eingebaut, die den geplanten Witz entschärfen. Abgestimmt werden die reproduzierbare Lösbarkeit und saubere Kollisionen. Konkrete Pixelkoordinaten und Millisekundenwerte gehören zur Umsetzung, nicht zu bereits getesteten Zusagen dieses Entwurfs.



Umsetzungsprüfung: Für alle 50 Räume ist ein vollständiger Erfolgsweg in tools/replays.json gespeichert und gegen dieselbe Simulation wie im Spiel geprüft. Zusätzliche Prüfungen decken Kategoriegrenzen, Neustart-Determinismus, Wandkontakt, Mitfahren, Portal-Wiedereintritt und Buttonwirkungen ab. Das ersetzt keine menschliche Bewertung des Schwierigkeitsgrads.
