# HospitalSanitizationTracker

DApp per tracciare le attività di sanificazione in ospedale usando tecnologia blockchain.  
Progetto per il corso **Blockchain and Cryptocurrencies** (UniBO).

---

## ROADMAP COMPLETA – Stato attuale

### [COMPLETATO] FASE 1: Setup iniziale
- [x] Repository GitHub creato: `HospitalSanitizationTracker`
- [x] Node.js installato
- [x] Hardhat inizializzato e configurato
- [x] Struttura cartelle progetto creata

### [COMPLETATO] FASE 2: Smart Contract
- [x] Smart contract `SanitizationTracker.sol` sviluppato con:
  - Strutture dati per aree, operatori ed eventi di sanificazione
  - Funzioni principali: registrazione aree, registrazione operatori, registrazione sanificazioni, lettura eventi
  - Modifiers per sicurezza: `onlyAdmin`, `onlyActiveOperator`
  - Eventi per tracciabilità: `AreaRegistered`, `OperatorRegistered`, `AreaSanitized`
- [x] Compilazione smart contract riuscita
- [x] 14 test unitari creati e superati al 100%
- [x] Deploy su rete locale Hardhat testato

### [COMPLETATO] FASE 3: Account Infura
- [x] Account Infura.io registrato
- [x] Progetto creato
- [x] API Key e RPC URL Sepolia ottenuti

### [COMPLETATO] FASE 4: Deploy su Testnet Sepolia
- [x] Ottenuti SepoliaETH gratuiti da faucet
- [x] File `.env` configurato con:
  ```env
  INFURA_API_KEY=<API KEY INFURA>
  PRIVATE_KEY=<PRIVATE KEY ACCOUNT ADMIN>
