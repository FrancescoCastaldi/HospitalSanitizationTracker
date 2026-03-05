# HospitalSanitizationTracker

DApp per la tracciabilità delle attività di sanificazione ospedaliera tramite blockchain.  
Progetto per il corso di Blockchain e Criptovalute – Università di Bologna.

Proposal 7 – DLTs for Traceability in Supply Chain (AnaNSi Research Group)

---

## Descrizione

Sistema basato su smart contract Ethereum che permette a operatori autorizzati di registrare e certificare le operazioni di sanificazione di aree ospedaliere.  
Ogni evento è registrato in modo immutabile sulla blockchain e può essere consultato in qualsiasi momento.

---

## Tecnologie Utilizzate

- Solidity 0.8.20
- Hardhat 2.28.0
- Ethers.js (frontend)
- Node.js v22
- Infura (RPC Provider)
- MetaMask (wallet)
- Rete: Ethereum **Sepolia Testnet**

---

## Struttura Progetto

```
contracts/
  SanitizationTracker.sol   # Smart contract principale
scripts/
  deploy.js                 # Script di deploy
ignition/
  modules/
    SanitizationTracker.js  # Modulo Hardhat Ignition per il deploy su testnet
test/
  SanitizationTracker.test.js  # Suite di test (14/14 passati)
frontend/
  index.html                # Interfaccia web app
  app.js                    # Logica DApp + interazione con il contratto
  style.css                 # Stili
```

---

## Smart Contract – Funzionalità

Il contratto `SanitizationTracker` implementa:

- **Registrazione aree da sanificare:**
  - `id` numerico univoco
  - `name`
  - flag `active` e `exists`

- **Registrazione operatori autorizzati:**
  - `wallet` address
  - `name`
  - flag `active` e `exists`

- **Registrazione eventi di sanificazione:**
  - `areaId`
  - `operatorAddress`
  - `timestamp`
  - `outcome` (es. OK / FAIL)
  - `notes`

- **Lettura dati:**
  - `getAreaEvents(areaId)` – storico completo
  - `getLastSanitization(areaId)` – ultimo evento
  - `getEventCount(areaId)` – numero di sanificazioni

- **Controlli di accesso:**
  - `onlyAdmin` → solo il deployer può registrare aree e operatori
  - `onlyActiveOperator` → solo operatori registrati e attivi possono chiamare `sanitize`

- **Eventi on-chain:**
  - `AreaRegistered`
  - `OperatorRegistered`
  - `AreaSanitized`

---

## Frontend DApp – Funzionalità

La cartella `frontend/` contiene una DApp semplice ma completa.

### Ruoli

- **Admin** – account che ha eseguito il deploy del contratto; può registrare aree e operatori.
- **Operator** – account registrato dall'admin; può registrare eventi di sanificazione.

La DApp rileva automaticamente il ruolo leggendo dal contratto se l'`address` connesso è l'`admin` oppure un `operator` registrato.

### Sezioni principali (index.html)

1. **Header** – Connect MetaMask, indirizzo connesso, ruolo corrente (`admin` / `operator` / `guest`), select per il ruolo desiderato.
2. **Register Area (Owner)** – Form per registrare una nuova area (`Area ID`, `Area Name`).
3. **Register Operator (Owner)** – Form per registrare un operatore (`Operator Address`, `Name`).
4. **Record Sanitization (Operator)** – Form per registrare una sanificazione (`Area ID`, `Outcome`, `Notes`).
5. **Area Status** – Visualizza dati area e ultima sanificazione.
6. **Area Events** – Storico completo degli eventi per area.

---

## Installazione e Utilizzo

```bash
# Installa dipendenze
npm install

# Compila il contratto
npx hardhat compile

# Esegui i test
npx hardhat test

# (Opzionale) Deploy su Sepolia con Ignition
npx hardhat ignition deploy ignition/modules/SanitizationTracker.js --network sepolia
```

Assicurarsi di avere un file `.env` con:

```
INFURA_API_KEY=
PRIVATE_KEY=
```

---

## Esecuzione Frontend

1. Portarsi nella cartella del progetto e aprire la sottocartella `frontend/`.
2. Avviare un server statico:

```bash
npx serve frontend
# oppure usare l'estensione "Live Server" di VS Code
```

3. Aprire il browser su `http://localhost:3000` (o la porta indicata).
4. In MetaMask selezionare la rete **Sepolia**.

### Flusso tipico di utilizzo

1. Connettersi con l'account **admin** (deployer).
2. Registrare almeno:
   - un'area (es. ID = 101, Name = "Test 101");
   - un operatore usando l'indirizzo del secondo account MetaMask.
3. Passare al secondo account in MetaMask (operatore) e riconnettere la DApp.
4. Registrare una sanificazione per l'area 101.
5. Verificare lo stato e lo storico tramite le sezioni "Area Status" e "Area Events".

---

## Contratto Deployato

| Campo | Valore |
|---|---|
| Rete | Ethereum Sepolia Testnet |
| Indirizzo | `0x679C6625f9479cf3b711F7a246C8F7a6655E4517` |
| Data Deploy | 21 Febbraio 2026 |
| Etherscan | [Link](https://sepolia.etherscan.io/address/0x679C6625f9479cf3b711F7a246C8F7a6655E4517) |

---

## Autore

Francesco Castaldi – Università di Bologna  
Corso: Blockchain e Criptovalute
