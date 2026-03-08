const CONTRACT_ADDRESS = "0x679C6625f9479cf3b711F7a246C8F7a6655E4517";
const CONTRACT_ABI = [
    {"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_areaId","type":"uint256"},{"internalType":"string","name":"_outcome","type":"string"},{"internalType":"string","name":"_notes","type":"string"}],"name":"sanitize","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"}],"name":"registerArea","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_wallet","type":"address"},{"internalType":"string","name":"_name","type":"string"}],"name":"registerOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_areaId","type":"uint256"}],"name":"getAreaEvents","outputs":[{"components":[{"internalType":"uint256","name":"areaId","type":"uint256"},{"internalType":"address","name":"operatorAddress","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"outcome","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"internalType":"struct SanitizationTracker.SanitizationEvent[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_areaId","type":"uint256"}],"name":"getLastSanitization","outputs":[{"components":[{"internalType":"uint256","name":"areaId","type":"uint256"},{"internalType":"address","name":"operatorAddress","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"outcome","type":"string"},{"internalType":"string","name":"notes","type":"string"}],"internalType":"struct SanitizationTracker.SanitizationEvent","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"areas","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bool","name":"active","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"operators","outputs":[{"internalType":"address","name":"wallet","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bool","name":"active","type":"bool"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"}
];

let provider, signer, contract, currentAccount, adminAddress = null, currentRole = "guest", knownOperatorAddress = null;

function setMsg(id, text, type = '') {
    const el = document.getElementById(id);
    el.textContent = text;
    el.className = `msg ${type}`;
}

function showLoader(show) {
    document.getElementById('loader').style.display = show ? 'block' : 'none';
}

function updateRoleUI() {
    const isAdmin = currentRole === 'admin';
    document.getElementById('registerAreaBtn').disabled = !isAdmin;
    document.getElementById('registerOperatorBtn').disabled = !isAdmin;
    const labels = { admin: 'Admin', operator: 'Operator', 'operator-inactive': 'Operator (inattivo)', guest: 'Guest' };
    document.getElementById('walletRole').textContent = labels[currentRole] || currentRole;
}

function updateDesiredRoleHint() {
    const val = document.getElementById('desiredRole').value;
    const hint = document.getElementById('desiredRoleHint');
    if (val === 'admin') {
        hint.innerHTML = adminAddress
            ? `Account admin: <code style="color:#aaa">${adminAddress.slice(0,10)}...${adminAddress.slice(-6)}</code>`
            : 'Verrà rilevato automaticamente tra gli account MetaMask';
    } else {
        hint.innerHTML = knownOperatorAddress
            ? `Account operator: <code style="color:#aaa">${knownOperatorAddress.slice(0,10)}...${knownOperatorAddress.slice(-6)}</code>`
            : 'Verrà rilevato automaticamente tra gli account MetaMask';
    }
}

function getIdsToScan() {
    const mode = document.querySelector('input[name="scanMode"]:checked').value;
    if (mode === 'manual') {
        const raw = document.getElementById('manualIds').value;
        return raw.split(',')
            .map(s => parseInt(s.trim()))
            .filter(n => !isNaN(n) && n > 0);
    } else {
        const from = parseInt(document.getElementById('scanFrom').value) || 1;
        const to = parseInt(document.getElementById('scanTo').value) || 150;
        const ids = [];
        for (let i = from; i <= Math.min(to, from + 499); i++) ids.push(i);
        return ids;
    }
}

async function connectWallet() {
    try {
        showLoader(true);
        document.getElementById('connectButton').textContent = 'Connecting...';
        document.getElementById('connectButton').disabled = true;

        if (!window.ethereum) throw new Error('MetaMask non trovato');
        if (typeof ethers === 'undefined') throw new Error('Ethers non caricato, ricarica la pagina');

        const desiredRole = document.getElementById('desiredRole').value;
        const hint = document.getElementById('desiredRoleHint');
        hint.innerHTML = 'Rilevamento account in corso...';

        let accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
            hint.innerHTML = 'Richiedo accesso MetaMask...';
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) throw new Error('Usa Sepolia testnet (chainId 11155111)');

        const tempSigner = await provider.getSigner(accounts[0]);
        const tempContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, tempSigner);
        adminAddress = await tempContract.admin();

        let targetAccount = null;

        if (desiredRole === 'admin') {
            targetAccount = accounts.find(a => a.toLowerCase() === adminAddress.toLowerCase());
            if (!targetAccount) {
                hint.innerHTML = `Nessun account corrisponde all'admin.<br>
                    <code style="color:#aaa;font-size:0.72rem">Admin: ${adminAddress}</code>`;
                return;
            }
        } else {
            hint.innerHTML = `Scansione ${accounts.length} account...`;
            for (const acc of accounts) {
                try {
                    const op = await tempContract.operators(acc);
                    if (op.exists && op.active) { targetAccount = acc; knownOperatorAddress = acc; break; }
                } catch {}
            }
            if (!targetAccount) {
                hint.innerHTML = 'Nessun account corrisponde a un operator attivo.';
                return;
            }
        }

        currentAccount = targetAccount;
        signer = await provider.getSigner(currentAccount);
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const isAdmin = adminAddress.toLowerCase() === currentAccount.toLowerCase();
        let op = { exists: false, active: false };
        try { op = await contract.operators(currentAccount); } catch {}

        if (isAdmin) currentRole = 'admin';
        else if (op.exists && op.active) currentRole = 'operator';
        else if (op.exists && !op.active) currentRole = 'operator-inactive';
        else currentRole = 'guest';

        document.getElementById('walletInfo').textContent = `${currentAccount.slice(0,6)}...${currentAccount.slice(-4)}`;
        hint.innerHTML = `Connesso come <strong style="color:#66bb6a">${currentRole}</strong> &mdash; <code style="font-size:0.72rem;color:#888">${currentAccount}</code>`;
        updateRoleUI();
        loadDashboard();

    } catch (err) {
        console.error(err);
        document.getElementById('desiredRoleHint').innerHTML = `<span style="color:#ef5350">${err.message}</span>`;
    } finally {
        showLoader(false);
        document.getElementById('connectButton').textContent = 'Reconnect';
        document.getElementById('connectButton').disabled = false;
    }
}

async function registerArea() {
    const id = document.getElementById('areaId').value;
    const name = document.getElementById('areaName').value;
    if (!id || !name) return setMsg('areaMsg', 'ID e nome richiesti', 'error');
    try {
        showLoader(true);
        setMsg('areaMsg', 'Invio transazione...', '');
        const tx = await contract.registerArea(id, name);
        await tx.wait();
        setMsg('areaMsg', 'Area registrata', 'success');
        const cur = document.getElementById('manualIds').value;
        const ids = cur.split(',').map(s => s.trim()).filter(Boolean);
        if (!ids.includes(id)) {
            document.getElementById('manualIds').value = [...ids, id].join(', ');
            document.querySelector('input[name="scanMode"][value="manual"]').checked = true;
        }
        loadDashboard();
    } catch (err) {
        setMsg('areaMsg', 'Errore: ' + (err.reason || err.message), 'error');
    } finally { showLoader(false); }
}

async function registerOperator() {
    const addr = document.getElementById('operatorAddress').value;
    const name = document.getElementById('operatorName').value;
    if (!addr || !name) return setMsg('operatorMsg', 'Indirizzo e nome richiesti', 'error');
    try {
        showLoader(true);
        setMsg('operatorMsg', 'Invio transazione...', '');
        const tx = await contract.registerOperator(addr, name);
        await tx.wait();
        knownOperatorAddress = addr;
        setMsg('operatorMsg', 'Operator registrato', 'success');
        updateDesiredRoleHint();
    } catch (err) {
        setMsg('operatorMsg', 'Errore: ' + (err.reason || err.message), 'error');
    } finally { showLoader(false); }
}

async function recordSanitization() {
    const areaId = document.getElementById('sanitAreaId').value;
    const outcome = document.getElementById('sanitOutcome').value;
    const notes = document.getElementById('sanitNotes').value;
    if (!areaId) return setMsg('sanitMsg', 'Area ID richiesto', 'error');
    try {
        showLoader(true);
        setMsg('sanitMsg', 'Invio transazione...', '');
        const tx = await contract.sanitize(areaId, outcome, notes || '');
        await tx.wait();
        setMsg('sanitMsg', 'Registrato on-chain', 'success');
        loadDashboard();
    } catch (err) {
        setMsg('sanitMsg', 'Errore: ' + (err.reason || err.message), 'error');
    } finally { showLoader(false); }
}

async function getAreaStatus() {
    const areaId = document.getElementById('statusAreaId').value;
    if (!areaId) return;
    if (!contract) return alert('Connetti wallet prima');
    try {
        const area = await contract.areas(areaId);
        if (!area.exists) return document.getElementById('statusResult').textContent = 'Area non esistente';
        let last = null;
        try { last = await contract.getLastSanitization(areaId); } catch {}
        document.getElementById('statusResult').textContent = JSON.stringify({
            id: area.id.toString(), name: area.name, active: area.active,
            lastOutcome: last?.outcome || 'Nessuna',
            lastOperator: last?.operatorAddress || null,
            lastTime: last ? new Date(Number(last.timestamp) * 1000).toLocaleString('it-IT') : 'Mai'
        }, null, 2);
    } catch (err) {
        document.getElementById('statusResult').textContent = 'Errore: ' + err.message;
    }
}

async function getAreaEvents() {
    const areaId = document.getElementById('eventsAreaId').value;
    if (!areaId) return;
    if (!contract) return alert('Connetti wallet prima');
    try {
        const events = await contract.getAreaEvents(areaId);
        if (events.length === 0) return document.getElementById('eventsResult').textContent = 'Nessun evento trovato';
        document.getElementById('eventsResult').textContent = JSON.stringify(
            events.map(e => ({
                time: new Date(Number(e.timestamp) * 1000).toLocaleString('it-IT'),
                outcome: e.outcome, notes: e.notes,
                operator: e.operatorAddress.slice(0,6) + '...' + e.operatorAddress.slice(-4)
            })), null, 2
        );
    } catch (err) {
        document.getElementById('eventsResult').textContent = 'Errore: ' + err.message;
    }
}

function toggleArea(id) {
    const el = document.getElementById(`events-${id}`);
    const icon = document.getElementById(`toggle-${id}`);
    const open = el.style.display === 'none';
    el.style.display = open ? 'block' : 'none';
    icon.textContent = open ? '▲' : '▼';
}

async function loadDashboard() {
    const container = document.getElementById('dashboardContent');
    if (!contract) return;

    const ids = getIdsToScan();
    if (ids.length === 0) {
        container.innerHTML = `<p class="empty-state">Inserisci almeno un ID area valido.</p>`;
        return;
    }

    container.innerHTML = `<p class="empty-state">Caricamento ${ids.length} aree...</p>`;

    const outcomeBadge = {
        OK:      `<span class="badge badge-ok">OK</span>`,
        WARNING: `<span class="badge badge-warning">Warning</span>`,
        FAILED:  `<span class="badge badge-failed">Failed</span>`
    };
    const borderColor = {
        OK: 'rgba(76,175,80,0.5)',
        WARNING: 'rgba(255,170,0,0.5)',
        FAILED: 'rgba(244,67,54,0.5)'
    };

    try {
        const areaData = [];

        for (const i of ids) {
            try {
                container.innerHTML = `<p class="empty-state">Caricamento area ${i}...</p>`;
                const area = await contract.areas(i);
                if (!area.exists) continue;
                let events = [];
                try { events = await contract.getAreaEvents(i); } catch {}
                areaData.push({
                    id: i, name: area.name, active: area.active,
                    events: events.map(e => ({
                        time: Number(e.timestamp),
                        outcome: e.outcome,
                        notes: e.notes,
                        operator: e.operatorAddress
                    }))
                });
            } catch {}
        }

        if (areaData.length === 0) {
            container.innerHTML = `<p class="empty-state">Nessuna area trovata per gli ID selezionati.</p>`;
            return;
        }

        container.innerHTML = areaData.map(area => {
            const last = area.events.length > 0 ? area.events[area.events.length - 1] : null;
            const lastOutcome = last?.outcome || null;

            const eventsHtml = area.events.length === 0
                ? `<tr><td colspan="4" style="color:#555;text-align:center;padding:12px 0;font-size:0.78rem;">Nessuna attività registrata</td></tr>`
                : [...area.events].reverse().map(e => `
                    <tr>
                        <td>${new Date(e.time * 1000).toLocaleString('it-IT')}</td>
                        <td>${outcomeBadge[e.outcome] || e.outcome}</td>
                        <td><code>${e.operator.slice(0,6)}...${e.operator.slice(-4)}</code></td>
                        <td style="color:#666;">${e.notes || '—'}</td>
                    </tr>`).join('');

            return `
            <div class="area-card" style="border-left:3px solid ${lastOutcome ? borderColor[lastOutcome] : 'rgba(255,255,255,0.08)'};">
                <div class="area-card-header" onclick="toggleArea(${area.id})">
                    <div style="display:flex;align-items:center;gap:10px;flex:1;flex-wrap:wrap;">
                        <span style="font-family:monospace;font-size:0.8rem;color:#00bfff;min-width:52px;">ID ${area.id}</span>
                        <span style="font-weight:500;color:#e0e0e0;">${area.name}</span>
                        <span class="badge ${area.active ? 'badge-active' : 'badge-inactive'}">${area.active ? 'Active' : 'Inactive'}</span>
                        ${lastOutcome ? outcomeBadge[lastOutcome] : ''}
                    </div>
                    <div style="display:flex;align-items:center;gap:16px;flex-shrink:0;">
                        <div>
                            <span style="font-size:1.1rem;font-weight:600;color:#00bfff;">${area.events.length}</span>
                            <span style="font-size:0.72rem;color:#555;margin-left:4px;">eventi</span>
                        </div>
                        <div style="color:#555;font-size:0.75rem;">${last ? new Date(last.time * 1000).toLocaleDateString('it-IT') : 'Mai'}</div>
                        <span id="toggle-${area.id}" style="color:#555;font-size:0.8rem;user-select:none;">▼</span>
                    </div>
                </div>
                <div id="events-${area.id}" style="display:none;border-top:1px solid rgba(255,255,255,0.05);padding:0 18px 14px;">
                    <table class="events-table">
                        <thead><tr><th>Timestamp</th><th>Outcome</th><th>Operator</th><th>Note</th></tr></thead>
                        <tbody>${eventsHtml}</tbody>
                    </table>
                </div>
            </div>`;
        }).join('');

    } catch (err) {
        container.innerHTML = `<p style="color:#ef5350;font-size:0.85rem;">Errore: ${err.message}</p>`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    document.getElementById('registerAreaBtn').addEventListener('click', registerArea);
    document.getElementById('registerOperatorBtn').addEventListener('click', registerOperator);
    document.getElementById('recordSanitizationBtn').addEventListener('click', recordSanitization);
    document.getElementById('getStatusBtn').addEventListener('click', getAreaStatus);
    document.getElementById('getEventsBtn').addEventListener('click', getAreaEvents);
    document.getElementById('refreshDashboardBtn').addEventListener('click', loadDashboard);
    document.getElementById('loadAreasBtn').addEventListener('click', loadDashboard);
    document.getElementById('desiredRole').addEventListener('change', updateDesiredRoleHint);
});
