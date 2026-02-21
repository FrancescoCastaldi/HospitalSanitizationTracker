// Indirizzo del contratto su Sepolia
const CONTRACT_ADDRESS = "0x679C6625f9479cf3b711F7a246C8F7a6655E4517";

// ABI minimale, coerente con il contratto Solidity
const CONTRACT_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_areaId", "type": "uint256" },
      { "internalType": "string", "name": "_outcome", "type": "string" },
      { "internalType": "string", "name": "_notes", "type": "string" }
    ],
    "name": "sanitize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "string", "name": "_name", "type": "string" }
    ],
    "name": "registerArea",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_wallet", "type": "address" },
      { "internalType": "string", "name": "_name", "type": "string" }
    ],
    "name": "registerOperator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "bool", "name": "_active", "type": "bool" }
    ],
    "name": "setAreaActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_wallet", "type": "address" },
      { "internalType": "bool", "name": "_active", "type": "bool" }
    ],
    "name": "setOperatorActive",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_areaId", "type": "uint256" }
    ],
    "name": "getAreaEvents",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "areaId", "type": "uint256" },
          { "internalType": "address", "name": "operatorAddress", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "outcome", "type": "string" },
          { "internalType": "string", "name": "notes", "type": "string" }
        ],
        "internalType": "struct SanitizationTracker.SanitizationEvent[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_areaId", "type": "uint256" }
    ],
    "name": "getEventCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_areaId", "type": "uint256" }
    ],
    "name": "getLastSanitization",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "areaId", "type": "uint256" },
          { "internalType": "address", "name": "operatorAddress", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "string", "name": "outcome", "type": "string" },
          { "internalType": "string", "name": "notes", "type": "string" }
        ],
        "internalType": "struct SanitizationTracker.SanitizationEvent",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "areas",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "bool", "name": "active", "type": "bool" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "operators",
    "outputs": [
      { "internalType": "address", "name": "wallet", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "bool", "name": "active", "type": "bool" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let contract;
let currentAccount;
let onChainAdmin;
let currentRole = "unknown";
let adminAddress = null;
let knownOperatorAddress = null;

// Utility per mostrare messaggi
function setMsg(id, text) {
  document.getElementById(id).textContent = text;
}

// Aggiorna UI in base al ruolo
function updateDesiredRoleHint() {
  const select = document.getElementById("desiredRole");
  const hint = document.getElementById("desiredRoleHint");
  if (!select || !hint) return;

  const value = select.value;
  if (value === "admin") {
    hint.textContent = adminAddress
      ? ` → Select admin account in MetaMask: ${adminAddress}`
      : " → Connect as the account that deployed the contract (admin).";
  } else if (value === "operator") {
    hint.textContent = knownOperatorAddress
      ? ` → Select operator account in MetaMask: ${knownOperatorAddress}`
      : " → First connect with the operator account (registered by admin).";
  } else {
    hint.textContent = "";
  }
}

function updateRoleUI() {
  const roleSpan = document.getElementById("walletRole");
  const isAdmin = currentRole === "admin";

  if (roleSpan) {
    roleSpan.textContent = `Role: ${currentRole}`;
  }

  document.getElementById("registerAreaBtn").disabled = !isAdmin;
  document.getElementById("registerOperatorBtn").disabled = !isAdmin;

  updateDesiredRoleHint();
}

// Connessione a MetaMask
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    currentAccount = accounts[0];

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    onChainAdmin = await contract.admin();
    adminAddress = onChainAdmin;
    const isAdmin =
      onChainAdmin.toLowerCase() === currentAccount.toLowerCase();

    let op;
    try {
      op = await contract.operators(currentAccount);
    } catch (e) {
      op = null;
    }

    if (isAdmin) {
      currentRole = "admin";
    } else if (op && op.exists) {
      currentRole = op.active ? "operator" : "operator (inactive)";
      knownOperatorAddress = currentAccount;
    } else {
      currentRole = "guest";
    }

    document.getElementById("walletInfo").textContent =
      `Connected: ${currentAccount}`;
    setMsg("areaMsg", "");
    setMsg("operatorMsg", "");
    setMsg("sanitMsg", "");
    updateRoleUI();
  } catch (err) {
    console.error(err);
    alert("Error connecting wallet: " + err.message);
  }
}

// Register Area
async function registerArea() {
  if (!contract) return alert("Connect wallet first");

  const id = document.getElementById("areaId").value;
  const name = document.getElementById("areaName").value;

  if (!id || !name) {
    return setMsg("areaMsg", "Area ID and name are required");
  }

  try {
    setMsg("areaMsg", "Sending transaction...");
    const tx = await contract.registerArea(id, name);
    await tx.wait();
    setMsg("areaMsg", "Area registered successfully");
  } catch (err) {
    console.error(err);
    setMsg("areaMsg", "Error: " + (err.reason || err.message));
  }
}

// Register Operator
async function registerOperator() {
  if (!contract) return alert("Connect wallet first");

  const addr = document.getElementById("operatorAddress").value;
  const name = document.getElementById("operatorName").value;

  if (!addr || !name) {
    return setMsg("operatorMsg", "Address and name are required");
  }

  try {
    setMsg("operatorMsg", "Sending transaction...");
    const tx = await contract.registerOperator(addr, name);
    await tx.wait();
    setMsg("operatorMsg", "Operator registered successfully");
  } catch (err) {
    console.error(err);
    setMsg("operatorMsg", "Error: " + (err.reason || err.message));
  }
}

// Record Sanitization
async function recordSanitization() {
  if (!contract) return alert("Connect wallet first");

  const areaId = document.getElementById("sanitAreaId").value;
  const outcome = document.getElementById("sanitOutcome").value;
  const notes = document.getElementById("sanitNotes").value;

  if (!areaId || !outcome) {
    return setMsg("sanitMsg", "Area ID and outcome are required");
  }

  try {
    setMsg("sanitMsg", "Sending transaction...");
    const tx = await contract.sanitize(areaId, outcome, notes);
    await tx.wait();
    setMsg("sanitMsg", "Sanitization recorded");
  } catch (err) {
    console.error(err);
    setMsg("sanitMsg", "Error: " + (err.reason || err.message));
  }
}

// Area Status = areas + getLastSanitization
async function getAreaStatus() {
  if (!contract) return alert("Connect wallet first");

  const areaId = document.getElementById("statusAreaId").value;
  if (!areaId) return;

  try {
    const area = await contract.areas(areaId);
    if (!area.exists) {
      document.getElementById("statusResult").textContent =
        "Area does not exist";
      return;
    }

    let lastEvent = null;
    try {
      lastEvent = await contract.getLastSanitization(areaId);
    } catch (err) {
      // nessun evento
    }

    const formatted = {
      areaId: area.id.toString(),
      areaName: area.name,
      isActive: area.active,
      exists: area.exists,
      lastSanitizationTimestamp: lastEvent
        ? lastEvent.timestamp.toString()
        : null,
      lastOutcome: lastEvent ? lastEvent.outcome : null,
      lastOperator: lastEvent ? lastEvent.operatorAddress : null,
    };

    document.getElementById("statusResult").textContent =
      JSON.stringify(formatted, null, 2);
  } catch (err) {
    console.error(err);
    document.getElementById("statusResult").textContent =
      "Error getting status";
  }
}

// Area Events
async function getAreaEvents() {
  if (!contract) return alert("Connect wallet first");

  const areaId = document.getElementById("eventsAreaId").value;
  if (!areaId) return;

  try {
    const events = await contract.getAreaEvents(areaId);
    const parsed = events.map(ev => ({
      areaId: ev.areaId.toString(),
      operator: ev.operatorAddress,
      timestamp: ev.timestamp.toString(),
      outcome: ev.outcome,
      notes: ev.notes
    }));
    document.getElementById("eventsResult").textContent =
      JSON.stringify(parsed, null, 2);
  } catch (err) {
    console.error(err);
    document.getElementById("eventsResult").textContent =
      "Error getting events";
  }
}

// Wiring
window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("connectButton")
    .addEventListener("click", connectWallet);
  document
    .getElementById("registerAreaBtn")
    .addEventListener("click", registerArea);
  document
    .getElementById("registerOperatorBtn")
    .addEventListener("click", registerOperator);
  document
    .getElementById("recordSanitizationBtn")
    .addEventListener("click", recordSanitization);
  document
    .getElementById("getStatusBtn")
    .addEventListener("click", getAreaStatus);
  document
    .getElementById("getEventsBtn")
    .addEventListener("click", getAreaEvents);

  const desiredRoleSelect = document.getElementById("desiredRole");
  if (desiredRoleSelect) {
    desiredRoleSelect.addEventListener("change", updateDesiredRoleHint);
  }
});
