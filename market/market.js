// File: market/market.js
import { createGiftCard } from './giftCard.js';
import { applyFilters } from './filters.js';

export function initMarket(listings, buyCallback) {
    const grid = document.getElementById('market-grid');
    grid.innerHTML = '';

    const filtered = applyFilters(listings);

    filtered.forEach(gift => {
        const card = createGiftCard(gift);
        // Override buy button to use passed callback
        const btn = card.querySelector('.buy-btn');
        if (btn) {
            btn.onclick = () => buyCallback(gift.price, gift);
        }
        grid.appendChild(card);
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#8e8e93">No gifts match filters</div>';
    }
}