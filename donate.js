document.addEventListener('DOMContentLoaded', function() {
    // Фильтрация товаров
    const filterButtons = document.querySelectorAll('.filter-btn');
    const itemCards = document.querySelectorAll('.item-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Фильтруем товары
            const filter = this.getAttribute('data-filter');
            
            itemCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Корзина
    const cartPanel = document.querySelector('.cart-panel');
    const cartHeader = document.querySelector('.cart-header');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    let cart = [];
    let totalPrice = 0;

    // Загрузка корзины из localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartDisplay();
    }

    // Сворачивание/разворачивание корзины
    cartHeader.addEventListener('click', function() {
        cartPanel.classList.toggle('cart-collapsed');
    });

    // Добавление товара в корзину
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.item-card');
            const id = card.getAttribute('data-id');
            const price = parseInt(card.getAttribute('data-price'));
            const title = card.querySelector('h2').textContent;

            // Проверяем, есть ли товар уже в корзине
            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.total = existingItem.price * existingItem.quantity;
            } else {
                cart.push({
                    id: id,
                    title: title,
                    price: price,
                    quantity: 1,
                    total: price
                });
            }

            // Обновляем общую стоимость
            totalPrice += price;
            updateCartDisplay();
            playAddToCartSound();
        });
    });

    // Обновление отображения корзины
    function updateCartDisplay() {
        // Очищаем текущее содержимое корзины
        cartItemsContainer.innerHTML = '';
        
        // Обновляем общую стоимость
        totalPrice = cart.reduce((sum, item) => sum + item.total, 0);
        totalPriceElement.textContent = `Итого: ${totalPrice}₽`;

        // Добавляем каждый товар в корзину
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-id', item.id);
            cartItem.innerHTML = `
                <div class="cart-item-name">${item.title}</div>
                <div class="cart-item-controls">
                    <button class="decrease-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-btn">+</button>
                </div>
                <div>${item.total}₽</div>
            `;
            cartItemsContainer.appendChild(cartItem);

            // Добавляем обработчики для кнопок + и -
            cartItem.querySelector('.decrease-btn').addEventListener('click', function() {
                changeItemQuantity(item.id, -1);
            });
            
            cartItem.querySelector('.increase-btn').addEventListener('click', function() {
                changeItemQuantity(item.id, 1);
            });
        });

        // Сохраняем корзину в localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Разворачиваем корзину, если в ней есть товары
        if (cart.length > 0) {
            cartPanel.classList.remove('cart-collapsed');
        }
    }

    // Изменение количества товара
    function changeItemQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
            } else {
                item.total = item.price * item.quantity;
            }
            updateCartDisplay();
        }
    }

    // Звуковой эффект при добавлении в корзину
    function playAddToCartSound() {
        const audio = new Audio('add-to-cart.mp3');
        audio.play().catch(error => console.log('Ошибка воспроизведения звука:', error));
    }

    // Переход к оплате - сохраняем данные
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        localStorage.setItem('totalPrice', totalPrice);
    });
}); 