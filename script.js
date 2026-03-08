const tg = window.Telegram.WebApp;
tg.expand();

const winImages = [
    'https://i.ibb.co/tPXDXYcM/photo-2-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/67v8RMx0/photo-3-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/YTcFgFRH/photo-4-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/TQpCnCh/photo-5-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/7NT1BJsq/photo-6-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/prZckKvq/photo-7-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/8nyGwSKk/photo-8-2026-03-08-21-15-12.jpg',
    'https://i.ibb.co/wrKcfZvP/photo-9-2026-03-08-21-15-12.jpg'
];

const casinoSymbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🎰', '⭐', '🔔'];

let selectedTariff = null;
let isSpinning = false;
let spinCount = 0;

const App = {
    showMainMenu() {
        document.getElementById('mainMenu').classList.add('active');
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('buyMenu').classList.remove('active');
        document.getElementById('buyMenu').classList.add('hidden');
        document.getElementById('confirmMenu').classList.remove('active');
        document.getElementById('confirmMenu').classList.add('hidden');
        document.getElementById('casinoMenu').classList.remove('active');
        document.getElementById('casinoMenu').classList.add('hidden');
    },

    showBuyMenu() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('buyMenu').classList.add('active');
        document.getElementById('buyMenu').classList.remove('hidden');
        document.getElementById('confirmMenu').classList.remove('active');
        document.getElementById('confirmMenu').classList.add('hidden');
        document.getElementById('casinoMenu').classList.remove('active');
        document.getElementById('casinoMenu').classList.add('hidden');
    },

    showConfirmMenu() {
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('buyMenu').classList.remove('active');
        document.getElementById('buyMenu').classList.add('hidden');
        document.getElementById('confirmMenu').classList.add('active');
        document.getElementById('confirmMenu').classList.remove('hidden');
        document.getElementById('casinoMenu').classList.remove('active');
        document.getElementById('casinoMenu').classList.add('hidden');
    },

    showCasinoMenu() {
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

    support() {
        tg.sendData(JSON.stringify({ action: 'support' }));
        tg.showAlert('Связь с поддержкой будет открыта в боте');
    },

    ad() {
        tg.showAlert('По вопросам рекламы обратитесь в поддержку');
    },

    topup() {
        tg.showPopup({
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
                tg.sendData(JSON.stringify({
                    action: 'topup',
                    amount: parseInt(buttonId)
                }));
                tg.showAlert('✅ Запрос на пополнение отправлен');
            }
        });
    },

    selectTariff(gb, price, desc) {
        selectedTariff = { gb, price, desc };
        document.getElementById('tariffName').innerText = `${gb}гб`;
        document.getElementById('tariffDesc').innerText = desc;
        document.getElementById('tariffPrice').innerText = `${price}р`;
        this.showConfirmMenu();
    },

    confirmPayment() {
        if (!selectedTariff) return;
        tg.sendData(JSON.stringify({
            action: 'purchase',
            gb: selectedTariff.gb,
            price: selectedTariff.price
        }));
        tg.showAlert(`✅ Запрос на покупку ${selectedTariff.gb}гб отправлен`);
        this.showMainMenu();
        selectedTariff = null;
    },

    resetCasino() {
        document.getElementById('slot1').innerText = '🍒';
        document.getElementById('slot2').innerText = '🍒';
        document.getElementById('slot3').innerText = '🍒';
        document.getElementById('casinoResult').innerHTML = '';
        document.getElementById('casinoResult').className = 'casino-result';
        document.getElementById('winImage').classList.add('hidden');
        spinCount = 0;
        document.getElementById('spinCounter').innerText = '0';
    },

    spin() {
        if (isSpinning) return;
        
        isSpinning = true;
        spinCount++;
        document.getElementById('spinCounter').innerText = spinCount;
        
        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;
        spinButton.style.opacity = '0.7';
        
        const winImage = document.getElementById('winImage');
        winImage.classList.add('hidden');
        
        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => slot.classList.add('spinning'));
        
        const spinInterval = setInterval(() => {
            slots.forEach(slot => {
                const randomSymbol = casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)];
                slot.innerText = randomSymbol;
            });
        }, 60);
        
        setTimeout(() => {
            clearInterval(spinInterval);
            slots.forEach(slot => slot.classList.remove('spinning'));
            
            let results;
            let isWin;
            
            if (spinCount % 30 === 0) {
                const winSymbol = casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)];
                results = [winSymbol, winSymbol, winSymbol];
                isWin = true;
            } else {
                do {
                    results = [
                        casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)],
                        casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)],
                        casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)]
                    ];
                    isWin = results[0] === results[1] && results[1] === results[2];
                } while (isWin);
            }
            
            document.getElementById('slot1').innerText = results[0];
            document.getElementById('slot2').innerText = results[1];
            document.getElementById('slot3').innerText = results[2];
            
            const resultDiv = document.getElementById('casinoResult');
            
            if (isWin) {
                const randomIndex = Math.floor(Math.random() * winImages.length);
                winImage.style.backgroundImage = `url('${winImages[randomIndex]}')`;
                winImage.classList.remove('hidden');
                
                resultDiv.innerHTML = 'Поздравляю, казино фек поэтому идите закупайтесь';
                resultDiv.className = 'casino-result win';
            } else {
                resultDiv.innerHTML = 'Жалко, но все же казино фек';
                resultDiv.className = 'casino-result lose';
            }
            
            isSpinning = false;
            spinButton.disabled = false;
            spinButton.style.opacity = '1';
        }, 1500);
    }
};

window.App = App;
App.showMainMenu();
