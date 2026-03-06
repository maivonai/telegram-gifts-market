// File: ui/telegram.js
export function initTelegram() {
    const tg = window.Telegram.WebApp;
    if (tg) {
        tg.expand();
        tg.ready();
        
        // Theme sync
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#ffffff');
    }
}