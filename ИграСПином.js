// Скрипт игры «Водное приключение»

// Состояние игры
let gameState = {
    currentScreen: 'intro',
    score: 0,
    level: 1,
    currentQuestion: 0,
    correctAnswers: 0,
    waterCleaned: 0,
    totalPollution: 6,
    currentSlide: 0
};

// Данные вопросов викторины
const quizQuestions = [
    {
        question: "Какое животное изображено на картинке?",
        image: "ФотоПин/Рыба-клоун.png",
        answers: ["Рыба-клоун", "Золотая рыбка", "Акула", "Дельфин"],
        correct: 0,
        helper: "Посмотри внимательно на яркие полоски! Эта рыбка очень дружелюбная!"
    },
    {
        question: "Что НЕ нужно выбрасывать в воду?",
        image: "ФотоПин/Мусор6.png",
        answers: ["Хлеб для рыб", "Пластиковые бутылки", "Водоросли", "Ракушки"],
        correct: 1,
        helper: "Пластик очень вреден для морских обитателей! Его нужно сдавать на переработку."
    },
    {
        question: "Какое морское животное самое большое?",
        image: "ФотоПин/Кит.png",
        answers: ["Акула", "Дельфин", "Синий кит", "Осьминог"],
        correct: 2,
        helper: "Это животное может весить как 30 слонов! И питается оно очень маленькими рыбками."
    },
    {
        question: "Сколько примерно процентов Земли покрыто водой?",
        image: "ФотоПин/Земля.png",
        answers: ["50%", "60%", "70%", "80%"],
        correct: 2,
        helper: "Наша планета очень 'водная'! Поэтому её часто называют 'голубой планетой'."
    },
    {
        question: "Что помогает очищать воду в природе?",
        image: "ФотоПин/Водоросли.png",
        answers: ["Камни", "Водоросли и растения", "Песок", "Рыбы"],
        correct: 1,
        helper: "Растения - настоящие фильтры природы! Они поглощают вредные вещества из воды."
    }
];

// Данные слайдов лекции
const lectureSlides = [
    {
        teacherText: "Знаешь ли ты, что вода - это основа всей жизни на нашей планете? Давай узнаем удивительные факты!"
    },
    {
        teacherText: "К сожалению, люди часто загрязняют водоёмы. Но мы можем это исправить! Посмотри, что вредит природе."
    },
    {
        teacherText: "В наших водоёмах живут удивительные создания! Каждое из них важно для природного баланса."
    },
    {
        teacherText: "Теперь ты знаешь, почему так важно защищать наши водоёмы! Готов применить знания на практике?"
    }
];

// Интересные факты на экране результатов
const funFacts = [
    {
        image: "ФотоПин/Земля.png",
        text: "Вода покрывает 71% поверхности Земли!"
    },
    {
        image: "ФотоПин/Кит.png",
        text: "Синий кит - самое большое животное на планете!"
    },
    {
        image: "ФотоПин/ПереработкаМини.png",
        text: "Одна пластиковая бутылка разлагается 450 лет!"
    },
    {
        image: "ФотоПин/Капля3.png",
        text: "Каждый день нужно пить 6-8 стаканов воды!"
    },
    {
        image: "ФотоПин/Рыба-клоун.png",
        text: "В океанах живёт более 250 000 видов рыб!"
    },
    {
        image: "ФотоПин/Водоросли.png",
        text: "Морские водоросли производят 70% кислорода на Земле!"
    }
];

let currentFactIndex = 0;

// Инициализация игры
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    updateScore();
    setupWaterCleaning();
    setupQuiz();
    setupFactCarousel();
    setupLecture();
}

function setupEventListeners() {
    // Очистка воды
    document.querySelectorAll('.pollution-item').forEach(item => {
        item.addEventListener('click', removePollution);
    });
}

function startLecture() {
    showScreen('lectureScreen');
    gameState.currentScreen = 'lecture';
    gameState.currentSlide = 0;
    updateLectureDisplay();
}

function startGame() {
    showScreen('cleaningScreen');
    gameState.currentScreen = 'cleaning';
}

// Функции лекции
function setupLecture() {
    updateLectureDisplay();
}

function updateLectureDisplay() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const startGameButton = document.querySelector('.start-game-button');
    const teacherText = document.getElementById('teacherText');
    
    // Обновление слайдов
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === gameState.currentSlide) {
            slide.classList.add('active');
        } else if (index < gameState.currentSlide) {
            slide.classList.add('prev');
        }
    });
    
    // Обновление индикаторов
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === gameState.currentSlide);
    });
    
    // Обновление кнопки навигации
    prevButton.disabled = gameState.currentSlide === 0;
    nextButton.style.display = gameState.currentSlide === slides.length - 1 ? 'none' : 'inline-block';
    startGameButton.style.display = gameState.currentSlide === slides.length - 1 ? 'inline-block' : 'none';
    
    // Обновление текста преподавателя
    if (lectureSlides[gameState.currentSlide]) {
        teacherText.textContent = lectureSlides[gameState.currentSlide].teacherText;
    }
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (gameState.currentSlide < slides.length - 1) {
        gameState.currentSlide++;
        updateLectureDisplay();
    }
}

function previousSlide() {
    if (gameState.currentSlide > 0) {
        gameState.currentSlide--;
        updateLectureDisplay();
    }
}

function goToSlide(slideIndex) {
    gameState.currentSlide = slideIndex;
    updateLectureDisplay();
}

function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'flex';
}

function updateScore() {
    document.getElementById('score').textContent = gameState.score;
    
}

// Игра «Очистка воды»
function setupWaterCleaning() {
    updateCleaningProgress();
}

function selectTool(event) {
    document.querySelectorAll('.tool').forEach(tool => {
        tool.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function removePollution(event) {
    const pollutionItem = event.currentTarget;
    const pollutionType = pollutionItem.dataset.type;
    
    // Добавление анимации удаления
    pollutionItem.classList.add('removing');
    
    // Удаление после анимации
    setTimeout(() => {
        pollutionItem.remove();
        gameState.waterCleaned += (100 / gameState.totalPollution);
        gameState.score += 5;
        
        updateScore();
        updateCleaningProgress();
        
        // Проверка, удалены ли все загрязнения
        const remainingPollution = document.querySelectorAll('.pollution-item').length;
        if (remainingPollution === 0) {
            setTimeout(() => {
                completeWaterCleaning();
            }, 1000);
        }
    }, 500);
    
    // Всплывающее окно для добавления очков
    showScorePopup(event.clientX, event.clientY, '+5');
}

function updateCleaningProgress() {
    const percentage = Math.min(gameState.waterCleaned, 100);
    document.getElementById('cleaningProgress').style.width = percentage + '%';
    document.getElementById('cleaningPercentage').textContent = Math.round(percentage) + '%';
    
    // Обновление внешнего вида воды
    if (percentage === 100) {
        document.querySelector('.water-surface').classList.add('clean');
    }
}

function completeWaterCleaning() {
    // Добавление бонусов за завершение очистки
    gameState.score += 20;
    updateScore();
    
    showScorePopup(window.innerWidth / 2, window.innerHeight / 2, '+20 Бонус!');
    
    setTimeout(() => {
        startQuiz();
    }, 2000);
}

// Игра-викторина
function setupQuiz() {
    createProgressDots();
}

function startQuiz() {
    showScreen('quizScreen');
    gameState.currentScreen = 'quiz';
    gameState.currentQuestion = 0;
    showQuestion();
}

function createProgressDots() {
    const progressDots = document.getElementById('progressDots');
    progressDots.innerHTML = '';
    
    for (let i = 0; i < quizQuestions.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i === 0) dot.classList.add('active');
        progressDots.appendChild(dot);
    }
}

function showQuestion() {
    const question = quizQuestions[gameState.currentQuestion];
    
    document.getElementById('currentQuestion').textContent = gameState.currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('helperText').textContent = question.helper;
    
    // Обновление изображение вопроса
    const questionImage = document.querySelector('#questionImage .creature-icon');
if (questionImage) {
    questionImage.src = question.image;
}
    
    // Создание вариантов ответов
    const answersContainer = document.getElementById('quizAnswers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer-option';
        answerDiv.textContent = answer;
        answerDiv.addEventListener('click', () => selectAnswer(index));
        answersContainer.appendChild(answerDiv);
    });
    
    updateProgressDots();
}

function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index < gameState.currentQuestion) {
            dot.classList.add('completed');
        } else if (index === gameState.currentQuestion) {
            dot.classList.add('active');
        }
    });
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[gameState.currentQuestion];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Отключение всех вариантов
    answerOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Показывание правильного/неправильного ответа
    answerOptions[selectedIndex].classList.add('selected');
    
    setTimeout(() => {
        answerOptions[question.correct].classList.add('correct');
        
        if (selectedIndex !== question.correct) {
            answerOptions[selectedIndex].classList.add('incorrect');
        } else {
            gameState.correctAnswers++;
            gameState.score += 10;
            updateScore();
            showScorePopup(window.innerWidth / 2, 200, '+10');
        }
        
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    }, 1000);
}

function nextQuestion() {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Экран результатов
function showResults() {
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    calculateFinalResults();
    displayResults();
    startFactCarousel();
}

function calculateFinalResults() {
    // Рассчитать итоговую оценку на основе результатов
    const cleaningBonus = gameState.waterCleaned === 100 ? 10 : 0;
    const perfectQuizBonus = gameState.correctAnswers === quizQuestions.length ? 15 : 0;
    
    gameState.score += cleaningBonus + perfectQuizBonus;
    updateScore();
}

function displayResults() {
    // Обновление финальной статистики
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('correctAnswers').textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    document.getElementById('waterCleaned').textContent = Math.round(gameState.waterCleaned) + '%';
    
    // Определение медали и титула на основе результатов
    let medal = '🏆';
    let title = 'Отличная работа!';
    let description = 'Ты помог очистить воду и узнал много нового о морских обитателях!';
    
    if (gameState.score >= 100) {
        medal = '🥇';
        title = 'Превосходный результат!';
        description = 'Ты настоящий защитник водного мира! Идеальное выполнение всех заданий!';
    } else if (gameState.score >= 75) {
        medal = '🥈';
        title = 'Отличная работа!';
        description = 'Очень хорошие результаты! Ты многому научился вместе с Пином!';
    } else if (gameState.score >= 50) {
        medal = '🥉';
        title = 'Хорошая попытка!';
        description = 'Неплохо! Попробуй ещё раз, чтобы улучшить свой результат!';
    }
    
    document.getElementById('finalMedal').textContent = medal;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsDescription').textContent = description;
}

// Карусель интересных фактов
function setupFactCarousel() {
    const factCarousel = document.getElementById('factCarousel');
    const factDots = document.querySelector('.fact-dots');
    
    // Очистка существующего контента
    factCarousel.innerHTML = '';
    factDots.innerHTML = '';
    
    // Создание элементов с фактами
    funFacts.forEach((fact, index) => {
        const factItem = document.createElement('div');
        factItem.className = 'fact-item';
        if (index === 0) factItem.classList.add('active');
        
        factItem.innerHTML = `
        <div class="fact-icon"><img src="${fact.image}" alt="Fact Image" style="width:50px; height:auto;"></div>
        <p>${fact.text}</p>
    `;
        
        factCarousel.appendChild(factItem);
        
        // Создание точки
        const dot = document.createElement('div');
        dot.className = 'fact-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showFact(index));
        factDots.appendChild(dot);
    });
}

function startFactCarousel() {
    // Автоматическая ротация фактов каждые 5 секунд
    setInterval(() => {
        nextFact();
    }, 5000);
}

function showFact(index) {
    currentFactIndex = index;
    
    document.querySelectorAll('.fact-item').forEach((item, i) => {
        item.classList.remove('active', 'prev');
        if (i === index) {
            item.classList.add('active');
        } else if (i < index) {
            item.classList.add('prev');
        }
    });
    
    document.querySelectorAll('.fact-dot').forEach((dot, i) => {
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

// Вспомогательные функции
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

// Игровые действия
function playAgain() {
    // Сброс состояния игры
    gameState = {
        currentScreen: 'intro',
        score: 0,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        waterCleaned: 0,
        totalPollution: 6,
        currentSlide: 0
    };
    
    // Сброс пользовательского интерфейса
    updateScore();
    showScreen('introScreen');
    
    // Сброс очистки воды
    resetWaterCleaning();
}

function resetWaterCleaning() {
    const waterSurface = document.querySelector('.water-surface');
    waterSurface.classList.remove('clean');
    
    // Повторное добавление элементов загрязнения
    const pollutionItems = [
        { type: 'plastic', src: 'ФотоПин/стакан.jpg', top: '20%', left: '15%' },
        { type: 'trash', src: 'ФотоПин/Мусор2.png', top: '40%', left: '70%' },
        { type: 'plastic', src: 'ФотоПин/Мусор4.png', top: '60%', left: '30%' },
        { type: 'oil', src: 'ФотоПин/Мусор5.png', top: '80%', left: '80%' },
        { type: 'trash', src: 'ФотоПин/Мусор1.png', top: '25%', left: '85%' },
        { type: 'plastic', src: 'ФотоПин/Мусор3.png', top: '75%', left: '10%' }
    ];
    
    // Удаление существующих элементов загрязнения
    document.querySelectorAll('.pollution-item').forEach(item => item.remove());
    
    // Добавление новых элементов загрязнения
    pollutionItems.forEach(item => {
        const pollutionDiv = document.createElement('div');
        pollutionDiv.className = 'pollution-item';
        pollutionDiv.dataset.type = item.type;
        pollutionDiv.style.top = item.top;
        pollutionDiv.style.left = item.left;
        // вставляем изображение
        pollutionDiv.innerHTML = `<img src="${item.src}" class="pollution-icon" />`;
        pollutionDiv.addEventListener('click', removePollution);
        waterSurface.appendChild(pollutionDiv);
    });
    
    // Сброс прогресса
    document.getElementById('cleaningProgress').style.width = '0%';
    document.getElementById('cleaningPercentage').textContent = '0%';
}

function goToNextAdventure() {
    // Это перенаправит к следующему приключению на основном сайте
    window.location.href = '../ГлавнаяОр/ГлавнаяОр.html#adventures';
}

function goBack() {
    // В зависимости от текущего экрана, возвращаемся назад
    if (gameState.currentScreen === 'lecture') {
      showScreen('introScreen');
      gameState.currentScreen = 'intro';
    } else if (gameState.currentScreen === 'cleaning') {
      showScreen('introScreen');
      gameState.currentScreen = 'intro';
    } else if (gameState.currentScreen === 'quiz') {
      showScreen('lectureScreen');
      gameState.currentScreen = 'lecture';
    } else if (gameState.currentScreen === 'results') {
      showScreen('quizScreen');
      gameState.currentScreen = 'quiz';
    } else {
      // По умолчанию, возвращаем на главную
      // или ничего не делаем
      showScreen('introScreen');
      gameState.currentScreen = 'intro';
    }
  }

// Добавить CSS для анимации всплывающего окна с очками
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
`;
document.head.appendChild(style);