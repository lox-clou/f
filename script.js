let tg = window.Telegram.WebApp;
tg.expand();

// Твои фото Lucky Star для выигрыша
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

// Символы казино (ТОЛЬКО ЭМОДЗИ)
const casinoSymbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '🎰', '⭐', '🔔'];

let selectedTariff = null;
let isSpinning = false;
let spinCount = 0;

// Предзагрузка фото
function preloadImages() {
    winImages.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}
preloadImages();

// ================== НАВИГАЦИЯ ==================

function showMainMenu() {
    document.getElementById('mainMenu').classList.add('active');
    document.getElementById('mainMenu').classList.remove('hidden');
    
    document.getElementById('buyMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('hidden');
    
    document.getElementById('confirmMenu').classList.remove('active');
    document.getElementById('confirmMenu').classList.add('hidden');
    
    document.getElementById('casinoMenu').classList.remove('active');
    document.getElementById('casinoMenu').classList.add('hidden');
}

function showBuyMenu() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('mainMenu').classList.add('hidden');
    
    document.getElementById('buyMenu').classList.add('active');
    document.getElementById('buyMenu').classList.remove('hidden');
    
    document.getElementById('confirmMenu').classList.remove('active');
    document.getElementById('confirmMenu').classList.add('hidden');
    
    document.getElementById('casinoMenu').classList.remove('active');
    document.getElementById('casinoMenu').classList.add('hidden');
}

function showConfirmMenu() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('mainMenu').classList.add('hidden');
    
    document.getElementById('buyMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('hidden');
    
    document.getElementById('confirmMenu').classList.add('active');
    document.getElementById('confirmMenu').classList.remove('hidden');
    
    document.getElementById('casinoMenu').classList.remove('active');
    document.getElementById('casinoMenu').classList.add('hidden');
}

function showCasinoMenu() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('mainMenu').classList.add('hidden');
    
    document.getElementById('buyMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('hidden');
    
    document.getElementById('confirmMenu').classList.remove('active');
    document.getElementById('confirmMenu').classList.add('hidden');
    
    document.getElementById('casinoMenu').classList.add('active');
    document.getElementById('casinoMenu').classList.remove('hidden');
    
    resetCasino();
}

// ================== ОТПРАВКА В БОТА ==================

function sendToBot(action) {
    let data = { action: action };
    
    if (action === 'buy') {
        showBuyMenu();
        return;
    } else if (action === 'casino') {
        showCasinoMenu();
        return;
    } else if (action === 'topup') {
        tg.showPopup({
            title: 'Пополнение баланса',
            message: 'Введите сумму пополнения:',
            buttons: [
                { type: 'default', text: '100', id: '100' },
                { type: 'default', text: '200', id: '200' },
                { type: 'default', text: '500', id: '500' },
                { type: 'cancel' }
            ]
        }, function(buttonId) {
            if (buttonId) {
                tg.sendData(JSON.stringify({
                    action: 'topup',
                    amount: parseInt(buttonId)
                }));
                tg.showAlert('✅ Запрос на пополнение отправлен');
            }
        });
        return;
    } else if (action === 'support') {
        tg.sendData(JSON.stringify({ action: 'support' }));
        tg.showAlert('📞 Связь с поддержкой будет открыта в боте');
        return;
    } else if (action === 'ad') {
        tg.sendData(JSON.stringify({ action: 'ad' }));
        tg.showAlert('📢 По вопросам рекламы обратитесь в поддержку');
        return;
    }
    
    tg.sendData(JSON.stringify(data));
}

// ================== ПОКУПКИ ==================

function selectTariff(gb, price) {
    selectedTariff = { gb, price };
    document.getElementById('tariffDetails').innerHTML = 
        `<span style="font-size: 20px;">${gb}гб</span><br>` +
        `<span style="color: #059669; font-size: 24px;">${price}р</span>`;
    showConfirmMenu();
}

function confirmPayment() {
    if (!selectedTariff) return;
    
    tg.sendData(JSON.stringify({
        action: 'purchase',
        gb: selectedTariff.gb,
        price: selectedTariff.price
    }));
    
    tg.showAlert(`✅ Запрос на покупку ${selectedTariff.gb}гб отправлен`);
    showMainMenu();
    selectedTariff = null;
}

// ================== КАЗИНО ==================

function resetCasino() {
    document.getElementById('slot1').textContent = '🍒';
    document.getElementById('slot2').textContent = '🍒';
    document.getElementById('slot3').textContent = '🍒';
    document.getElementById('casinoResult').innerHTML = '';
    document.getElementById('casinoResult').className = 'casino-result';
    document.getElementById('winImage').classList.add('hidden');
    spinCount = 0;
    document.getElementById('spinCounter').textContent = 'Попыток: 0';
}

function spinSlots() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinCount++;
    document.getElementById('spinCounter').textContent = `Попыток: ${spinCount}`;
    
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
            const randomSymbol = casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)];
            slot.textContent = randomSymbol;
        });
    }, 60);
    
    // Остановка через 1.5 секунды
    setTimeout(() => {
        clearInterval(spinInterval);
        slots.forEach(slot => slot.classList.remove('spinning'));
        
        // Финальные результаты
        const results = [
            casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)],
            casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)],
            casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)]
        ];
        
        document.getElementById('slot1').textContent = results[0];
        document.getElementById('slot2').textContent = results[1];
        document.getElementById('slot3').textContent = results[2];
        
        // Проверка выигрыша (шанс ~5%)
        const isWin = results[0] === results[1] && results[1] === results[2] && Math.random() < 0.05;
        
        const resultDiv = document.getElementById('casinoResult');
        
        if (isWin) {
            // ВЫИГРЫШ - показываем случайное Lucky Star фото
            const randomIndex = Math.floor(Math.random() * winImages.length);
            winImage.style.backgroundImage = `url('${winImages[randomIndex]}')`;
            winImage.classList.remove('hidden');
            
            resultDiv.innerHTML = '🎉 ПОБЕДА! Казино фек - идите закупайтесь!';
            resultDiv.className = 'casino-result win';
        } else {
            resultDiv.innerHTML = '😢 Жалко, но казино фек';
            resultDiv.className = 'casino-result lose';
        }
        
        isSpinning = false;
        spinButton.disabled = false;
        spinButton.style.opacity = '1';
    }, 1500);
}

// ================== ИНИЦИАЛИЗАЦИЯ ==================

document.addEventListener('DOMContentLoaded', function() {
    showMainMenu();
});
