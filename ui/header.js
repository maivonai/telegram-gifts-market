// File: ui/header.js
export function initHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <div class="wallet-info">
            <div id="wallet-balance" style="font-family:monospace">0.000 TON</div>
        </div>
        <div id="connect-wallet-btn" style="min-width:140px"></div>
        <div style="display:flex;align-items:center;gap:8px">
            <div id="wallet-address-short" style="font-size:13px;font-family:monospace;color:#8e8e93"></div>
            <div style="width:32px;height:32px;background:#2481cc;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px">👤</div>
        </div>
    `;
}