# UNI – Basi di Dati

App per preparare l'esame di **Basi di Dati** (eCampus, 1 dicembre 2026: 24 domande chiuse + 2 aperte).
È una pagina web statica (`index.html`). Funziona offline, si installa sul telefono come app (PWA) e non ha bisogno di un server.

Usa **solo** i materiali del corso: `data/domande.json` (banca ufficiale) e `data/risposte.json`. Se manca una risposta, l'app scrive “risposta non ancora disponibile” e non la inventa.

## Funzioni
- **Quiz per lezione**: una domanda alla volta, opzioni in ordine casuale, feedback immediato.
- **Simulazione d'esame**: 24 chiuse casuali (tra quelle con risposta nota) + 2 aperte, timer regolabile, punteggio e riepilogo errori.
- **Domande aperte**: scrivi la risposta, confrontala con la risposta modello (se c'è) e autovalutati 0/1/2.
- **Ripasso errori**: le domande sbagliate tornano subito, poi dopo 1, 3 e 7 giorni.
- **Statistiche**: percentuale per lezione e per nucleo, lezioni più deboli, giorni mancanti all'esame.
- **Flashcard** dal glossario (se presente `data/glossario.json`).
- **Esporta/importa progressi** (menu *Altro*): i progressi stanno nel browser, quindi esportali per spostarli tra telefono e computer.

## Aggiungere le risposte di una nuova lezione
Apri `data/risposte.json` e aggiungi una voce con il numero della lezione. Per ogni domanda chiusa scrivi il numero della domanda (come in `domande.json`) e la lettera corretta. A, B, C e D seguono l'ordine delle opzioni nel file, non l'ordine mescolato che vedi nell'app.

```json
{
  "15": {"01": "A", "02": "A", "03": "B", "04": "A"},
  "20": {"01": "C", "02": "A", "03": "D", "04": "B"}
}
```

Non serve toccare il codice. Le chiavi che iniziano con `_` (es. `"_nota"`) vengono ignorate. Se una lettera non è valida o punta a una domanda inesistente, la segnala la pagina **Altro → Anomalie nei dati**.

### Risposte modello per le domande aperte (facoltative)
Si aggiungono in due modi:
- con il campo `"modello": "testo…"` nella domanda dentro `domande.json`;
- oppure con un file `data/modelli.json` nella forma `{ "28": { "05": "testo…" } }`.

### Glossario (facoltativo)
`data/glossario.json`:
```json
[ { "termine": "Chiave primaria", "significato": "…", "lezione": 17 } ]
```

### Domande da correggere
La L30 n.03 è stata estratta male dal PDF: ha 2 opzioni invece di 4, con le prime tre incollate insieme. Finché non la sistemi a mano in `domande.json` è esclusa dai quiz. Le opzioni spazzatura come “Powered by TCPDF” vengono ignorate in automatico.

Dopo ogni modifica pubblica di nuovo (vedi sotto). L'app scarica sempre i dati aggiornati quando c'è rete e li usa offline quando non c'è. Se cambi `index.html`, aumenta `VERSION` in `sw.js` perché i telefoni ricevano la nuova versione.

## Pubblicare con GitHub Pages
1. Su GitHub apri il repository e vai in **Settings → Pages**.
2. In *Build and deployment* scegli **Deploy from a branch**, ramo `main`, cartella `/ (root)`, poi **Save**.
3. Dopo un minuto l'app è su `https://xiluca17.github.io/UNI-BasiDiDati/`.
4. Sul telefono apri quel link. Su Android: menu ⋮ → *Installa app*. Su iPhone: Condividi → *Aggiungi a Home*.

Per modificare `risposte.json` basta anche l'editor web di GitHub (icona ✏️ sul file): al commit, Pages ripubblica da solo.

## Provarla sul computer
Aperta con doppio clic (`file://`) il browser blocca il caricamento dei JSON. Avvia un piccolo server:

```bash
python3 -m http.server 8000
```

e apri http://localhost:8000.
