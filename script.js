// Глобальный объект приложения
window.App = {
    tg: null,
    winImages: [
        'https://i.ibb.co/tPXDXYcM/photo-2-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/67v8RMx0/photo-3-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/YTcFgFRH/photo-4-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/TQpCnCh/photo-5-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/7NT1BJsq/photo-6-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/prZckKvq/photo-7-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/8nyGwSKk/photo-8-2026-03-08-21-15-12.jpg',
        'https://i.ibb.co/wrKcfZvP/photo-9-2026-03-08-21-15-12.jpg'
    ],
    casinoSymbols: ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🎰', '⭐', '🔔'],
    selectedTariff: null,
    isSpinning: false,
    spinCount: 0,

    // Инициализация
    init: function() {
        this.tg = window.Telegram.WebApp;
        this.tg.expand();
        this.preloadImages();
        this.showMainMenu();
    },

    // Предзагрузка фото
    preloadImages: function() {
        this.winImages.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    },

    // ========== НАВИГАЦИЯ ==========
    showMainMenu: function() {
        document.getElementById('mainMenu').classList.add('active');
        document.getElementById('mainMenu').classList.remove('hidden');
        
        document.getElementById('buyMenu').classList.remove('active');
        document.getElementById('buyMenu').classList.add('hidden');
        
        document.getElementById('confirmMenu').classList.remove('active');
        document.getElementById('confirmMenu').classList.add('hidden');
        
        document.getElementById('casinoMenu').classList.remove('active');
        document.getElementById('casinoMenu').classList.add('hidden');
    },

    showBuyMenu: function() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('mainMenu').classList.add('hidden');
        
        document.getElementById('buyMenu').classList.add('active');
        document.getElementById('buyMenu').classList.remove('hidden');
        
        document.getElementById('confirmMenu').classList.remove('active');
        document.getElementById('confirmMenu').classList.add('hidden');
        
        document.getElementById('casinoMenu').classList.remove('active');
        document.getElementById('casinoMenu').classList.add('hidden');
    },

    showConfirmMenu: function() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('mainMenu').classList.add('hidden');
        
        document.getElementById('buyMenu').classList.remove('active');
        document.getElementById('buyMenu').classList.add('hidden');
        
        document.getElementById('confirmMenu').classList.add('active');
        document.getElementById('confirmMenu').classList.remove('hidden');
        
        document.getElementById('casinoMenu').classList.remove('active');
        document.getElementById('casinoMenu').classList.add('hidden');
    },

    showCasinoMenu: function() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('mainMenu').classList.add('hidden');
        
        document.getElementById('buyMenu').classList.remove('active');
        document.getElementById('buyMenu').classList.add('hidden');
        
        document.getElementById('confirmMenu').classList.remove('active');
        document.getElementById('confirmMenu').classList.add('hidden');
        
        document.getElementById('casinoMenu').classList.add('active');
        document.getElementById('casinoMenu').classList.remove('hidden');
        
        this.resetCasino();
    },

    // ========== ОТПРАВКА В БОТА ==========
    sendToBot: function(action) {
        if (action === 'buy') {
            this.showBuyMenu();
            return;
        } else if (action === 'casino') {
            this.showCasinoMenu();
            return;
        } else if (action === 'topup') {
            this.tg.showPopup({
                title: 'Пополнение баланса',
                message: 'Введите сумму пополнения:',
                buttons: [
                    { type: 'default', text: '100', id: '100' },
                    { type: 'default', text: '200', id: '200' },
                    { type: 'default', text: '500', id: '500' },
                    { type: 'cancel' }
                ]
            }, (buttonId) => {
                if (buttonId) {
                    this.tg.sendData(JSON.stringify({
                        action: 'topup',
                        amount: parseInt(buttonId)
                    }));
                    this.tg.showAlert('✅ Запрос на пополнение отправлен');
                }
            });
            return;
        } else if (action === 'support') {
            this.tg.sendData(JSON.stringify({ action: 'support' }));
            this.tg.showAlert('📞 Связь с поддержкой будет открыта в боте');
            return;
        } else if (action === 'ad') {
            this.tg.sendData(JSON.stringify({ action: 'ad' }));
            this.tg.showAlert('📢 По вопросам рекламы обратитесь в поддержку');
            return;
        }
        
        this.tg.sendData(JSON.stringify({ action: action }));
    },

    // ========== ПОКУПКИ ==========
    selectTariff: function(gb, price) {
        this.selectedTariff = { gb, price };
        document.getElementById('tariffDetails').innerHTML = 
            `<span style="font-size: 20px;">${gb}гб</span><br>` +
            `<span style="color: #059669; font-size: 24px;">${price}р</span>`;
        this.showConfirmMenu();
    },

    confirmPayment: function() {
        if (!this.selectedTariff) return;
        
        this.tg.sendData(JSON.stringify({
            action: 'purchase',
            gb: this.selectedTariff.gb,
            price: this.selectedTariff.price
        }));
        
        this.tg.showAlert(`✅ Запрос на покупку ${this.selectedTariff.gb}гб отправлен`);
        this.showMainMenu();
        this.selectedTariff = null;
    },

    // ========== КАЗИНО ==========
    resetCasino: function() {
        document.getElementById('slot1').textContent = '🍒';
        document.getElementById('slot2').textContent = '🍒';
        document.getElementById('slot3').textContent = '🍒';
        document.getElementById('casinoResult').innerHTML = '';
        document.getElementById('casinoResult').className = 'casino-result';
        document.getElementById('winImage').classList.add('hidden');
        this.spinCount = 0;
        document.getElementById('spinCounter').textContent = 'Попыток: 0';
    },

    spinSlots: function() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinCount++;
        document.getElementById('spinCounter').textContent = `Попыток: ${this.spinCount}`;
        
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;
        spinButton.style.opacity = '0.7';
        
        // Прячем фото
        const winImage = document.getElementById('winImage');
        winImage.classList.add('hidden');
        
        // Анимация прокрутки
        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => slot.classList.add('spinning'));
        
        // Эффект быстрой смены символов
        const spinInterval = setInterval(() => {
            slots.forEach(slot => {
                const randomSymbol = this.casinoSymbols[Math.floor(Math.random() * this.casinoSymbols.length)];
                slot.textContent = randomSymbol;
            });
        }, 60);
        
        // Остановка через 1.5 секунды
        setTimeout(() => {
            clearInterval(spinInterval);
            slots.forEach(slot => slot.classList.remove('spinning'));
            
            // Финальные результаты
            const results = [
                this.casinoSymbols[Math.floor(Math.random() * this.casinoSymbols.length)],
                this.casinoSymbols[Math.floor(Math.random() * this.casinoSymbols.length)],
                this.casinoSymbols[Math.floor(Math.random() * this.casinoSymbols.length)]
            ];
            
            document.getElementById('slot1').textContent = results[0];
            document.getElementById('slot2').textContent = results[1];
            document.getElementById('slot3').textContent = results[2];
            
            // Проверка выигрыша (шанс ~5%)
            const isWin = results[0] === results[1] && results[1] === results[2] && Math.random() < 0.05;
            
            const resultDiv = document.getElementById('casinoResult');
            
            if (isWin) {
                // ВЫИГРЫШ - показываем случайное Lucky Star фото
                const randomIndex = Math.floor(Math.random() * this.winImages.length);
                winImage.style.backgroundImage = `url('${this.winImages[randomIndex]}')`;
                winImage.classList.remove('hidden');
                
                resultDiv.innerHTML = '🎉 ПОБЕДА! Казино фек - идите закупайтесь!';
                resultDiv.className = 'casino-result win';
            } else {
                resultDiv.innerHTML = '😢 Жалко, но казино фек';
                resultDiv.className = 'casino-result lose';
            }
            
            this.isSpinning = false;
            spinButton.disabled = false;
            spinButton.style.opacity = '1';
        }, 1500);
    }
};

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    window.App.init();
});

// Глобальные функции для вызова из HTML
function sendToBot(action) {
    window.App.sendToBot(action);
}

function selectTariff(gb, price) {
    window.App.selectTariff(gb, price);
}

function confirmPayment() {
    window.App.confirmPayment();
}

function spinSlots() {
    window.App.spinSlots();
}

function showMainMenu() {
    window.App.showMainMenu();
}

function showBuyMenu() {
    window.App.showBuyMenu();
}
