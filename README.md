# HospitalSanitizationTracker

DApp per la tracciabilità delle attività di sanificazione ospedaliera tramite blockchain.  
Progetto per il corso di Blockchain e Criptovalute – Università di Bologna.

Proposal 7 – DLTs for Traceability in Supply Chain (AnaNSi Research Group)

---

## Descrizione

Sistema basato su smart contract Ethereum che permette a operatori autorizzati di registrare
e certificare le operazioni di sanificazione di aree ospedaliere.  
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

```text
contracts/
  SanitizationTracker.sol        # Smart contract principale

scripts/
  deploy.js                      # Script di deploy (versione iniziale)
  # Deploy finale effettuato con Hardhat Ignition

test/
  SanitizationTracker.test.js    # Suite di test (14/14 passati)

frontend/
  index.html                     # Interfaccia web
  app.js                         # Logica DApp + interazione con il contratto
  style.css                      # Stili base (opzionale)
```

---

## Smart Contract – Funzionalità

Il contratto `SanitizationTracker` implementa:

- Registrazione aree da sanificare:
  - `id` numerico univoco
  - `name`
  - flag `active` e `exists`
- Registrazione operatori autorizzati:
  - `wallet` address
  - `name`
  - flag `active` e `exists`
- Registrazione eventi di sanificazione:
  - `areaId`
  - `operatorAddress`
  - `timestamp`
  - `outcome` (es. OK / FAIL)
  - `notes`
- Lettura dati:
  - `getAreaEvents(areaId)` per lo storico completo
  - `getLastSanitization(areaId)` per l’ultimo evento
  - `getEventCount(areaId)` per il numero di sanificazioni
- Controlli di accesso:
  - `onlyAdmin` → solo l’admin (deployer) può registrare aree e operatori
  - `onlyActiveOperator` → solo operatori registrati e attivi possono chiamare `sanitize`
- Eventi on-chain per tracciabilità:
  - `AreaRegistered`
  - `OperatorRegistered`
  - `AreaSanitized`

---

## Stato Avanzamento

### [COMPLETATO] FASE 1 – Setup Ambiente
- Repository GitHub creato: `HospitalSanitizationTracker`
- Node.js installato (v22.13.1)
- Hardhat inizializzato e configurato (v2.28.0)
- Struttura cartelle progetto creata
- Dipendenze installate (`@nomicfoundation/hardhat-toolbox`, `dotenv`, ecc.)

### [COMPLETATO] FASE 2 – Smart Contract
- Contratto `SanitizationTracker.sol` sviluppato
- Strutture dati: `Area`, `Operator`, `SanitizationEvent`
- Funzioni principali:
  - `registerArea`, `setAreaActive`
  - `registerOperator`, `setOperatorActive`
  - `sanitize`
  - `getAreaEvents`, `getEventCount`, `getLastSanitization`
- Modifiers di sicurezza:
  - `onlyAdmin`
  - `onlyActiveOperator`
- Eventi on-chain per ogni operazione rilevante
- Compilazione completata senza errori

### [COMPLETATO] FASE 3 – Test
- Suite di test completa: 14/14 test passati
- Copertura:
  - registrazione aree
  - registrazione operatori
  - registrazione eventi di sanificazione
  - controlli di accesso e casi limite
- Compatibilità verificata con Node.js v22 e Hardhat v2.28.0

### [COMPLETATO] FASE 4 – Deploy su Testnet
- Rete: **Ethereum Sepolia Testnet**
- Indirizzo contratto: `0x679C6625f9479cf3b711F7a246C8F7a6655E4517`
- Data deploy: 21 Febbraio 2026
- Verifica utilizzo contratto tramite DApp frontend
- Provider RPC: Infura
- Wallet deployer: account admin (indirizzo usato in `.env`)

### [COMPLETATO] FASE 5 – Frontend DApp
- Interfaccia web (HTML/CSS/JS) per interazione col contratto
- Integrazione MetaMask per firma transazioni (ruoli admin/operator)
- Visualizzazione stato aree e storico delle sanificazioni per ogni area

---

## Frontend DApp – Funzionalità

La cartella `frontend/` contiene una DApp semplice ma completa.

### Ruoli

- **Admin**
  - è l’account che ha fatto il deploy del contratto;
  - può registrare nuove aree;
  - può registrare nuovi operatori (indirizzi wallet).
- **Operator**
  - è un account registrato dall’admin;
  - può registrare eventi di sanificazione.

La DApp rileva il ruolo leggendo dal contratto se l’`address` connesso è l’`admin` oppure un `operator` registrato.

### Sezioni principali (index.html)

1. **Header**
   - Bottone “Connect MetaMask”
   - Indirizzo connesso
   - Ruolo corrente (`admin`, `operator`, `guest`)
   - Select “Desired role: Admin/Operator” con suggerimento dell’account da selezionare in MetaMask

2. **Register Area (Owner)**
   - Form per registrare una nuova area:
     - `Area ID`
     - `Area Name`

3. **Register Operator (Owner)**
   - Form per registrare un operatore:
     - `Operator Address` (wallet del secondo account)
     - `Name`

4. **Record Sanitization (Operator)**
   - Form per registrare un evento di sanificazione:
     - `Area ID`
     - `Outcome` (OK/FAIL)
     - `Notes`

5. **Area Status**
   - Input `Area ID`
   - Bottone “Get Status”
   - Visualizza:
     - dati area (id, nome, attiva, esiste)
     - ultima sanificazione (timestamp, outcome, operatore)

6. **Area Events**
   - Input `Area ID`
   - Bottone “Get Events”
   - Mostra lo storico di tutti gli eventi di sanificazione per l’area scelta.

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

```env
INFURA_API_KEY=<API KEY INFURA>
PRIVATE_KEY=<PRIVATE KEY ACCOUNT ADMIN>
```

---

## Esecuzione Frontend

1. Portarsi nella cartella del progetto e aprire la sottocartella `frontend/`.
2. Avviare un semplice server statico, ad esempio:

```bash
npx serve frontend
# oppure usare l'estensione "Live Server" di VS Code
```

3. Aprire il browser su `http://localhost:3000` (o la porta indicata).
4. In MetaMask selezionare la rete **Sepolia**.

### Flusso tipico di test

1. Connettersi con l’account **admin** (deployer).
2. Registrare almeno:
   - un’area (es. ID = 101, Name = "Test 101");
   - un operatore usando l’indirizzo del secondo account MetaMask.
3. Passare al secondo account in MetaMask (operatore) e riconnettere la DApp.
4. Registrare una sanificazione per l’area 101.
5. Verificare lo stato e lo storico tramite le sezioni “Area Status” e “Area Events”.

---

## Contratto Deployato

| Campo        | Valore                                                                            |
|-------------|------------------------------------------------------------------------------------|
| Rete        | Ethereum Sepolia Testnet                                                           |
| Indirizzo   | `0x679C6625f9479cf3b711F7a246C8F7a6655E4517`                                       |
| Data Deploy | 21 Febbraio 2026                                                                   |
| Etherscan   | https://sepolia.etherscan.io/address/0x679C6625f9479cf3b711F7a246C8F7a6655E4517   |

---

## Autore

Francesco Castaldi – Università di Bologna  
Corso: Blockchain e Criptovalute
