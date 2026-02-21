# HospitalSanitizationTracker

DApp per la tracciabilita delle attivita di sanificazione ospedaliera tramite blockchain.
Progetto per il corso di Blockchain e Criptovalute - Universita di Bologna.

Proposal 7 - DLTs for Traceability in Supply Chain (AnaNSi Research Group)

## Descrizione

Sistema basato su smart contract Ethereum che permette a operatori autorizzati di registrare
e certificare le operazioni di sanificazione di aree e dispositivi medici.
Ogni evento e immutabilmente registrato sulla blockchain.

## Tecnologie Utilizzate

- Solidity 0.8.20
- Hardhat 2.28.0
- Ethers.js
- Node.js v22
- Infura (RPC Provider)
- Rete: Ethereum Sepolia Testnet

## Struttura Progetto

```
contracts/
  SanitizationTracker.sol      # Smart contract principale
scripts/
  deploy.js                    # Script di deploy su rete
test/
  SanitizationTracker.test.js  # Suite di test (10/10 passati)
```

## Smart Contract - Funzionalita

- Registrazione aree da sanificare (ID univoco, nome, descrizione)
- Registrazione operatori autorizzati
- Registrazione eventi di sanificazione con timestamp
- Verifica stato sanificazione per area
- Controlli di accesso con modifiers
- Eventi on-chain per tracciabilita completa

## Stato Avanzamento

### [COMPLETATO] FASE 1 - Setup Ambiente
- Repository GitHub creato: HospitalSanitizationTracker
- Node.js installato (v22.13.1)
- Hardhat inizializzato e configurato (v2.28.0)
- Struttura cartelle progetto creata
- Dipendenze installate (hardhat-toolbox, dotenv)

### [COMPLETATO] FASE 2 - Smart Contract
- Contratto SanitizationTracker.sol sviluppato
- Strutture dati: Area, Operator, SanitizationEvent
- Funzioni: registerArea, registerOperator, recordSanitization, getAreaStatus
- Modifiers di sicurezza: onlyOwner, onlyAuthorizedOperator, validArea
- Eventi on-chain per ogni operazione
- Compilazione completata senza errori

### [COMPLETATO] FASE 3 - Test
- Suite di test completa: 10/10 test passati
- Copertura: registrazione aree, operatori, eventi di sanificazione
- Test controlli di accesso e casi limite
- Compatibilita verificata con Node.js v22 e Hardhat v2.28.0

### [COMPLETATO] FASE 4 - Deploy su Testnet
- Rete: Ethereum Sepolia Testnet
- Indirizzo contratto: 0x679C6625f9479cf3b711F7a246C8F7a6655E4517
- Data deploy: 21 Febbraio 2026
- Verifica: https://sepolia.etherscan.io/address/0x679C6625f9479cf3b711F7a246C8F7a6655E4517
- Provider RPC: Infura (MetaMask Developer)
- Wallet deployer: 0xc31ab9aca37aEA5f4261c89A5fCcC541D741E5b0

### [COMPLETATO] FASE 5 - Frontend DApp
- Interfaccia web (HTML/CSS/JS) per interazione col contratto
- Integrazione MetaMask per firma transazioni (ruoli admin/operator)
- Visualizzazione stato aree e storico delle sanificazioni per ogni area


### [DA FARE] FASE 6 - Documentazione Finale
- Documentazione tecnica completa
- Relazione per tesi
- Diagrammi architetturali

## Installazione e Utilizzo

```bash
# Installa dipendenze
npm install

# Compila il contratto
npx hardhat compile

# Esegui i test
npx hardhat test

# Deploy su Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

## Contratto Deployato

| Campo | Valore |
|-------|--------|
| Rete | Ethereum Sepolia Testnet |
| Indirizzo | 0x679C6625f9479cf3b711F7a246C8F7a6655E4517 |
| Data Deploy | 21 Febbraio 2026 |
| Etherscan | https://sepolia.etherscan.io/address/0x679C6625f9479cf3b711F7a246C8F7a6655E4517 |

## Autore

Francesco Castaldi - Universita di Bologna
Corso: Blockchain e Criptovalute
