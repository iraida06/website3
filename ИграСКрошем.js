// Сценарий игры "Эко-приключение с Крошем"

// Состояние игры
let gameState = {
    currentScreen: 'intro',
    score: 0,
    level: 1,
    currentQuestion: 0,
    correctAnswers: 0,
    trashSorted: 0,
    totalTrash: 6,
    currentSlide: 0,
    totalSlides: 5,
    isAnswerLocked: false
};

// Данные вопросов викторины
const quizQuestions = [
    {
        question: "В какой контейнер нужно выбросить стаканчик?",
        image: "ФотоКрош/стакан.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 1,
        helper: "✅ Правильно! Пластиковые стаканчики нужно выбрасывать в жёлтый контейнер для пластика и металла!"
    },
    {
        question: "Куда правильно выбросить банановую кожуру?",
        image: "ФотоКрош/БанановаяКожура.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 3,
        helper: "✅ Молодец! Банановая кожура - это органические отходы, они идут в коричневый контейнер!"
    },
    {
        question: "В какой контейнер нужно выбросить старую газету?",
        image: "ФотоКрош/Газета.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 0,
        helper: "✅ Отлично! Газеты и другая бумага идут в синий контейнер для бумажных отходов!"
    },
    {
        question: "Куда правильно выбросить стеклянную банку?",
        image: "ФотоКрош/Банка.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 2,
        helper: "✅ Правильно! Стеклянная банка должна попасть в зелёный контейнер для стекла!"
    },
    {
        question: "Что НЕ относится к органическим отходам?",
        image: "ФотоКрош/Мусор6.png",
        answers: ["Яблочная кожура", "Пластиковая упаковка", "Кофейная гуща", "Листья"],
        correct: 1,
        helper: "✅ Верно! Пластиковая упаковка не органический отход! Её нужно сдавать на переработку."
    }
];

// Интересные факты
const funFacts = [
    {
        image: "ФотоКрош/Переработка2.png",
        text: "Из одной тонны макулатуры можно сделать 700 кг новой бумаги!"
    },
    {
        image: "ФотоКрош/Дерево.png",
        text: "Переработка одной тонны бумаги спасает 17 деревьев!"
    },
    {
        image: "ФотоКрош/Лампочка.png",
        text: "Переработка алюминиевой банки экономит энергию на 3 часа работы телевизора!"
    },
    {
        image: "ФотоКрош/Следы.png",
        text: "Правильная сортировка мусора спасает жизни диких животных!"
    }
];

let currentFactIndex = 0;
let draggedElement = null;

// Инициализация игры
document.addEventListener('DOMContentLoaded', function() {
    updateScoreDisplay();
    initializeFacts();
    resetGamePositions();
    showInstruction(); // Показываем инструкцию при загрузке игры
});
// ПОКАЗ ИНСТРУКЦИИ
function showInstruction() {
    console.log('Показываем инструкцию...');
    
    const oldInstruction = document.getElementById('gameInstruction');
    const oldOverlay = document.getElementById('instructionOverlay');
    if (oldInstruction) oldInstruction.remove();
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    overlay.id = 'instructionOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        z-index: 1999;
        backdrop-filter: blur(5px);
    `;

    const instructionHTML = `
        <div id="gameInstruction" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 30px; padding: 25px; 
            max-width: 400px; width: 90%; z-index: 2000; box-shadow: 0 25px 50px rgba(0,0,0,0.5); 
            border: 2px solid #fbbf24; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🐰</div>
            <h2 style="color: #fbbf24; margin-bottom: 15px;">Как играть?</h2>
            <div style="color: white; text-align: left; margin-bottom: 20px;">
                <p style="margin: 10px 0;">📖 <strong>Шаг 1:</strong> Посмотри обучающий урок о сортировке мусора</p>
                <p style="margin: 10px 0;">🗑️ <strong>Шаг 2:</strong> Перетащи мусор в нужные контейнеры (выбери предмет и перетащи его)</p>
                <p style="margin: 10px 0;">❓ <strong>Шаг 3:</strong> Ответь на вопросы викторины</p>
                <p style="margin: 10px 0;">⭐ <strong>Шаг 4:</strong> Получи награду эко-героя!</p>
                <hr style="margin: 15px 0; border-color: #fbbf24;">
                <p style="margin: 10px 0; color: #fbbf24;">💡 Совет: Вспомни цвета контейнеров: синий - бумага, жёлтый - пластик, зелёный - стекло, коричневый - органика!</p>
            </div>
            <button onclick="closeInstruction()" style="background: #fbbf24; border: none; padding: 12px 30px; 
                border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; color: #1e293b;">
                Начать приключение! ✨
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.insertAdjacentHTML('beforeend', instructionHTML);
}

function closeInstruction() {
    console.log('Закрываем инструкцию...');
    const instruction = document.getElementById('gameInstruction');
    const overlay = document.getElementById('instructionOverlay');
    if (instruction) instruction.remove();
    if (overlay) overlay.remove();
}

// Обновление отображения счёта
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) scoreElement.textContent = gameState.score;
}

// Функция для добавления баллов
function addScore(points) {
    if (gameState.score + points <= 100) {
        gameState.score += points;
        return points;
    } else {
        const remainingPoints = 100 - gameState.score;
        gameState.score = 100;
        return remainingPoints;
    }
}

// Функция для показа всплывающего сообщения с баллами
function showScorePopup(x, y, text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #22c55e, #16a34a);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 700;
        font-size: 1.125rem;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 10px 20px rgba(34, 197, 94, 0.4);
        animation: scorePopup 2s ease-out forwards;
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// Функция для сброса позиций всех элементов мусора
function resetGamePositions() {
    const trashContainer = document.querySelector('.trash-items');
    if (!trashContainer) return;
    
    // Очищаем контейнер
    trashContainer.innerHTML = '';
    
    // Позиции для элементов мусора (равномерное распределение)
    const positions = [
        { top: '10%', left: '10%' },   // Газета
        { top: '10%', left: '40%' },  // Банан
        { top: '10%', left: '67%' },  // Тарелка
        { top: '40%', left: '25%' },   // Коробка
        { top: '40%', left: '55%' },  // Стаканчик
        { top: '40%', left: '85%' }   // Банка
    ];
    
    // Воссоздаем элементы мусора с правильными позициями
    const trashData = [
        { type: 'paper', icon: 'ФотоКрош/Газета.png', label: 'Газета' },
        { type: 'plastic', icon: 'ФотоКрош/стакан.png', label: 'Стаканчик' },
        { type: 'organic', icon: 'ФотоКрош/Банан.png', label: 'Банан' },
        { type: 'glass', icon: 'ФотоКрош/Банка.png', label: 'Стеклянная банка' },
        { type: 'paper', icon: 'ФотоКрош/Коробка.png', label: 'Коробка' },
        { type: 'plastic', icon: 'ФотоКрош/Тарелка.png', label: 'Одноразовая посуда' }
    ];
    
    trashData.forEach((item, index) => {
        const trashItem = document.createElement('div');
        trashItem.className = 'trash-item';
        trashItem.setAttribute('data-type', item.type);
        trashItem.style.position = 'absolute';
        trashItem.style.top = positions[index].top;
        trashItem.style.left = positions[index].left;
        trashItem.style.transform = 'translate(-50%, -50%)';
        
        trashItem.innerHTML = `
            <img class="item-icon" src="${item.icon}" alt="${item.label}"/>
            <div class="item-label">${item.label}</div>
        `;
        
        trashContainer.appendChild(trashItem);
    });
    
    // Сбрасываем все классы и стили
    const newTrashItems = document.querySelectorAll('.trash-item');
    newTrashItems.forEach(item => {
        item.style.opacity = '1';
        item.style.pointerEvents = 'auto';
        item.style.transform = 'translate(-50%, -50%)';
        item.classList.remove('dragging', 'sorted');
    });
    
    // Сбрасываем контейнеры
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => {
        bin.classList.remove('drag-over');
    });
    
    // Сбрасываем прогресс
    const progressFill = document.getElementById('sortingProgress');
    if (progressFill) {
        progressFill.style.width = '0%';
    }
    
    const percentageText = document.getElementById('sortingPercentage');
    if (percentageText) {
        percentageText.textContent = '0%';
    }
}

// Инициализация функции перетаскивания
function initializeDragAndDrop() {
    const trashItems = document.querySelectorAll('.trash-item');
    const bins = document.querySelectorAll('.bin');
    
    // Настройка элементов корзины
    trashItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.dataset.type);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedElement = null;
        });
    });
    
    // Настройка корзин
    bins.forEach(bin => {
        bin.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });
        
        bin.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        bin.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        bin.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedElement && !draggedElement.classList.contains('sorted')) {
                const itemType = draggedElement.dataset.type;
                const binType = this.dataset.type;
                const helperText = document.getElementById('sortingHelperText');
                
                if (itemType === binType) {
                    // Правильная сортировка - 5 баллов за каждый предмет
                    draggedElement.style.opacity = '0.3';
                    draggedElement.style.pointerEvents = 'none';
                    draggedElement.classList.add('sorted');
                    gameState.trashSorted++;
                    
                    const addedPoints = addScore(5);
                    
                    // Показывайте положительные отзывы с баллами
                    showScorePopup(e.clientX, e.clientY, `+${addedPoints}`);
                    
                    /// Показываем положительный комментарий ТОЛЬКО после действия
                    if (helperText) {
                        helperText.innerHTML = '🎉 Отлично! Правильно отсортировал! +5 очков!';
                        helperText.style.color = '#22c55e';
                        setTimeout(() => {
                            if (helperText) {
                                helperText.innerHTML = 'Продолжай в том же духе! Перетаскивай предметы в нужные контейнеры!';
                                helperText.style.color = '';
                            }
                        }, 2500);
                    }
                    
                    if (gameState.trashSorted >= gameState.totalTrash) {
                        setTimeout(() => {
                            const bonusPoints = addScore(15);
                            updateScoreDisplay();
                            showScorePopup(window.innerWidth / 2, window.innerHeight / 2, `+${bonusPoints} Бонус за сортировку!`);
                            
                            setTimeout(() => {
                                startQuiz();
                            }, 2000);
                        }, 1500);
                    }
                } else {
                    // Неправильная сортировка
                    draggedElement.style.animation = 'shake 0.5s ease-in-out';
                    
                    setTimeout(() => {
                        draggedElement.style.animation = '';
                    }, 500);
                    
                    // Показываем подсказку ТОЛЬКО после неправильного действия
                    if (helperText) {
                        helperText.innerHTML = '😔 Неправильно! Этот предмет не подходит для этого контейнера. Попробуй ещё раз!';
                        helperText.style.color = '#ef4444';
                        
                        setTimeout(() => {
                            if (helperText && !helperText.innerHTML.includes('Отлично')) {
                                helperText.innerHTML = 'Подсказка: Вспомни цвета контейнеров и какие отходы куда класть!';
                                setTimeout(() => {
                                    if (helperText && !helperText.innerHTML.includes('Отлично')) {
                                        helperText.innerHTML = 'Перетаскивай предметы в правильные контейнеры!';
                                        helperText.style.color = '';
                                    }
                                }, 3000);
                            }
                        }, 2500);
                    }
                }
                
                updateScoreDisplay();
                updateSortingProgress();
            }
        });
    });
}

function updateSortingProgress() {
    const percentage = Math.round((gameState.trashSorted / gameState.totalTrash) * 100);
    
    const progressFill = document.getElementById('sortingProgress');
    const percentageText = document.getElementById('sortingPercentage');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (percentageText) percentageText.textContent = percentage + '%';
}

// Начало лекции
function startLecture() {
    showScreen('lectureScreen');
    gameState.currentScreen = 'lecture';
}

// Навигация по лекции
function nextSlide() {
    if (gameState.currentSlide < gameState.totalSlides - 1) {
        gameState.currentSlide++;
        showSlide(gameState.currentSlide);
        updateLectureNavigation();
    }
}

function previousSlide() {
    if (gameState.currentSlide > 0) {
        gameState.currentSlide--;
        showSlide(gameState.currentSlide);
        updateLectureNavigation();
    }
}

function goToSlide(slideIndex) {
    gameState.currentSlide = slideIndex;
    showSlide(gameState.currentSlide);
    updateLectureNavigation();
}

function showSlide(slideIndex) {
    // Скрытие всех слайдов
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Показ текущего слайда
    const currentSlide = document.getElementById(`slide${slideIndex + 1}`);
    if (currentSlide) {
        currentSlide.classList.add('active');
    }
    
    // Обновление индикатора
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
    
    // Обновление текста преподавателя на основе слайда
    const teacherTexts = [
        "Сортировка мусора помогает сохранить нашу планету чистой и здоровой!",
        "Запомни цвета контейнеров - это поможет тебе правильно сортировать отходы!",
        "Бумагу можно перерабатывать до 7 раз! Это очень экологично!",
        "Пластик нужно обязательно мыть перед тем, как выбрасывать в контейнер!",
        "Органические отходы превращаются в компост - отличное удобрение для растений!"
    ];
    
    const teacherTextElement = document.getElementById('teacherText');
    if (teacherTextElement) teacherTextElement.textContent = teacherTexts[slideIndex] || "Теперь ты готов к практике!";
}

function updateLectureNavigation() {
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const startGameButton = document.querySelector('.start-game-button');
    
    if (prevButton) prevButton.disabled = gameState.currentSlide === 0;
    
    if (gameState.currentSlide === gameState.totalSlides - 1) {
        if (nextButton) nextButton.style.display = 'none';
        if (startGameButton) startGameButton.style.display = 'block';
    } else {
        if (nextButton) nextButton.style.display = 'block';
        if (startGameButton) startGameButton.style.display = 'none';
    }
}

// Начало игры с сортировкой
function startGame() {
    showScreen('sortingScreen');
    gameState.currentScreen = 'sorting';
    gameState.trashSorted = 0;
    
    resetGamePositions();
    
    setTimeout(() => {
        initializeTouchDragAndDrop(); // Заменяем на новую функцию
        updateSortingProgress();
    }, 100);
    
    const helperText = document.getElementById('sortingHelperText');
    if (helperText) {
        helperText.innerHTML = '🎯 Нажми и перетащи предмет пальцем в контейнер!';
        helperText.style.color = '#fbbf24';
    }
}
// ===== ПОДДЕРЖКА СЕНСОРНОГО ПЕРЕТАСКИВАНИЯ ДЛЯ МОБИЛЬНЫХ =====
let touchDraggedElement = null;
let touchStartX = 0, touchStartY = 0;

function initializeTouchDragAndDrop() {
    const trashItems = document.querySelectorAll('.trash-item');
    const bins = document.querySelectorAll('.bin');
    
    trashItems.forEach(item => {
        // Для мыши
        item.setAttribute('draggable', 'true');
        
        // Для сенсорных экранов
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
        
        // Существующие обработчики для мыши
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.dataset.type);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            draggedElement = null;
        });
    });
    
    bins.forEach(bin => {
        bin.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });
        
        bin.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        bin.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        bin.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedElement && !draggedElement.classList.contains('sorted')) {
                handleDrop(draggedElement, this, e.clientX, e.clientY);
            }
        });
        
        // Сенсорный дроп
        bin.addEventListener('touchstart', function(e) {
            if (touchDraggedElement) {
                e.preventDefault();
                const rect = this.getBoundingClientRect();
                const touch = e.touches[0];
                handleDrop(touchDraggedElement, this, touch.clientX, touch.clientY);
                touchDraggedElement = null;
            }
        });
    });
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchDraggedElement = this;
    this.classList.add('dragging');
    
    // Создаем клон для визуального отклика
    const clone = this.cloneNode(true);
    clone.id = 'dragClone';
    clone.style.position = 'fixed';
    clone.style.left = touchStartX - 40 + 'px';
    clone.style.top = touchStartY - 40 + 'px';
    clone.style.width = '80px';
    clone.style.height = '80px';
    clone.style.opacity = '0.8';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.transform = 'scale(1.1)';
    document.body.appendChild(clone);
}

function handleTouchMove(e) {
    if (!touchDraggedElement) return;
    e.preventDefault();
    const touch = e.touches[0];
    const clone = document.getElementById('dragClone');
    if (clone) {
        clone.style.left = touch.clientX - 40 + 'px';
        clone.style.top = touch.clientY - 40 + 'px';
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    const clone = document.getElementById('dragClone');
    if (clone) clone.remove();
    touchDraggedElement.classList.remove('dragging');
    
    // Если элемент не был брошен на контейнер, возвращаем его на место
    setTimeout(() => {
        if (touchDraggedElement && !touchDraggedElement.classList.contains('sorted')) {
            touchDraggedElement.style.opacity = '1';
            touchDraggedElement.style.pointerEvents = 'auto';
        }
        touchDraggedElement = null;
    }, 100);
}

function handleDrop(draggedItem, binElement, clientX, clientY) {
    if (draggedItem.classList.contains('sorted')) return;
    
    const itemType = draggedItem.dataset.type;
    const binType = binElement.dataset.type;
    const helperText = document.getElementById('sortingHelperText');
    
    if (itemType === binType) {
        // Правильная сортировка
        draggedItem.style.opacity = '0.3';
        draggedItem.style.pointerEvents = 'none';
        draggedItem.classList.add('sorted');
        gameState.trashSorted++;
        
        const addedPoints = addScore(5);
        updateScoreDisplay();
        showScorePopup(clientX, clientY, `+${addedPoints}`);
        
        if (helperText) {
            helperText.innerHTML = '🎉 Отлично! Правильно отсортировал! +5 очков!';
            helperText.style.color = '#22c55e';
            setTimeout(() => {
                if (helperText) {
                    helperText.innerHTML = 'Продолжай! Перетаскивай предметы в нужные контейнеры!';
                    helperText.style.color = '';
                }
            }, 2500);
        }
        
        if (gameState.trashSorted >= gameState.totalTrash) {
            setTimeout(() => {
                const bonusPoints = addScore(15);
                updateScoreDisplay();
                showScorePopup(window.innerWidth / 2, window.innerHeight / 2, `+${bonusPoints} Бонус за сортировку!`);
                setTimeout(() => startQuiz(), 2000);
            }, 1500);
        }
    } else {
        // Неправильная сортировка
        draggedItem.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            draggedItem.style.animation = '';
        }, 500);
        
        if (helperText) {
            helperText.innerHTML = '😔 Неправильно! Этот предмет не подходит для этого контейнера. Попробуй ещё раз!';
            helperText.style.color = '#ef4444';
            setTimeout(() => {
                if (helperText && !helperText.innerHTML.includes('Отлично')) {
                    helperText.innerHTML = 'Подсказка: Вспомни цвета контейнеров!';
                    setTimeout(() => {
                        if (helperText && !helperText.innerHTML.includes('Отлично')) {
                            helperText.innerHTML = 'Перетаскивай предметы в правильные контейнеры!';
                            helperText.style.color = '';
                        }
                    }, 3000);
                }
            }, 2500);
        }
    }
    
    updateScoreDisplay();
    updateSortingProgress();
}

// Начало теста
function startQuiz() {
    showScreen('quizScreen');
    gameState.currentScreen = 'quiz';
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    gameState.isAnswerLocked = false; // Сбрасываем блокировку
    
    // Инициализация точек прогресса
    initializeProgressDots();
    showQuestion();
}

function initializeProgressDots() {
    const progressDots = document.getElementById('progressDots');
    if (!progressDots) return;
    
    progressDots.innerHTML = '';
    
    for (let i = 0; i < quizQuestions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('current');
        progressDots.appendChild(dot);
    }
}

function showQuestion() {
    const question = quizQuestions[gameState.currentQuestion];
    
    const quizTitle = document.getElementById('quizTitle');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const questionText = document.getElementById('questionText');
    const questionImage = document.getElementById('questionImage');
    const helperText = document.getElementById('helperText');
    
    if (quizTitle) quizTitle.textContent = `Вопрос ${gameState.currentQuestion + 1}`;
    if (currentQuestionSpan) currentQuestionSpan.textContent = gameState.currentQuestion + 1;
    if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizQuestions.length;
    if (questionText) questionText.textContent = question.question;
    if (questionImage) {
        questionImage.innerHTML = `<img class="item-icon" src="${question.image}" alt="Вопрос" style="width: 120px; height: 120px; object-fit: contain;">`;
    }
    if (helperText) {
        helperText.innerHTML = "🤔 Подумай хорошенько! Выбери правильный ответ!";
        helperText.style.color = '#000000'; // Черный цвет текста
    }
    
    const answersContainer = document.getElementById('quizAnswers');
    if (answersContainer) {
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerButton = document.createElement('button');
            answerButton.className = 'answer-option';
            answerButton.textContent = answer;
            answerButton.style.color = '#000000'; // Черный цвет текста
            answerButton.style.background = '#ffffff'; // Белый фон
            answerButton.onclick = () => selectAnswer(index);
            answersContainer.appendChild(answerButton);
        });
    }
    
    updateProgressDots();
    gameState.isAnswerLocked = false;
}

function selectAnswer(selectedIndex) {
    // Блокируем повторные ответы
    if (gameState.isAnswerLocked) return;
    gameState.isAnswerLocked = true;
    
    const question = quizQuestions[gameState.currentQuestion];
    const answerButtons = document.querySelectorAll('.answer-option');
    const helperText = document.getElementById('helperText');
    const isCorrect = (selectedIndex === question.correct);
    
    // Отключение всех кнопок
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Отметить выбранный ответ
    answerButtons[selectedIndex].classList.add('selected');
    
    if (isCorrect) {
        // Правильный ответ
        answerButtons[selectedIndex].classList.add('correct');
        gameState.correctAnswers++;
        
        const addedPoints = addScore(10);
        
        if (helperText) {
            helperText.innerHTML = question.helper;
            helperText.style.color = '#22c55e';
        }
        
        showScorePopup(window.innerWidth / 2, 200, `+${addedPoints}`);
        
        // Меняем цвет кружка на зеленый
        updateProgressDotColor(gameState.currentQuestion, true);
    } else {
        // Неправильный ответ
        answerButtons[selectedIndex].classList.add('incorrect');
        answerButtons[question.correct].classList.add('correct');
        
        if (helperText) {
            helperText.innerHTML = `❌ Неправильно! ${question.helper}`;
            helperText.style.color = '#ef4444';
        }
        
        // Меняем цвет кружка на красный
        updateProgressDotColor(gameState.currentQuestion, false);
    }
        
        updateScoreDisplay();
        
        setTimeout(() => {
            nextQuestion();
        }, 3000);
}

function nextQuestion() {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        // Бонус за все правильные ответы в викторине - 20 баллов
        if (gameState.correctAnswers === quizQuestions.length) {
            const bonusPoints = addScore(20);
            updateScoreDisplay();
            showScorePopup(window.innerWidth / 2, window.innerHeight / 2, `+${bonusPoints} Бонус за все правильные ответы!`);
            
            setTimeout(() => {
                showResults();
            }, 2000);
        } else {
            showResults();
        }
    }
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('current', 'completed', 'incorrect');
        
        if (index < gameState.currentQuestion) {
            dot.classList.add('completed');
        } else if (index === gameState.currentQuestion) {
            dot.classList.add('current');
        }
    });
}

function updateProgressDotColor(questionIndex, isCorrect) {
    const dots = document.querySelectorAll('.progress-dots .dot');
    if (dots[questionIndex]) {
        dots[questionIndex].classList.remove('completed', 'incorrect');
        if (isCorrect) {
            dots[questionIndex].classList.add('completed');
        } else {
            dots[questionIndex].classList.add('incorrect');
        }
    }
}

// Показ результатов
async function showResults() {
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    const scorePercentage = Math.round((gameState.correctAnswers / quizQuestions.length) * 100);
    const sortingPercentage = Math.round((gameState.trashSorted / gameState.totalTrash) * 100);
    
    const finalScoreElem = document.getElementById('finalScore');
    const correctAnswersElem = document.getElementById('correctAnswers');
    const trashSortedElem = document.getElementById('trashSorted');
    const medal = document.getElementById('finalMedal');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsDescription = document.getElementById('resultsDescription');
    
    if (finalScoreElem) finalScoreElem.textContent = gameState.score;
    if (correctAnswersElem) correctAnswersElem.textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    if (trashSortedElem) trashSortedElem.textContent = sortingPercentage + '%';
    
    if (medal) {
        if (gameState.score >= 90) medal.textContent = '🥇';
        else if (gameState.score >= 70) medal.textContent = '🥈';
        else if (gameState.score >= 50) medal.textContent = '🥉';
        else medal.textContent = '🏆';
    }
    
    if (resultsTitle) {
        if (gameState.score >= 90) resultsTitle.textContent = 'Превосходно!';
        else if (gameState.score >= 70) resultsTitle.textContent = 'Хорошо!';
        else if (gameState.score >= 50) resultsTitle.textContent = 'Неплохо!';
        else resultsTitle.textContent = 'Старайся лучше!';
    }
    
    if (resultsDescription) {
        if (gameState.score >= 90) resultsDescription.textContent = 'Ты настоящий эко-герой! Отличное знание сортировки мусора!';
        else if (gameState.score >= 70) resultsDescription.textContent = 'Ты хорошо усвоил урок! Продолжай изучать экологию!';
        else if (gameState.score >= 50) resultsDescription.textContent = 'Ты на правильном пути! Повтори урок и попробуй ещё раз!';
        else resultsDescription.textContent = 'Не сдавайся! Попробуй ещё раз и станешь настоящим эко-героем!';
    }
    
    await forceUpdateUserScore('krosh', gameState.score);
}

// Инициализация карусели фактов
function initializeFacts() {
    const factCarousel = document.getElementById('factCarousel');
    if (!factCarousel) return;
    
    const factNavigation = document.querySelector('.fact-navigation .fact-dots');
    if (factNavigation) {
        factNavigation.innerHTML = '';
        
        funFacts.forEach((fact, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.onclick = () => goToFact(index);
            factNavigation.appendChild(dot);
        });
    }
    
    // Создаем элементы фактов
    const factCarouselContainer = document.getElementById('factCarousel');
    factCarouselContainer.innerHTML = '';
    
    funFacts.forEach((fact, index) => {
        const factItem = document.createElement('div');
        factItem.className = 'fact-item';
        if (index === 0) factItem.classList.add('active');
        
        factItem.innerHTML = `
            <div class="fact-icon">
                <img src="${fact.image}" alt="Факт" style="width: 60px; height: 60px; object-fit: contain;">
            </div>
            <p>${fact.text}</p>
        `;
        
        factCarouselContainer.appendChild(factItem);
    });
    
    // Установка начального факта
    showFact(0);
}

function showFact(index) {
    const factItems = document.querySelectorAll('.fact-item');
    factItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    const dots = document.querySelectorAll('.fact-dots .dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextFact() {
    currentFactIndex = (currentFactIndex + 1) % funFacts.length;
    showFact(currentFactIndex);
}

function previousFact() {
    currentFactIndex = (currentFactIndex - 1 + funFacts.length) % funFacts.length;
    showFact(currentFactIndex);
}

function goToFact(index) {
    currentFactIndex = index;
    showFact(currentFactIndex);
}

// Управление игрой
function playAgain() {
    // Сброс состояния игры
    gameState = {
        currentScreen: 'intro',
        score: 0,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        trashSorted: 0,
        totalTrash: 6,
        currentSlide: 0,
        totalSlides: 5,
        isAnswerLocked: false
    };
    
    // Сброс интерфейса
    updateScoreDisplay();
    
    // Сброс всех игровых позиций и состояний
    resetGamePositions();
    
    // Сброс лекций до первого слайда
    gameState.currentSlide = 0;
    showSlide(0);
    updateLectureNavigation();
    
    // Сброс вспомогательного текста
    const sortingHelper = document.getElementById('sortingHelperText');
    if (sortingHelper) {
        sortingHelper.innerHTML = "Перетаскивай предметы в правильные контейнеры!";
        sortingHelper.style.color = '';
    }
    
    const quizHelper = document.getElementById('helperText');
    if (quizHelper) {
        quizHelper.innerHTML = "Подумай хорошенько! Помни урок о сортировке мусора!";
        quizHelper.style.color = '';
    }
    
    showScreen('introScreen');
}

function goToNextAdventure() {
    // Перенаправление на главную страницу или следующее приключение
    window.location.href = 'index.html#adventures';
}

// Управление экраном
function showScreen(screenId) {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => {
        screen.style.display = 'none';
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
    }
}

// Добавление CSS для анимации и индикатора выполнения
const style = document.createElement('style');
style.textContent = `
    @keyframes scorePopup {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) translateY(-50px);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { 
            transform: translate(-50%, -50%) translateX(0); 
        }
        10%, 30%, 50%, 70%, 90% { 
            transform: translate(-50%, -50%) translateX(-5px); 
        }
        20%, 40%, 60%, 80% { 
            transform: translate(-50%, -50%) translateX(5px); 
        }
    }
    
    .trash-item {
        cursor: grab;
        transition: all 0.3s ease;
        user-select: none;
    }
    
    .trash-item:active {
        cursor: grabbing;
    }
    
    .trash-item.dragging {
        opacity: 0.7;
        transform: scale(1.1) translate(-50%, -50%) !important;
        z-index: 1000;
        cursor: grabbing;
    }
    
    .trash-item.sorted {
        opacity: 0.3 !important;
        pointer-events: none !important;
    }
    
    .bin {
        transition: all 0.3s ease;
    }
    
    .bin.drag-over {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.7);
    }
    
    .bin:hover {
        transform: scale(1.02);
    }

    .answer-option {
        transition: all 0.3s ease;
    }
    
    .answer-option.selected {
        background: rgba(59, 130, 246, 0.3) !important;
    }
    
    .answer-option.correct {
        background: rgba(16, 185, 129, 0.3) !important;
        color: #065f46 !important;
    }
    
    .answer-option.incorrect {
        background: rgba(239, 68, 68, 0.3) !important;
        color: #7f1d1d !important;
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

document.head.appendChild(style);
