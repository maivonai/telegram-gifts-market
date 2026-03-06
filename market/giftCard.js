// File: market/giftCard.js
export function createGiftCard(gift) {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML = `
        <img src="${gift.image}" alt="${gift.collection}">
        <div class="gift-info">
            <div class="gift-name">${gift.collection}</div>
            <div class="gift-id">#${gift.id}</div>
            <div class="price">${gift.price} TON</div>
            <button class="buy-btn">Buy Now</button>
        </div>
    `;
    return card;
}