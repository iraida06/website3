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
    totalSlides: 5
};

// Данные вопросов викторины
const quizQuestions = [
    {
        question: "В какой контейнер нужно выбросить стаканчик?",
        image: "ФотоКрош/стакан.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 1,
        helper: "Пластиковые бутылки нужно выбрасывать в жёлтый контейнер для пластика и металла!"
    },
    {
        question: "Куда правильно выбросить банановую кожуру?",
        image: "ФотоКрош/БанановаяКожура.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 3,
        helper: "Банановая кожура - это органические отходы, они идут в коричневый контейнер!"
    },
    {
        question: "В какой контейнер нужно выбросить старую газету?",
        image: "ФотоКрош/Газета.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 0,
        helper: "Газеты и другая бумага идут в синий контейнер для бумажных отходов!"
    },
    {
        question: "Куда правильно выбросит банку?",
        image: "ФотоКрош/Банка.png",
        answers: ["Синий (бумага)", "Жёлтый (пластик)", "Зелёный (стекло)", "Коричневый (органика)"],
        correct: 2,
        helper: "Стеклянная банка должна попасть в зелёный контейнер для стекла!"
    },
    {
        question: "Что НЕ относится к органическим отходам?",
        image: "ФотоКрош/Мусор6.png",
        answers: ["Яблочная кожура", "Пластиковая упаковка", "Кофейная гуща", "Листья"],
        correct: 1,
        helper: "Пластиковая упаковка не органический отход! Её нужно сдавать на переработку."
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
    resetGamePositions(); // Возвращение элементов на свои места
});

// Обновление отображения счёта
function updateScoreDisplay() {
    document.getElementById('score').textContent = gameState.score;
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
    const trashItems = document.querySelectorAll('.trash-item');
    const trashContainer = document.querySelector('.trash-items');
    
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
        item.style.zIndex = '';
        item.classList.remove('dragging', 'sorted', 'selected');
        item.style.animation = '';
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
    
    console.log('Initializing drag and drop:', trashItems.length, 'items,', bins.length, 'bins');
    
    // Настройка элементов корзины
    trashItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', function(e) {
            console.log('Drag start:', this.dataset.type);
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.dataset.type);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', function() {
            console.log('Drag end');
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
            
            console.log('Drop on bin:', this.dataset.type);
            
            if (draggedElement && !draggedElement.classList.contains('sorted')) {
                const itemType = draggedElement.dataset.type;
                const binType = this.dataset.type;
                
                console.log('Item type:', itemType, 'Bin type:', binType);
                
                if (itemType === binType) {
                    // Правильная сортировка - 5 баллов за каждый предмет
                    draggedElement.style.opacity = '0.3';
                    draggedElement.style.pointerEvents = 'none';
                    draggedElement.classList.add('sorted');
                    gameState.trashSorted++;
                    
                    const addedPoints = addScore(5);
                    console.log('Correct! Trash sorted:', gameState.trashSorted, 'Total:', gameState.totalTrash);
                    
                    // Показывайте положительные отзывы с баллами
                    showScorePopup(e.clientX, e.clientY, `+${addedPoints}`);
                    
                    // Проверка сортировки всех предметов
                    if (gameState.trashSorted >= gameState.totalTrash) {
                        console.log('All trash sorted! Starting quiz...');
                        setTimeout(() => {
                            // Бонус за полную сортировку - 15 баллов
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
                    // Сохраняем текущую позицию
                    const currentTransform = draggedElement.style.transform;
                    
                    // Анимация неправильного выбора с правильным учетом позиции
                    draggedElement.style.animation = 'shake 0.5s ease-in-out';
                    
                    setTimeout(() => {
                        draggedElement.style.animation = '';
                        // Восстанавливаем позицию после анимации
                        draggedElement.style.transform = currentTransform;
                    }, 500);
                    
                    // Показываем сообщение об ошибке
                    const helperText = document.getElementById('sortingHelperText');
                    if (helperText) {
                        helperText.textContent = 'Попробуй ещё раз! Этот предмет не подходит для этого контейнера.';
                        helperText.style.color = '#ef4444';
                        
                        setTimeout(() => {
                            helperText.textContent = "Отлично! Перетаскивай предметы в правильные контейнеры!";
                            helperText.style.color = '';
                        }, 3000);
                    }
                }
                
                updateScoreDisplay();
                updateSortingProgress();
            }
        });
    });
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
    
    document.getElementById('teacherText').textContent = teacherTexts[slideIndex] || "Теперь ты готов к практике!";
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
    
    // Сброс состояние игры для сортировки
    gameState.trashSorted = 0;
    
    // Сброс всех позиций и состояний
    resetGamePositions();
    
    // Инициализация перетаскивания
    setTimeout(() => {
        initializeDragAndDrop();
        updateSortingProgress();
    }, 100);
    
    // Инициализация перетаскивания
    const helperText = document.getElementById('sortingHelperText');
    if (helperText) {
        helperText.textContent = "Отлично! Перетаскивай предметы в правильные контейнеры!";
        helperText.style.color = ''; // Убираем цвет
    }
}

function updateSortingProgress() {
    console.log('Updating progress:', gameState.trashSorted, '/', gameState.totalTrash);
    
    const percentage = Math.round((gameState.trashSorted / gameState.totalTrash) * 100);
    console.log('Percentage:', percentage + '%');
    
    const progressFill = document.getElementById('sortingProgress');
    const percentageText = document.getElementById('sortingPercentage');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        console.log('Progress bar width set to:', percentage + '%');
    } else {
        console.error('Progress fill element not found!');
        // Создаем элемент если не найден
        createProgressElements();
    }
    
    if (percentageText) {
        percentageText.textContent = percentage + '%';
        console.log('Percentage text set to:', percentage + '%');
    } else {
        console.error('Percentage text element not found!');
    }
}

// Функция для создания элементов прогресса если они не найдены
function createProgressElements() {
    const progressContainer = document.querySelector('.sorting-progress');
    if (!progressContainer) return;
    
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" id="sortingProgress"></div>
        </div>
        <p>Отсортировано: <span id="sortingPercentage">0%</span></p>
    `;
}

// Начало теста
function startQuiz() {
    showScreen('quizScreen');
    gameState.currentScreen = 'quiz';
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    
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
    
    document.getElementById('quizTitle').textContent = `Вопрос ${gameState.currentQuestion + 1}`;
    document.getElementById('currentQuestion').textContent = gameState.currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = question.question;
    
    // Исправлено: используем изображения вместо эмодзи
    const questionImage = document.getElementById('questionImage');
    questionImage.innerHTML = `<img class="item-icon" src="${question.image}" alt="Вопрос" style="width: 120px; height: 120px; object-fit: contain;">`;
    
    document.getElementById('helperText').textContent = "Подумай хорошенько! Помни урок о сортировке мусора!";
    
    // Создание вариантов ответов
    const answersContainer = document.getElementById('quizAnswers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerButton = document.createElement('button');
        answerButton.className = 'answer-option';
        answerButton.textContent = answer;
        answerButton.onclick = () => selectAnswer(index);
        answersContainer.appendChild(answerButton);
    });
    
    updateProgressDots();
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[gameState.currentQuestion];
    const answerButtons = document.querySelectorAll('.answer-option');
    
    // Отключение всех кнопок
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    
    // Отметить выбранный ответ
    answerButtons[selectedIndex].classList.add('selected');
    
    setTimeout(() => {
        if (selectedIndex === question.correct) {
            // Правильный ответ - 10 баллов за правильный ответ
            answerButtons[selectedIndex].classList.add('correct');
            gameState.correctAnswers++;
            
            const addedPoints = addScore(10);
            document.getElementById('helperText').textContent = "Правильно! " + question.helper;
            
            // Показ всплывающее окно с очками для правильного ответа
            showScorePopup(window.innerWidth / 2, 200, `+${addedPoints}`);
        } else {
            // Неверный ответ
            answerButtons[selectedIndex].classList.add('incorrect');
            answerButtons[question.correct].classList.add('correct');
            document.getElementById('helperText').textContent = question.helper;
        }
        
        updateScoreDisplay();
        
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    }, 500);
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
        dot.classList.remove('current', 'completed');
        if (index < gameState.currentQuestion) {
            dot.classList.add('completed');
        } else if (index === gameState.currentQuestion) {
            dot.classList.add('current');
        }
    });
}

// Показ результатов
function showResults() {
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    // Расчёт итоговой статистики
    const scorePercentage = Math.round((gameState.correctAnswers / quizQuestions.length) * 100);
    const sortingPercentage = Math.round((gameState.trashSorted / gameState.totalTrash) * 100);
    
    // Обновление отображения результатов
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('correctAnswers').textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    document.getElementById('trashSorted').textContent = sortingPercentage + '%';
    
    // Выбор медали на основе результатов
    const medal = document.getElementById('finalMedal');
    if (gameState.score >= 90) {
        medal.textContent = '🥇';
        document.getElementById('resultsTitle').textContent = 'Превосходно!';
        document.getElementById('resultsDescription').textContent = 'Ты настоящий эко-герой! Отличное знание сортировки мусора!';
    } else if (gameState.score >= 70) {
        medal.textContent = '🥈';
        document.getElementById('resultsTitle').textContent = 'Хорошо!';
        document.getElementById('resultsDescription').textContent = 'Ты хорошо усвоил урок! Продолжай изучать экологию!';
    } else if (gameState.score >= 50) {
        medal.textContent = '🥉';
        document.getElementById('resultsTitle').textContent = 'Неплохо!';
        document.getElementById('resultsDescription').textContent = 'Ты на правильном пути! Повтори урок и попробуй ещё раз!';
    } else {
        medal.textContent = '🏆';
        document.getElementById('resultsTitle').textContent = 'Старайся лучше!';
        document.getElementById('resultsDescription').textContent = 'Не сдавайся! Попробуй ещё раз и станешь настоящим эко-героем!';
    }
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
        totalSlides: 5
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
    const helperText = document.getElementById('sortingHelperText');
    if (helperText) {
        helperText.textContent = "Отлично! Перетаскивай предметы в правильные контейнеры!";
        helperText.style.color = ''; // Убираем цвет
    }
    
    // Сброс текста подсказки викторины
    const quizHelperText = document.getElementById('helperText');
    if (quizHelperText) {
        quizHelperText.textContent = "Подумай хорошенько! Помни урок о сортировке мусора!";
    }
    
    // Вернуться к вступлению
    showScreen('introScreen');
}

function goToNextAdventure() {
    // Перенаправление на главную страницу или следующее приключение
    window.location.href = '../ГлавнаяОр/ГлавнаяОр.html#adventures';
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
`;
document.head.appendChild(style);