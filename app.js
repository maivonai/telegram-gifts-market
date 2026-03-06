// File: app.js
import { initTelegram } from './ui/telegram.js';
import { initHeader } from './ui/header.js';
import { initNavbar } from './ui/navbar.js';
import { initMarket } from './market/market.js';
import { initWallet } from './ton/wallet.js';
import { initModals } from './ui/modal.js';

let tonConnectUI = null;
let currentAddress = null;
let balance = 0;

const mockGifts = [
    { id: 45855, collection: "Fresh Socks", price: 6.89, image: "https://picsum.photos/id/1015/300/300", owner: null },
    { id: 12478, collection: "Free Elf", price: 3.45, image: "https://picsum.photos/id/201/300/300", owner: null },
    { id: 33921, collection: "Plush Pepe", price: 12.50, image: "https://picsum.photos/id/301/300/300", owner: null },
    { id: 88764, collection: "Heart Locket", price: 8.20, image: "https://picsum.photos/id/401/300/300", owner: null },
    { id: 55643, collection: "Durov's Cap", price: 45.00, image: "https://picsum.photos/id/501/300/300", owner: null },
    { id: 11234, collection: "Fresh Socks", price: 5.99, image: "https://picsum.photos/id/102/300/300", owner: null },
    { id: 99876, collection: "Free Elf", price: 2.10, image: "https://picsum.photos/id/202/300/300", owner: null },
    { id: 44567, collection: "Plush Pepe", price: 15.75, image: "https://picsum.photos/id/302/300/300", owner: null }
];

let marketListings = [...mockGifts];
let myGifts = [];
let activityLog = [];

function saveToStorage() {
    localStorage.setItem('myGifts', JSON.stringify(myGifts));
    localStorage.setItem('marketListings', JSON.stringify(marketListings));
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function loadFromStorage() {
    const savedMy = localStorage.getItem('myGifts');
    const savedMarket = localStorage.getItem('marketListings');
    const savedActivity = localStorage.getItem('activityLog');
    if (savedMy) myGifts = JSON.parse(savedMy);
    if (savedMarket) marketListings = JSON.parse(savedMarket);
    if (savedActivity) activityLog = JSON.parse(savedActivity);
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function sendDemoTransaction(price, gift) {
    if (!tonConnectUI || !currentAddress) {
        showToast("Connect wallet first");
        return false;
    }
    try {
        const nanoAmount = Math.floor(price * 1_000_000_000).toString();
        const demoAddress = "EQCD39VS5jcptHL8vMjEXrzGa7y6jK1i4zQ3fZ7f5f5Q"; // DEMO PAYMENT ADDRESS (replace in production)

        await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 60,
            messages: [{
                address: demoAddress,
                amount: nanoAmount
            }]
        });

        // On success
        const purchased = marketListings.find(g => g.id === gift.id);
        if (purchased) {
            marketListings = marketListings.filter(g => g.id !== gift.id);
            myGifts.push({ ...purchased, owner: currentAddress });
            activityLog.unshift({
                time: new Date().toISOString(),
                text: `Bought ${purchased.collection} #${purchased.id} for ${purchased.price} TON`
            });
            saveToStorage();
            renderAll();
        }
        showToast("✅ Purchase confirmed on TON!");
        return true;
    } catch (e) {
        console.error(e);
        showToast("Transaction cancelled");
        return false;
    }
}

function renderAll() {
    initMarket(marketListings, sendDemoTransaction);
    renderMyGifts();
    renderActivity();
}

function renderMyGifts() {
    const grid = document.getElementById('my-gifts-grid');
    grid.innerHTML = '';
    if (myGifts.length === 0) {
        grid.innerHTML = '<div style="padding:40px;text-align:center;color:#8e8e93">No gifts yet. Buy some in Market!</div>';
        return;
    }
    myGifts.forEach(gift => {
        const card = createGiftCard(gift, true);
        grid.appendChild(card);
    });
}

function renderActivity() {
    const list = document.getElementById('activity-list');
    list.innerHTML = '';
    activityLog.slice(0, 20).forEach(item => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
            <div style="color:#8e8e93;font-size:12px">${new Date(item.time).toLocaleString()}</div>
            <div>${item.text}</div>
        `;
        list.appendChild(div);
    });
}

function createGiftCard(gift, isOwned = false) {
    const card = document.createElement('div');
    card.className = 'gift-card';
    card.innerHTML = `
        <img src="${gift.image}" alt="${gift.collection}">
        <div class="gift-info">
            <div class="gift-name">${gift.collection}</div>
            <div class="gift-id">#${gift.id}</div>
            <div class="price">${gift.price} TON</div>
            ${isOwned ? 
                `<button class="buy-btn" style="background:#ff9500">List for Sale</button>` : 
                `<button class="buy-btn">Buy Now</button>`
            }
        </div>
    `;

    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', () => {
        if (isOwned) {
            openSellModal(gift);
        } else {
            openBuyModal(gift);
        }
    });

    return card;
}

function openBuyModal(gift) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <h3 style="margin-bottom:16px">Confirm Purchase</h3>
            <img src="${gift.image}" style="width:100%;border-radius:16px;margin-bottom:16px">
            <div style="font-size:18px;font-weight:700">${gift.collection} #${gift.id}</div>
            <div style="font-size:28px;margin:12px 0;color:#34c759">${gift.price} TON</div>
            <div style="color:#8e8e93;margin-bottom:24px">You will send ${gift.price} TON to marketplace</div>
            
            <button id="confirm-buy" style="width:100%;padding:16px;background:#2481cc;color:white;border:none;border-radius:16px;font-weight:700;font-size:17px">Send Transaction</button>
            <button id="cancel-buy" style="width:100%;margin-top:8px;padding:16px;background:transparent;color:#8e8e93;border:1px solid #8e8e93;border-radius:16px">Cancel</button>
        </div>
    `;

    document.getElementById('confirm-buy').onclick = async () => {
        modal.style.display = 'none';
        const success = await sendDemoTransaction(gift.price, gift);
        if (success) renderAll();
    };
    document.getElementById('cancel-buy').onclick = () => modal.style.display = 'none';
}

function openSellModal(gift) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>List for Sale</h3>
            <img src="${gift.image}" style="width:100%;border-radius:16px;margin:16px 0">
            <input id="sell-price" type="number" step="0.01" placeholder="Price in TON" style="width:100%;padding:14px;background:#2c2c2e;border:none;border-radius:12px;color:white;margin-bottom:16px">
            <button id="confirm-sell" style="width:100%;padding:16px;background:#ff9500;color:white;border:none;border-radius:16px;font-weight:700">List on Market</button>
            <button id="cancel-sell" style="width:100%;margin-top:8px;padding:16px;background:transparent;color:#8e8e93;border:1px solid #8e8e93;border-radius:16px">Cancel</button>
        </div>
    `;

    document.getElementById('confirm-sell').onclick = () => {
        const priceInput = parseFloat(document.getElementById('sell-price').value);
        if (!priceInput || priceInput <= 0) return showToast("Enter valid price");
        
        const listed = { ...gift, price: priceInput };
        marketListings.unshift(listed);
        myGifts = myGifts.filter(g => g.id !== gift.id);
        activityLog.unshift({ time: new Date().toISOString(), text: `Listed ${gift.collection} #${gift.id} for ${priceInput} TON` });
        saveToStorage();
        modal.style.display = 'none';
        renderAll();
        showToast("Listed successfully!");
    };
    document.getElementById('cancel-sell').onclick = () => modal.style.display = 'none';
}

window.onload = async () => {
    loadFromStorage();
    
    initTelegram();
    initHeader();
    initNavbar();
    initModals();
    initWallet(); // will set global tonConnectUI and currentAddress
    
    // Initial render
    renderAll();

    // Auto-refresh balance every 15s
    setInterval(() => {
        if (currentAddress) window.updateBalance();
    }, 15000);

    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
};