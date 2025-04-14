// Инициализация данных
let categories = JSON.parse(localStorage.getItem('asetworld_categories')) || [
    { id: 1, name: "Привилегии", slug: "privileges", description: "Привилегии для игроков" },
    { id: 2, name: "Валюта", slug: "currency", description: "Игровая валюта" },
    { id: 3, name: "Ключи", slug: "keys", description: "Ключи от кейсов" },
    { id: 4, name: "Квесты", slug: "quests", description: "Ускорения и бонусы для квестов" }
];

let products = JSON.parse(localStorage.getItem('asetworld_products')) || [
    {
        id: 1,
        name: "VIP привилегия",
        description: "Доступ к VIP командам и привилегиям на сервере. Расширенные возможности и эксклюзивные предметы.",
        price: 299,
        category: "privileges",
        image: "Иконки для моего магазина/vip.png"
    },
    {
        id: 2,
        name: "PREMIUM привилегия",
        description: "Максимальный набор возможностей и команд. Доступ ко всем особым возможностям сервера.",
        price: 599,
        category: "privileges",
        image: "Иконки для моего магазина/premium.png"
    },
    {
        id: 3,
        name: "1000 алерсов",
        description: "Пополнение баланса на 1000 алерсов. Используйте их для покупки предметов и ресурсов на сервере.",
        price: 100,
        category: "currency",
        image: "Иконки для моего магазина/currency.png"
    },
    {
        id: 4,
        name: "5000 алерсов",
        description: "Пополнение баланса на 5000 алерсов. Выгодное предложение с бонусом 15%.",
        price: 425,
        category: "currency",
        image: "Иконки для моего магазина/currency.png"
    },
    {
        id: 5,
        name: "Премиум ключ",
        description: "Ключ от премиум кейса с редкими предметами и ресурсами. Шанс получить эксклюзивные вещи.",
        price: 149,
        category: "keys",
        image: "Иконки для моего магазина/key.png"
    },
    {
        id: 6,
        name: "Легендарный ключ",
        description: "Ключ от легендарного кейса, содержащего самые редкие и ценные предметы на сервере.",
        price: 299,
        category: "keys",
        image: "Иконки для моего магазина/legendary_key.png"
    },
    {
        id: 7,
        name: "Ускорение квестов",
        description: "Ускорение прохождения текущего квеста на 50%. Сэкономьте время и получите награду быстрее.",
        price: 79,
        category: "quests",
        image: "Иконки для моего магазина/quest.png"
    },
    {
        id: 8,
        name: "Прокачка уровня квестов",
        description: "Мгновенное повышение вашего уровня квестов на 5 пунктов. Откройте доступ к более сложным и выгодным заданиям.",
        price: 199,
        category: "quests",
        image: "Иконки для моего магазина/quest_level.png"
    }
];

// Заказы
let orders = JSON.parse(localStorage.getItem('asetworld_orders')) || [];

// Генерация случайных заказов для демонстрации, если заказов нет
if (orders.length === 0) {
    // Создаем несколько демонстрационных заказов
    const demoOrders = [
        {
            id: 1001,
            username: "player1",
            email: "player1@example.com",
            paymentMethod: "card",
            items: [products[0], products[2]],
            total: 399,
            date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 дней назад
            status: "Выполнен"
        },
        {
            id: 1002,
            username: "player2",
            email: "player2@example.com",
            paymentMethod: "qiwi",
            items: [products[1]],
            total: 599,
            date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 дней назад
            status: "Обработан"
        },
        {
            id: 1003,
            username: "player3",
            email: "player3@example.com",
            paymentMethod: "yoomoney",
            items: [products[3], products[5], products[7]],
            total: 923,
            date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 дня назад
            status: "Новый"
        }
    ];
    
    orders = demoOrders;
    localStorage.setItem('asetworld_orders', JSON.stringify(orders));
}

// Статистика продаж
let statistics = {
    totalOrders: orders.length,
    totalSales: orders.reduce((sum, order) => sum + order.total, 0),
    recentOrders: orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
};

// Обновление данных о продажах за последние 6 месяцев
function updateSalesData() {
    const salesData = {
        months: [],
        values: []
    };
    
    // Получаем названия последних 6 месяцев
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = month.toLocaleString('ru-RU', { month: 'short' });
        salesData.months.push(monthName);
        
        // Расчет продаж за этот месяц
        const monthSales = orders.reduce((sum, order) => {
            const orderDate = new Date(order.date);
            if (orderDate.getMonth() === month.getMonth() && 
                orderDate.getFullYear() === month.getFullYear()) {
                return sum + order.total;
            }
            return sum;
        }, 0);
        
        salesData.values.push(monthSales);
    }
    
    return salesData;
}

// Сохранение данных
function saveData() {
    localStorage.setItem('asetworld_categories', JSON.stringify(categories));
    localStorage.setItem('asetworld_products', JSON.stringify(products));
    localStorage.setItem('asetworld_orders', JSON.stringify(orders));
}

// DOM элементы
const adminTabs = document.querySelectorAll('.admin-tab');
const navLinks = document.querySelectorAll('.admin-nav-links a');
const addProductModal = document.getElementById('addProductModal');
const addCategoryModal = document.getElementById('addCategoryModal');
const closeButtons = document.querySelectorAll('.close');
const addProductForm = document.getElementById('addProductForm');
const addCategoryForm = document.getElementById('addCategoryForm');

// Модальные окна для редактирования
let editProductModal;
let editCategoryModal;

// Переключение вкладок
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.dataset.tab;
        
        // Обновляем активные классы
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        adminTabs.forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
    });
});

// Отображение статистики
function displayStatistics() {
    // Обновляем статистику заказов
    statistics.totalOrders = orders.length;
    statistics.totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Если есть заказы, обновляем данные о продажах по месяцам
    if (orders.length > 0) {
        statistics.salesData = updateSalesData();
    }
    
    document.getElementById('visitsCount').textContent = statistics.totalOrders;
    document.getElementById('purchasesCount').textContent = statistics.totalOrders;
    document.getElementById('totalIncome').textContent = `${statistics.totalSales} ₽`;

    // График продаж
    const ctx = document.getElementById('salesChart').getContext('2d');
    if (window.salesChart) {
        window.salesChart.destroy(); // Уничтожаем предыдущий график, если он существует
    }
    window.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: statistics.salesData.months,
            datasets: [{
                label: 'Продажи по месяцам',
                data: statistics.salesData.values,
                borderColor: '#7e57c2',
                backgroundColor: 'rgba(126, 87, 194, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#b0b0b0'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#b0b0b0'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 13
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} ₽`;
                        }
                    }
                }
            }
        }
    });
    
    // Отображаем последние заказы
    const recentOrdersList = document.getElementById('recentOrdersList');
    recentOrdersList.innerHTML = '';

    // Сортируем заказы по дате (новые сверху)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentOrders = sortedOrders.slice(0, 5); // Берем последние 5 заказов

    if (recentOrders.length === 0) {
        recentOrdersList.innerHTML = '<p class="no-data">Заказы отсутствуют</p>';
        return;
    }

    recentOrders.forEach(order => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const status = order.status || 'Новый';
        const orderElement = document.createElement('div');
        orderElement.className = 'recent-order-item';
        
        orderElement.innerHTML = `
            <div class="order-header">
                <div class="order-id">Заказ #${order.id}</div>
                <div class="order-date">${formattedDate}</div>
            </div>
            <div class="order-details">
                <div class="order-user">
                    <i class="fas fa-user"></i> ${order.username}
                </div>
                <div class="order-email">
                    <i class="fas fa-envelope"></i> ${order.email}
                </div>
                <div class="order-amount">
                    <i class="fas fa-ruble-sign"></i> ${order.total} ₽
                </div>
                <div class="order-status status-${status}">
                    <i class="fas fa-tag"></i> ${status}
                </div>
            </div>
            <div class="order-actions">
                <button class="view-btn" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i> Просмотр
                </button>
            </div>
        `;
        
        recentOrdersList.appendChild(orderElement);
    });
}

// Отображение товаров
function displayProducts() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="6" class="no-data">Товары не найдены</td>`;
        tbody.appendChild(tr);
        return;
    }

    products.forEach(product => {
        // Находим категорию по slug
        const category = categories.find(cat => cat.slug === product.category);
        const categoryName = category ? category.name : 'Неизвестная категория';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${product.id}</td>
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.src='Иконки для моего магазина/default.png'">
            </td>
            <td>${product.name}</td>
            <td>${categoryName}</td>
            <td>${product.price} ₽</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Отображение категорий
function displayCategories() {
    const tbody = document.getElementById('categoriesTableBody');
    tbody.innerHTML = '';

    if (categories.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="3" class="no-data">Категории не найдены</td>`;
        tbody.appendChild(tr);
        return;
    }

    categories.forEach(category => {
        const productsInCategory = products.filter(p => p.category === category.id).length;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name} <span class="category-count">(${productsInCategory})</span></td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteCategory(${category.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Отображение модального окна добавления товара
function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    const categorySelect = document.getElementById('productCategory');
    
    // Очищаем список категорий
    categorySelect.innerHTML = '';
    
    // Заполняем список категориями
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    // Очищаем форму
    document.getElementById('addProductForm').reset();
    
    // Отображаем модальное окно
    modal.style.display = 'block';
}

function showAddCategoryModal() {
    addCategoryModal.style.display = 'none'; // Закрываем стандартное модальное окно
    
    // Создаем собственное модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'customCategoryModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        modal.remove();
    };
    
    modalContent.innerHTML = `
        <h2>Добавить категорию</h2>
        <form id="customCategoryForm">
            <div class="form-group">
                <label for="customCategoryName">Название</label>
                <input type="text" id="customCategoryName" name="categoryName" required>
            </div>
            <div class="form-group">
                <label for="customCategorySlug">Slug (для URL)</label>
                <input type="text" id="customCategorySlug" name="categorySlug" required>
                <small>Только латинские буквы, цифры и дефисы</small>
            </div>
            <button type="submit" class="btn primary">Добавить</button>
        </form>
    `;
    
    modalContent.prepend(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Отображаем модальное окно
    modal.style.display = 'block';
    
    // Автоматическое создание slug из названия
    const nameInput = document.getElementById('customCategoryName');
    const slugInput = document.getElementById('customCategorySlug');
    
    nameInput.addEventListener('input', () => {
        slugInput.value = generateSlug(nameInput.value);
    });
    
    // Обработчик события отправки формы
    const form = document.getElementById('customCategoryForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const categoryName = form.categoryName.value.trim();
        const categorySlug = form.categorySlug.value.trim();
        
        if (!categoryName || !categorySlug) {
            showNotification('Заполните все поля', 'error');
            return;
        }
        
        // Проверяем, что slug уникален
        if (categories.some(c => c.slug === categorySlug)) {
            showNotification('Категория с таким Slug уже существует', 'error');
            return;
        }
        
        const newCategory = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            name: categoryName,
            slug: categorySlug
        };
        
        categories.push(newCategory);
        saveData();
        displayCategories();
        
        // Закрываем модальное окно и показываем уведомление
        modal.remove();
        showNotification('Категория успешно добавлена');
    });
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Закрытие модальных окон
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Генерация slug из строки
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')  // Заменяем все символы кроме латинских букв, цифр, пробелов и дефисов
        .replace(/\s+/g, '-')         // Заменяем пробелы на дефисы
        .replace(/-+/g, '-')          // Заменяем несколько дефисов подряд одним
        .trim();                       // Удаляем начальные и конечные пробелы/дефисы
}

// Преобразование base64 файла в URL-объект для превью
function dataURLtoFile(dataURL, filename) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
}

// Получение превью изображения
function getImagePreview(inputElement, callback) {
    const file = inputElement.files[0];
    
    if (!file) {
        callback(null);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Функция для обработки формы добавления товара
function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value; // Теперь это slug категории
    const imageInput = document.getElementById('productImage');
    
    // Проверка наличия файла изображения
    if (imageInput.files.length === 0) {
        showNotification('Выберите изображение для товара', 'error');
        return;
    }
    
    // Получаем превью изображения
    getImagePreview(imageInput, function(imageData) {
        // Создаем новый товар
        const newProduct = {
            id: Date.now(),
            name,
            description,
            price,
            category,
            image: imageData
        };
        
        // Добавляем товар в список
        products.push(newProduct);
        
        // Сохраняем в localStorage
        saveData();
        
        // Обновляем отображение
        displayProducts();
        
        // Закрываем модальное окно
        document.getElementById('addProductModal').style.display = 'none';
        
        // Очищаем форму
        document.getElementById('addProductForm').reset();
        
        // Показываем уведомление
        showNotification('Товар успешно добавлен');
    });
}

// Функция для обработки формы добавления категории
function handleAddCategory(e) {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value;
    
    // Создаем slug из названия
    const slug = generateSlug(name);
    
    // Проверяем, существует ли уже категория с таким slug
    if (categories.some(cat => cat.slug === slug)) {
        showNotification('Категория с таким названием уже существует', 'error');
        return;
    }
    
    // Создаем новую категорию
    const newCategory = {
        id: Date.now(),
        name,
        slug,
        description: ''
    };
    
    // Добавляем категорию в список
    categories.push(newCategory);
    
    // Сохраняем в localStorage
    saveData();
    
    // Обновляем отображение
    displayCategories();
    
    // Закрываем модальное окно
    document.getElementById('addCategoryModal').style.display = 'none';
    
    // Очищаем форму
    document.getElementById('addCategoryForm').reset();
    
    // Показываем уведомление
    showNotification('Категория успешно добавлена');
}

// Функция для редактирования товара
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) {
        showNotification('Товар не найден', 'error');
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editProductModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        modal.remove();
    };
    
    // Форма редактирования товара
    modalContent.innerHTML = `
        <h2>Редактировать товар</h2>
        <form id="editProductForm">
            <input type="hidden" id="editProductId" value="${product.id}">
            <div class="form-group">
                <label for="editProductName">Название</label>
                <input type="text" id="editProductName" name="editProductName" value="${product.name}" required>
            </div>
            <div class="form-group">
                <label for="editProductDescription">Описание</label>
                <textarea id="editProductDescription" name="editProductDescription" required>${product.description}</textarea>
            </div>
            <div class="form-group">
                <label for="editProductPrice">Цена</label>
                <input type="number" id="editProductPrice" name="editProductPrice" value="${product.price}" required>
            </div>
            <div class="form-group">
                <label for="editProductCategory">Категория</label>
                <select id="editProductCategory" name="editProductCategory" required>
                    ${categories.map(cat => `<option value="${cat.slug}" ${product.category === cat.slug ? 'selected' : ''}>${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="editProductImage">Изображение</label>
                <input type="file" id="editProductImage" name="editProductImage" accept="image/*">
                <div class="current-image">
                    <p>Текущее изображение:</p>
                    <img src="${product.image}" alt="${product.name}" style="max-width: 100px; max-height: 100px;" onerror="this.src='Иконки для моего магазина/default.png'">
                </div>
            </div>
            <button type="submit" class="btn primary">Сохранить изменения</button>
        </form>
    `;
    
    modalContent.prepend(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Отображаем модальное окно
    modal.style.display = 'block';
    
    // Обработчик сохранения изменений
    const editForm = document.getElementById('editProductForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = parseInt(document.getElementById('editProductId').value);
        const name = document.getElementById('editProductName').value;
        const description = document.getElementById('editProductDescription').value;
        const price = parseFloat(document.getElementById('editProductPrice').value);
        const category = document.getElementById('editProductCategory').value;
        const imageInput = document.getElementById('editProductImage');
        
        // Находим индекс товара
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
            showNotification('Товар не найден', 'error');
            return;
        }
        
        // Обновляем данные товара
        products[productIndex].name = name;
        products[productIndex].description = description;
        products[productIndex].price = price;
        products[productIndex].category = category;
        
        // Если загружена новая картинка, обновляем её
        if (imageInput.files.length > 0) {
            getImagePreview(imageInput, function(imageData) {
                products[productIndex].image = imageData;
                
                // Сохраняем изменения
                saveData();
                displayProducts();
                
                // Закрываем модальное окно
                modal.remove();
                
                showNotification('Товар успешно обновлен');
            });
        } else {
            // Сохраняем изменения
            saveData();
            displayProducts();
            
            // Закрываем модальное окно
            modal.remove();
            
            showNotification('Товар успешно обновлен');
        }
    });
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Функция для редактирования категории
function editCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) {
        showNotification('Категория не найдена', 'error');
        return;
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editCategoryModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        modal.remove();
    };
    
    // Форма редактирования категории
    modalContent.innerHTML = `
        <h2>Редактировать категорию</h2>
        <form id="editCategoryForm">
            <input type="hidden" id="editCategoryId" value="${category.id}">
            <div class="form-group">
                <label for="editCategoryName">Название</label>
                <input type="text" id="editCategoryName" name="editCategoryName" value="${category.name}" required>
            </div>
            <div class="form-group">
                <label for="editCategoryDescription">Описание</label>
                <textarea id="editCategoryDescription" name="editCategoryDescription">${category.description || ''}</textarea>
            </div>
            <button type="submit" class="btn primary">Сохранить изменения</button>
        </form>
    `;
    
    modalContent.prepend(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Отображаем модальное окно
    modal.style.display = 'block';
    
    // Обработчик сохранения изменений
    const editForm = document.getElementById('editCategoryForm');
    editForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const categoryId = parseInt(document.getElementById('editCategoryId').value);
        const name = document.getElementById('editCategoryName').value;
        const description = document.getElementById('editCategoryDescription').value;
        
        // Находим индекс категории
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) {
            showNotification('Категория не найдена', 'error');
            return;
        }
        
        // Обновляем данные категории
        categories[categoryIndex].name = name;
        categories[categoryIndex].description = description;
        
        // Генерируем slug из названия
        const newSlug = generateSlug(name);
        const oldSlug = categories[categoryIndex].slug;
        
        // Если slug изменился, обновляем его у всех товаров этой категории
        if (newSlug !== oldSlug) {
            categories[categoryIndex].slug = newSlug;
            
            // Обновляем категорию у всех товаров
            products.forEach(product => {
                if (product.category === oldSlug) {
                    product.category = newSlug;
                }
            });
        }
        
        // Сохраняем изменения
        saveData();
        displayCategories();
        displayProducts();
        
        // Закрываем модальное окно
        modal.remove();
        
        showNotification('Категория успешно обновлена');
    });
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Функции удаления
function deleteProduct(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            saveData();
            displayProducts();
            showNotification('Товар успешно удален');
        } else {
            showNotification('Товар не найден', 'error');
        }
    }
}

function deleteCategory(id) {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
        // Проверяем, используется ли категория в товарах
        const productsInCategory = products.filter(p => p.category === id);
        if (productsInCategory.length > 0) {
            if (confirm(`В этой категории есть ${productsInCategory.length} товаров. Удалить категорию вместе с товарами?`)) {
                // Удаляем все товары в категории
                products = products.filter(p => p.category !== id);
                
                // Удаляем категорию
                categories = categories.filter(c => c.id !== id);
                
                saveData();
                displayCategories();
                displayProducts();
                showNotification('Категория и товары успешно удалены');
            }
        } else {
            // Удаляем категорию
            categories = categories.filter(c => c.id !== id);
            
            saveData();
            displayCategories();
            showNotification('Категория успешно удалена');
        }
    }
}

// Показать уведомление
function showNotification(message, type = 'success') {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Создаем новое уведомление
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Добавляем класс visible для анимации появления
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10);
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('visible');
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Настраиваем плавный переход для анимации
    notification.style.transition = 'opacity 0.3s ease';
}

// Отображение заказов
function displayOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';

    if (orders.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="8" class="no-data">Заказы не найдены</td>`;
        tbody.appendChild(tr);
        return;
    }

    // Сортируем заказы по дате, сначала новые
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach(order => {
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Статус заказа (по умолчанию "Новый")
        const status = order.status || 'Новый';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${formattedDate}</td>
            <td>${order.username}</td>
            <td>${order.email}</td>
            <td>${order.items.length} товаров</td>
            <td>${order.total} ₽</td>
            <td>
                <select class="order-status" data-id="${order.id}">
                    <option value="Новый" ${status === 'Новый' ? 'selected' : ''}>Новый</option>
                    <option value="Обработан" ${status === 'Обработан' ? 'selected' : ''}>Обработан</option>
                    <option value="Выполнен" ${status === 'Выполнен' ? 'selected' : ''}>Выполнен</option>
                    <option value="Отменен" ${status === 'Отменен' ? 'selected' : ''}>Отменен</option>
                </select>
            </td>
            <td class="action-buttons">
                <button class="view-btn" onclick="viewOrder(${order.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="delete-btn" onclick="deleteOrder(${order.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Добавляем обработчики событий для изменения статуса
    document.querySelectorAll('.order-status').forEach(select => {
        select.addEventListener('change', function() {
            const orderId = parseInt(this.dataset.id);
            const newStatus = this.value;
            
            // Обновляем статус заказа
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
                localStorage.setItem('asetworld_orders', JSON.stringify(orders));
                showNotification(`Статус заказа #${orderId} изменен на "${newStatus}"`);
            }
        });
    });
}

// Просмотр заказа
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Заказ не найден', 'error');
        return;
    }
    
    // Создаем модальное окно для просмотра заказа
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'viewOrderModal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content order-modal';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => {
        modal.remove();
    };
    
    // Форматируем дату заказа
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Формируем HTML для отображения заказа
    modalContent.innerHTML = `
        <h2>Заказ #${order.id}</h2>
        
        <div class="order-details">
            <div class="order-info-row">
                <div class="label">Дата:</div>
                <div class="value">${formattedDate}</div>
            </div>
            <div class="order-info-row">
                <div class="label">Имя пользователя:</div>
                <div class="value">${order.username}</div>
            </div>
            <div class="order-info-row">
                <div class="label">Email:</div>
                <div class="value">${order.email}</div>
            </div>
            <div class="order-info-row">
                <div class="label">Метод оплаты:</div>
                <div class="value">${getPaymentMethodName(order.paymentMethod)}</div>
            </div>
            <div class="order-info-row">
                <div class="label">Статус:</div>
                <div class="value status-${order.status}">${order.status}</div>
            </div>
        </div>
        
        <h3>Товары</h3>
        <div class="order-items">
    `;
    
    // Добавляем товары заказа
    if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
            const quantity = item.quantity || 1;
            const itemTotal = item.price * quantity;
            
            modalContent.innerHTML += `
                <div class="order-item">
                    <div class="order-item-info">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image" onerror="this.src='Иконки для моего магазина/default.png'">
                        <div class="order-item-details">
                            <h4>${item.name}</h4>
                            <p>${item.price} ₽ × ${quantity}</p>
                        </div>
                    </div>
                    <div class="order-item-total">${itemTotal} ₽</div>
                </div>
            `;
        });
    } else {
        modalContent.innerHTML += `<p class="no-data">Товары не найдены</p>`;
    }
    
    // Добавляем итоговую сумму
    modalContent.innerHTML += `
        </div>
        <div class="order-total">
            <h3>Итого: <span>${order.total} ₽</span></h3>
        </div>
    `;
    
    // Добавляем возможность изменения статуса
    modalContent.innerHTML += `
        <div style="margin-top: 20px; text-align: center;">
            <div class="form-group">
                <label for="modalOrderStatus">Изменить статус заказа:</label>
                <select id="modalOrderStatus" class="order-status" style="width: 200px; margin: 10px auto;">
                    <option value="Новый" ${order.status === 'Новый' ? 'selected' : ''}>Новый</option>
                    <option value="Обработан" ${order.status === 'Обработан' ? 'selected' : ''}>Обработан</option>
                    <option value="Выполнен" ${order.status === 'Выполнен' ? 'selected' : ''}>Выполнен</option>
                    <option value="Отменен" ${order.status === 'Отменен' ? 'selected' : ''}>Отменен</option>
                </select>
            </div>
            <button id="updateStatusBtn" class="btn primary">Сохранить статус</button>
        </div>
    `;
    
    modalContent.prepend(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Показываем модальное окно
    modal.style.display = 'block';
    
    // Обработчик изменения статуса
    document.getElementById('updateStatusBtn').addEventListener('click', function() {
        const newStatus = document.getElementById('modalOrderStatus').value;
        
        // Обновляем статус заказа
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem('asetworld_orders', JSON.stringify(orders));
            
            // Обновляем отображение заказов
            displayOrders();
            displayStatistics(); // Обновляем статистику
            
            // Закрываем модальное окно
            modal.remove();
            
            showNotification(`Статус заказа #${orderId} изменен на "${newStatus}"`);
        }
    });
    
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Функция для удаления заказа
function deleteOrder(orderId) {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            orders.splice(orderIndex, 1);
            localStorage.setItem('asetworld_orders', JSON.stringify(orders));
            
            // Обновляем отображение заказов и статистику
            displayOrders();
            displayStatistics();
            
            showNotification('Заказ успешно удален');
        } else {
            showNotification('Заказ не найден', 'error');
        }
    }
}

// Получение названия платежного метода
function getPaymentMethodName(method) {
    switch (method) {
        case 'card':
            return 'Банковская карта';
        case 'qiwi':
            return 'QIWI';
        case 'yoomoney':
            return 'ЮMoney';
        default:
            return method;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отображаем статистику
    displayStatistics();
    
    // Отображаем товары
    displayProducts();
    
    // Отображаем категории
    displayCategories();
    
    // Отображаем заказы
    displayOrders();
    
    // Обработчик события нажатия на кнопку добавления товара
    document.getElementById('addProductBtn').addEventListener('click', showAddProductModal);
    
    // Обработчик события нажатия на кнопку добавления категории
    document.getElementById('addCategoryBtn').addEventListener('click', showAddCategoryModal);
    
    // Обработчик события отправки формы добавления товара
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    
    // Активация вкладки из URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tabLink = document.querySelector(`.admin-nav-links a[data-tab="${hash}"]`);
        if (tabLink) {
            tabLink.click();
        } else {
            document.querySelector('.admin-nav-links a').click(); // Активируем первую вкладку по умолчанию
        }
    } else {
        document.querySelector('.admin-nav-links a').click(); // Активируем первую вкладку по умолчанию
    }
});

// Обработка хэша URL при его изменении
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const tabLink = document.querySelector(`.admin-nav-links a[data-tab="${hash}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
});