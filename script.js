let tg = window.Telegram.WebApp;
tg.expand();

// Данные пользователя
let userBalance = 100;
let selectedTariff = null;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Получаем данные пользователя из Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        console.log('User:', tg.initDataUnsafe.user);
    }
    
    updateBalanceDisplay();
});

function showMainMenu() {
    hideAllMenus();
    document.getElementById('mainMenu').classList.add('active');
}

function showBuyMenu() {
    hideAllMenus();
    document.getElementById('buyMenu').classList.add('active');
}

function showCasino() {
    hideAllMenus();
    document.getElementById('casinoMenu').classList.add('active');
    resetCasino();
}

function showConfirmMenu() {
    hideAllMenus();
    document.getElementById('confirmMenu').classList.add('active');
}

function hideAllMenus() {
    document.querySelectorAll('.menu').forEach(menu => {
        menu.classList.remove('active');
    });
}

function updateBalanceDisplay() {
    document.getElementById('balanceDisplay').textContent = userBalance + 'р';
}

function selectTariff(gb, price, description) {
    selectedTariff = {
        gb: gb,
        price: price,
        description: description
    };
    
    document.getElementById('tariffDetails').innerHTML = 
        `<strong>${gb}гб - ${price}р</strong><br>${description}`;
    
    let balanceStatus = userBalance >= price ? 
        '✅ Достаточно средств' : 
        '❌ Недостаточно средств';
    
    document.getElementById('balanceCheck').textContent = balanceStatus;
    
    showConfirmMenu();
}

function confirmPayment() {
    if (!selectedTariff) return;
    
    if (userBalance >= selectedTariff.price) {
        // Списываем баланс
        userBalance -= selectedTariff.price;
        updateBalanceDisplay();
        
        // Отправляем данные боту
        tg.sendData(JSON.stringify({
            action: 'purchase',
            tariff: selectedTariff,
            newBalance: userBalance
        }));
        
        // Показываем уведомление
        tg.showAlert(`✅ Покупка совершена!\n\nТариф: ${selectedTariff.gb}гб\nСумма: ${selectedTariff.price}р\nОстаток: ${userBalance}р`);
        
        // Возвращаемся в главное меню
        showMainMenu();
        selectedTariff = null;
    } else {
        tg.showAlert('❌ Недостаточно средств. Пополните баланс.');
    }
}

function topUpBalance() {
    tg.showPopup({
        title: 'Пополнение баланса',
        message: 'Введите сумму пополнения:',
        buttons: [
            {type: 'default', text: '100р', id: '100'},
            {type: 'default', text: '200р', id: '200'},
            {type: 'default', text: '500р', id: '500'},
            {type: 'cancel'}
        ]
    }, function(buttonId) {
        if (buttonId && !isNaN(buttonId)) {
            let amount = parseInt(buttonId);
            userBalance += amount;
            updateBalanceDisplay();
            
            // Отправляем боту запрос на пополнение
            tg.sendData(JSON.stringify({
                action: 'topup',
                amount: amount
            }));
            
            tg.showAlert(`✅ Баланс пополнен на ${amount}р`);
        }
    });
}

function openSupport() {
    tg.openTelegramLink('https://t.me/support');
}

function showAdMessage() {
    tg.showAlert('📢 Здесь могла быть ваша реклама\n\nПо вопросам рекламы: @ads_manager');
}

// Казино
let casinoSymbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
let isSpinning = false;

function resetCasino() {
    document.getElementById('slot1').textContent = '🍒';
    document.getElementById('slot2').textContent = '🍒';
    document.getElementById('slot3').textContent = '🍒';
    document.getElementById('casinoResult').innerHTML = '';
    document.getElementById('casinoResult').className = 'casino-result';
}

function spinSlots() {
    if (isSpinning) return;
    
    isSpinning = true;
    let spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    spinButton.style.opacity = '0.5';
    
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
            resultDiv.innerHTML = '🎉 Поздравляю, казино фек поэтому идите закупайтесь!';
            resultDiv.className = 'casino-result win';
        } else {
            resultDiv.innerHTML = '😢 Жалко, но все же казино фек';
            resultDiv.className = 'casino-result lose';
        }
        
        isSpinning = false;
        spinButton.disabled = false;
        spinButton.style.opacity = '1';
    }, 1000);
}

// Обработка закрытия
tg.onEvent('mainButtonClicked', function() {
    tg.close();
});
