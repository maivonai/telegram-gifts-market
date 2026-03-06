// File: ton/wallet.js
export function initWallet() {
    const connectBtn = document.getElementById('connect-wallet-btn');
    if (!connectBtn) return;

    // Исправленный глобальный объект (правильное имя из CDN)
    window.tonConnectUI = new window.TonConnectUI({
        manifestUrl: './tonconnect-manifest.json',
        buttonRootId: 'connect-wallet-btn'
    });

    window.tonConnectUI.onStatusChange(async (wallet) => {
        if (wallet) {
            window.currentAddress = wallet.account.address;
            const short = window.currentAddress.slice(0,6) + '...' + window.currentAddress.slice(-4);
            document.getElementById('wallet-address-short').textContent = short;
            await updateBalance();
        } else {
            window.currentAddress = null;
            document.getElementById('wallet-balance').textContent = '0.000 TON';
        }
    });

    window.updateBalance = async () => {
        if (!window.currentAddress) return;
        try {
            const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${window.currentAddress}`);
            const data = await res.json();
            const balNano = BigInt(data.result || 0);
            const balTON = (Number(balNano) / 1_000_000_000).toFixed(3);
            document.getElementById('wallet-balance').textContent = `${balTON} TON`;
        } catch (e) {
            console.log("Balance fetch error (demo ok)");
        }
    };
}
