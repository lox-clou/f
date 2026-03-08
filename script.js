let tg = window.Telegram.WebApp;
tg.expand();

// Твои фото для показа при выигрыше (фото 2-9)
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

// Символы для казино (эмодзи)
const casinoSymbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];

// Данные о выбранном тарифе
let selectedTariff = null;
let isSpinning = false;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    showMainMenu();
});

function showMainMenu() {
    document.getElementById('mainMenu').classList.add('active');
    document.getElementById('buyMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('hidden');
    document.getElementById('confirmMenu').classList.remove('active');
    document.getElementById('confirmMenu').classList.add('hidden');
    document.getElementById('casinoMenu').classList.remove('active');
    document.getElementById('casinoMenu').classList.add('hidden');
}

function showBuyMenu() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('active');
    document.getElementById('buyMenu').classList.remove('hidden');
    document.getElementById('confirmMenu').classList.remove('active');
    document.getElementById('confirmMenu').classList.add('hidden');
    document.getElementById('casinoMenu').classList.remove('active');
    document.getElementById('casinoMenu').classList.add('hidden');
}

function showConfirmMenu() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('hidden');
    document.getElementById('confirmMenu').classList.add('active');
    document.getElementById('confirmMenu').classList.remove('hidden');
    document.getElementById('casinoMenu').classList.remove('active');
    document.getElementById('casinoMenu').classList.add('hidden');
}

function showCasinoMenu() {
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.remove('active');
    document.getElementById('buyMenu').classList.add('hidden');
    document.getElementById('confirmMenu').classList.remove('active');
    document.getElementById('confirmMenu').classList.add('hidden');
    document.getElementById('casinoMenu').classList.add('active');
    document.getElementById('casinoMenu').classList.remove('hidden');
    resetCasino();
}

// Отправка действий в бота
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
                {type: 'default', text: '100', id: '100'},
                {type: 'default', text: '200', id: '200'},
                {type: 'default', text: '500', id: '500'},
                {type: 'cancel'}
            ]
        }, function(buttonId) {
            if (buttonId) {
                tg.sendData(JSON.stringify({
                    action: 'topup',
                    amount: parseInt(buttonId)
                }));
                tg.showAlert('Запрос на пополнение отправлен');
            }
        });
        return;
    } else if (action === 'support') {
        tg.sendData(JSON.stringify({ action: 'support' }));
        tg.showAlert('Связь с поддержкой будет открыта в боте');
        return;
    } else if (action === 'ad') {
        tg.sendData(JSON.stringify({ action: 'ad' }));
        tg.showAlert('По вопросам рекламы обратитесь в поддержку');
        return;
    }
    
    tg.sendData(JSON.stringify(data));
}

function selectTariff(gb, price) {
    selectedTariff = {
        gb: gb,
        price: price
    };
    
    document.getElementById('tariffDetails').innerHTML = 
        `<strong>${gb}гб - ${price}р</strong>`;
    
    showConfirmMenu();
}

function confirmPayment() {
    if (!selectedTariff) return;
    
    // Отправляем данные боту
    tg.sendData(JSON.stringify({
        action: 'purchase',
        gb: selectedTariff.gb,
        price: selectedTariff.price
    }));
    
    tg.showAlert(`Запрос на покупку отправлен`);
    
    // Возвращаемся в главное меню
    showMainMenu();
    selectedTariff = null;
}

// Казино функции
function resetCasino() {
    document.getElementById('slot1').textContent = '🍒';
    document.getElementById('slot2').textContent = '🍒';
    document.getElementById('slot3').textContent = '🍒';
    document.getElementById('casinoResult').innerHTML = '';
    document.getElementById('casinoResult').className = 'casino-result';
    
    // Прячем фото
    let winImage = document.getElementById('winImage');
    winImage.classList.add('hidden');
    winImage.style.backgroundImage = '';
}

function spinSlots() {
    if (isSpinning) return;
    
    isSpinning = true;
    let spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    spinButton.style.opacity = '0.5';
    
    // Прячем предыдущее фото
    let winImage = document.getElementById('winImage');
    winImage.classList.add('hidden');
    
    // Добавляем анимацию
    document.querySelectorAll('.slot').forEach(slot => {
        slot.classList.add('spinning');
    });
    
    // Генерируем случайные результаты
    setTimeout(() => {
        let results = [
            casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)],
            casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)],
            casinoSymbols[Math.floor(Math.random() * casinoSymbols.length)]
        ];
        
        document.getElementById('slot1').textContent = results[0];
        document.getElementById('slot2').textContent = results[1];
        document.getElementById('slot3').textContent = results[2];
        
        // Убираем анимацию
        document.querySelectorAll('.slot').forEach(slot => {
            slot.classList.remove('spinning');
        });
        
        // Проверяем результат
        let resultDiv = document.getElementById('casinoResult');
        
        if (results[0] === results[1] && results[1] === results[2]) {
            // Выигрыш - показываем случайное фото на весь экран
            let randomIndex = Math.floor(Math.random() * winImages.length);
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
    }, 1000);
}
