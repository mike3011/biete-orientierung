# Führungskompass

Statisches Browsermodul für `/fuehrungskompass.html`. Kein Backend, keine API-Schlüssel, keine automatische Antwortübermittlung. Kontakt: mike@biete-orientierung.de.

## Reproduzierbare Prüfung

Mit Node.js aus diesem Verzeichnis: `node test.mjs`.

Der Test enumeriert alle 65.536 Antwortkombinationen und aktualisiert `pruefung.json` einschließlich SHA-256 der geprüften Quelldateien. Er prüft die technische Rechenlogik, keine psychometrische Validität. Nach jeder Änderung an Fragen oder Zuordnungen müssen Versionsnummer, Bericht und Prüfung gemeinsam aktualisiert werden. Alte Speicherstände werden nur bei übereinstimmender Fassung geladen.

## Aufbau

Die Ergebnisrosette zeigt alle sechs Ausrichtungen auf der festen Skala 0 bis 1 (Rohpunkte / Katalogsumme). Der Außenring ist kein persönliches Ziel oder erreichbares Maximum. `rosette.mjs` liefert identische Geometrie für SVG, Druckansicht und Vektor-PDF; es gibt keine individuelle Skalierung, Grundpunkte oder flächenbasierte Bewertung. Gold und Stern kennzeichnen dieselben hervorgehobenen Werte einschließlich Gleichständen wie die Berechnung. Alle sechs Erläuterungen sind aufklappbar und im PDF enthalten.

- `data.mjs`: vollständiger Katalog, Gewichtungen, Begründungen, Texte und Methodik.
- `engine.mjs`: reine Berechnung mit Eingabevalidierung und exakten Gleichstandsvergleichen.
- `report.mjs`: Berichtsinhalte und lokale PDF-Erzeugung; verwendet dieselbe Berechnung wie die Webseite.
- `app.mjs`: Bedienung, freiwilliger Gerätespeicher, PDF-/JSON-Download.
- `style.css`: ausschließlich dieses Modul betreffende Gestaltung.
- `assets/`: lokal ausgelieferte PDF-Bibliotheken und eingebettete Schrift. Keine externen CDN-Aufrufe.

PDF: pdf-lib (MIT), @pdf-lib/fontkit 1.1.1 (MIT), Bitstream Vera (beigefügte Lizenz). Schriftzeichen außerhalb der Schrift werden als Unicode-Codepunkte ausgegeben und im PDF erklärt. Der ergänzende JSON-Download enthält die Originalzeichen. Druckansicht verwendet die verfügbaren Browserschriften.

## Auswertungsvertrag

Jede der acht gültigen Antworten verteilt 2 Hauptpunkte und 1 Nebenpunkt. Es gibt immer 24 Rohpunkte. Die Katalogsumme je Ausrichtung wird aus allen Optionen abgeleitet. Verglichen werden Brüche `Rohpunkte/Katalogsumme` über ganzzahlige Kreuzprodukte. Die ersten beiden Plätze einschließlich aller an der Grenze gleich hohen Werte werden angezeigt. Schwierigkeit und Notizen verändern keine Punkte. Musterregeln sind in data.mjs vollständig beschrieben.

Der Kompass behauptet weder Führungseignung noch Kompetenzmessung. Die Ausrichtungen, Zuordnungen und Schwellen sind redaktionelle Setzungen und müssen in der Praxis auf Verständlichkeit und Nutzen erprobt werden. Keine Verwendung zur Personalauswahl.

## Integration und Daten

Einstieg von Startseite und Führungsseite; Gesprächsangebot auch auf buchung.html. Die Buchung ist nur ein Link zu Cal.com und übermittelt keine Antworten. Der mailto-Link übermittelt ebenfalls keinen Bericht: Nutzer hängen ihn selbst an und senden selbst. Bestehende Datenschutz-/Buchungsseiten werden verlinkt und nicht ersetzt.

Ohne aktivierte Speicherung liegt der Stand nur im Arbeitsspeicher des Tabs. Bei aktivierter Speicherung wird ausschließlich `biete-fuehrungskompass-v1` im LocalStorage verwendet. Zurücksetzen löscht den Stand dieses Moduls, keine anderen Website-Daten und keine heruntergeladenen Dateien.

## Veröffentlichung

Die vorhandene GitHub-Aktion veröffentlicht Änderungen an main per SFTP zu STRATO. Zuvor setzt `node fuehrungskompass/build-assets.cjs` die beiden mitgelieferten PDF-Bibliotheken aus Transportteilen wieder zusammen und prüft Länge und SHA-256. Dies ist auch vor einer lokalen Vorschau nach einem frischen Checkout nötig. Die Aufteilung dient ausschließlich der begrenzten Dateiübertragung zum Repository; der Browser lädt anschließend die unveränderten Bibliotheken. Keine zusätzlichen Hostingdienste sind erforderlich. Die Quelldateien und das Prüfprotokoll sind bewusst öffentlich einsehbar. Die JavaScript-Module müssen mit JavaScript-MIME-Typ ausgeliefert werden; im Modulverzeichnis liegt dafür eine Apache-Konfiguration.
