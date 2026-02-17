# HospitalSanitizationTracker

DApp for tracing sanitization activities in hospitals using blockchain technology - Project for Blockchain and Cryptocurrencies course

## 📋 ROADMAP COMPLETA - Cosa manca per completare il progetto

### ✅ FASE 1: Setup Iniziale (COMPLETATO)
- [x] Repository GitHub creato: `HospitalSanitizationTracker`
- [x] Node.js installato (v22.13.1)
- [x] Hardhat inizializzato e configurato
- [x] Struttura cartelle progetto creata

### ✅ FASE 2: Smart Contract (COMPLETATO)
- [x] Smart contract `SanitizationTracker.sol` sviluppato con:
  - Strutture dati (Room, SanitizationRecord)
  - Funzioni principali (addRoom, recordSanitization, verifySanitization)
  - Modifiers per sicurezza (onlyAuthorizedOperator, validRoom)
  - Eventi per tracciabilità
- [x] Compilazione smart contract riuscita
- [x] 14 test unitari creati e superati al 100%
- [x] Deploy su rete locale Hardhat testato

### ✅ FASE 3: Account Infura (COMPLETATO)
- [x] Account Infura.io registrato
- [x] Progetto Infrastructure creato
- [x] API Key e RPC URL Sepolia ottenuti

### 🔄 FASE 4: Deploy su Testnet Sepolia (DA FARE)
**Passi necessari:**
1. Ottenere SepoliaETH gratuiti da un faucet:
   - https://sepoliafaucet.com/ oppure
   - https://www.alchemy.com/faucets/ethereum-sepolia
2. Configurare `.env` file con:
   ```
   INFURA_API_KEY=<tua-api-key>
   PRIVATE_KEY=<tua-private-key-metamask>
   ```
3. Installare dotenv: `npm install --save-dev dotenv`
4. Aggiornare `hardhat.config.js` con rete Sepolia
5. Eseguire deploy: `npx hardhat ignition deploy ignition/modules/SanitizationTracker.js --network sepolia`
6. Salvare indirizzo contratto deployato
7. Verificare contratto su Etherscan Sepolia

### 📱 FASE 5: Frontend DApp (DA FARE)
**Tecnologie da usare:**
- React.js per UI
- ethers.js o Web3.js per interazione blockchain
- MetaMask per connessione wallet

**Componenti da creare:**
1. **Pagina Home**: Dashboard con statistiche
2. **Gestione Stanze**: 
   - Form per aggiungere nuove stanze
   - Lista stanze registrate
3. **Registrazione Sanificazioni**:
   - Form per registrare sanificazione
   - Selezione stanza, operatore, prodotti
4. **Verifica Sanificazioni**:
   - Ricerca per stanza
   - Visualizzazione storico sanificazioni
   - Badge di verifica blockchain
5. **Connessione MetaMask**:
   - Button per connettere wallet
   - Display indirizzo connesso

**File da creare:**
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── RoomList.jsx
│   │   ├── AddRoom.jsx
│   │   ├── RecordSanitization.jsx
│   │   └── VerifyHistory.jsx
│   ├── utils/
│   │   └── contract.js
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

### 🧪 FASE 6: Testing Completo (DA FARE)
1. Test frontend con MetaMask su Sepolia
2. Test tutte le funzionalità:
   - Aggiungere stanze
   - Registrare sanificazioni
   - Verificare storico
3. Test su diversi browser
4. Test responsive su mobile

### 📝 FASE 7: Documentazione (DA FARE)
**File da aggiornare/creare:**
1. **README.md completo** con:
   - Descrizione progetto
   - Architettura sistema
   - Istruzioni installazione
   - Guida utilizzo
   - Screenshots applicazione
2. **DOCUMENTATION.md** con:
   - Analisi requisiti Proposal 7
   - Casi d'uso dettagliati
   - Diagrammi UML (opzionale)
   - Spiegazione scelte tecnologiche
3. **Commenti nel codice** (già fatto per smart contract)

### 🎓 FASE 8: Preparazione Esame (DA FARE)
**Materiali da preparare:**
1. **Presentazione PowerPoint/PDF** (15-20 slides):
   - Introduzione problema
   - Soluzione proposta
   - Architettura tecnica
   - Smart contract spiegato
   - Demo applicazione
   - Conclusioni e sviluppi futuri
2. **Demo video** (opzionale ma consigliato):
   - Screen recording utilizzo DApp
   - Spiegazione funzionalità
3. **Script presentazione**:
   - Cosa dire per ogni slide
   - Tempo: 10-15 minuti

### 🚀 FASE 9: Deploy Produzione (OPZIONALE)
- Hosting frontend su:
  - Vercel (consigliato, gratuito)
  - Netlify
  - GitHub Pages
- Deploy smart contract su Mainnet (SCONSIGLIATO - costi gas reali)

### 📊 FASE 10: Miglioramenti Futuri (OPZIONALE)
- Sistema di notifiche
- QR Code per stanze
- App mobile con React Native
- Sistema di permessi multi-livello
- Dashboard analytics avanzate
- Integrazione IPFS per documenti

---

## 🎯 PRIORITÀ IMMEDIATE (Prossima sessione):

### 1️⃣ PRIORITÀ ALTA - Deploy Testnet
- [ ] Ottenere SepoliaETH da faucet
- [ ] Configurare .env con Infura API key
- [ ] Deploy contratto su Sepolia
- [ ] Testare contratto su Sepolia

### 2️⃣ PRIORITÀ ALTA - Frontend Base
- [ ] Inizializzare progetto React
- [ ] Creare componente connessione MetaMask
- [ ] Implementare interazione con contratto
- [ ] Creare form base per funzionalità principali

### 3️⃣ PRIORITÀ MEDIA - Documentazione
- [ ] Scrivere guida installazione
- [ ] Aggiungere screenshots
- [ ] Documentare API contratto

### 4️⃣ PRIORITÀ BASSA - Preparazione Esame
- [ ] Creare presentazione
- [ ] Preparare demo
- [ [ ] Studiare concetti teorici Proposal 7

---

## 💾 STATO ATTUALE (17 Febbraio 2026, 23:00)

**Completato:**
- ✅ Smart contract funzionante con 14 test passed
- ✅ Deploy script Hardhat Ignition
- ✅ Configurazione Hardhat
- ✅ Account Infura con API key
- ✅ Repository GitHub con tutto il codice

**Tempo stimato rimanente:**
- Deploy Sepolia: 1-2 ore
- Frontend base: 6-8 ore
- Testing completo: 2-3 ore
- Documentazione: 2-3 ore
- Preparazione esame: 3-4 ore

**TOTALE: 14-20 ore di lavoro**

---

## 📞 Link Utili

- **Repository GitHub**: https://github.com/FrancescoCastaldi/HospitalSanitizationTracker
- **Infura Dashboard**: https://app.infura.io/
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **Hardhat Documentation**: https://hardhat.org/docs
- **ethers.js Documentation**: https://docs.ethers.org/

---

## 🔑 Informazioni Progetto

- **Proposta**: #7 - DLTs for Traceability in Supply Chain
- **Caso d'uso**: Tracciamento sanificazioni in ospedali
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contract**: Solidity ^0.8.27
- **Framework**: Hardhat
- **Frontend**: React.js (da implementare)
- **Provider**: Infura
- **Testing**: 14 test unitari con Chai

---

## 📧 Note per il Professore

Questo progetto implementa la Proposal 7 "DLTs for Traceability in Supply Chain" con focus specifico sul settore sanitario. Il sistema permette di tracciare in modo immutabile e trasparente le attività di sanificazione negli ospedali, garantendo conformità normativa e sicurezza dei pazienti.

**Vantaggi della soluzione blockchain:**
- Immutabilità dei record di sanificazione
- Trasparenza e auditabilità
- Riduzione frodi e falsificazioni
- Conformità normative automatizzata
- Tracciabilità end-to-end

---

**Ultimo aggiornamento**: 17 Febbraio 2026
**Prossima sessione**: Deploy su Sepolia Testnet
