// File: ui/navbar.js
export function initNavbar() {
    const nav = document.getElementById('bottom-nav');
    nav.className = 'bottom-nav';
    nav.innerHTML = `
        <div class="nav-item active" data-tab="market">🏪<br>Market</div>
        <div class="nav-item" data-tab="auctions">🔨<br>Auctions</div>
        <div class="nav-item" data-tab="lease">📜<br>Lease</div>
        <div class="nav-item" data-tab="mygifts">🎁<br>My Gifts</div>
        <div class="nav-item" data-tab="activity">📜<br>Activity</div>
    `;

    const tabs = document.querySelectorAll('.nav-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById(`tab-${tab.dataset.tab}`);
            if (target) target.classList.add('active');
        });
    });
}