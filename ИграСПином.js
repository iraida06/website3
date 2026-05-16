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
    currentSlide: 0,
    isAnswerLocked: false
};

// Данные вопросов викторины с подсказками
const quizQuestions = [
    {
        question: "Какое животное изображено на картинке?",
        image: "ФотоПин/Рыба-клоун.png",
        answers: ["Рыба-клоун", "Золотая рыбка", "Акула", "Дельфин"],
        correct: 0,
        helper: "✅ Правильно! Это рыба-клоун с яркими оранжевыми полосками!"
    },
    {
        question: "Что НЕ нужно выбрасывать в воду?",
        image: "ФотоПин/Мусор6.png",
        answers: ["Хлеб для рыб", "Пластиковые бутылки", "Водоросли", "Ракушки"],
        correct: 1,
        helper: "✅ Верно! Пластик очень вреден для морских обитателей! Его нужно сдавать на переработку."
    },
    {
        question: "Какое морское животное самое большое?",
        image: "ФотоПин/Кит.png",
        answers: ["Акула", "Дельфин", "Синий кит", "Осьминог"],
        correct: 2,
        helper: "✅ Правильно! Синий кит — самое большое животное на Земле!"
    },
    {
        question: "Сколько примерно процентов Земли покрыто водой?",
        image: "ФотоПин/Земля.png",
        answers: ["50%", "60%", "70%", "80%"],
        correct: 2,
        helper: "✅ Верно! Вода покрывает 71% поверхности нашей планеты!"
    },
    {
        question: "Что помогает очищать воду в природе?",
        image: "ФотоПин/Водоросли.png",
        answers: ["Камни", "Водоросли и растения", "Песок", "Рыбы"],
        correct: 1,
        helper: "✅ Отлично! Водоросли — настоящие фильтры природы!"
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
    showInstruction(); // ПОКАЗЫВАЕМ ИНСТРУКЦИЮ
});

// ========== ИНСТРУКЦИЯ ==========
function showInstruction() {
    const oldInstruction = document.getElementById('gameInstruction');
    if (oldInstruction) oldInstruction.remove();

    const overlay = document.createElement('div');
    overlay.id = 'instructionOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1999;
        backdrop-filter: blur(5px);
    `;

    const instructionHTML = `
        <div id="gameInstruction" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 30px; padding: 25px; 
            max-width: 400px; width: 90%; z-index: 2000; box-shadow: 0 25px 50px rgba(0,0,0,0.5); 
            border: 2px solid #0EA5E9; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🐧</div>
            <h2 style="color: #0EA5E9; margin-bottom: 15px;">Как играть?</h2>
            <div style="color: white; text-align: left; margin-bottom: 20px;">
                <p style="margin: 10px 0;">📖 <strong>Шаг 1:</strong> Посмотри обучающий урок о воде</p>
                <p style="margin: 10px 0;">🗑️ <strong>Шаг 2:</strong> Очисти воду от мусора (нажимай на мусор)</p>
                <p style="margin: 10px 0;">❓ <strong>Шаг 3:</strong> Ответь на вопросы викторины</p>
                <p style="margin: 10px 0;">⭐ <strong>Шаг 4:</strong> Получи награду эко-героя!</p>
                <hr style="margin: 15px 0; border-color: #0EA5E9;">
                <p style="margin: 10px 0; color: #0EA5E9;">💡 Совет: Нажимай на мусор, чтобы очистить воду!</p>
            </div>
            <button onclick="closeInstruction()" style="background: #0EA5E9; border: none; padding: 12px 30px; 
                border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; color: #1e293b;
                transition: transform 0.2s;">
                Начать приключение! ✨
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.insertAdjacentHTML('beforeend', instructionHTML);
}

function closeInstruction() {
    const instruction = document.getElementById('gameInstruction');
    const overlay = document.getElementById('instructionOverlay');
    if (instruction) instruction.remove();
    if (overlay) overlay.remove();
}

function initializeGame() {
    updateScore();
    setupWaterCleaning();
    setupQuiz();
    setupFactCarousel();
    setupLecture();
}

function setupEventListeners() {
    document.querySelectorAll('.pollution-item').forEach(item => {
        item.removeEventListener('click', removePollution);
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
    resetWaterCleaning(); // Сброс состояния очистки
    showScreen('cleaningScreen');
    gameState.currentScreen = 'cleaning';
    
    // Обновляем текст учителя
    const teacherSpeech = document.querySelector('.teacher-speech p');
    if (teacherSpeech) {
        teacherSpeech.innerHTML = '🐧 Нажимай на мусор, чтобы очистить воду!';
        teacherSpeech.style.color = '';
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.style.display = 'none';
    });
    const screenElement = document.getElementById(screenId);
    if (screenElement) {
        screenElement.style.display = 'flex';
    }
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = gameState.score;
    }
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
    
    if (slides.length > 0) {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === gameState.currentSlide) {
                slide.classList.add('active');
            }
        });
    }
    
    if (indicators.length > 0) {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === gameState.currentSlide);
        });
    }
    
    if (prevButton) prevButton.disabled = gameState.currentSlide === 0;
    if (nextButton) nextButton.style.display = gameState.currentSlide === slides.length - 1 ? 'none' : 'inline-block';
    if (startGameButton) startGameButton.style.display = gameState.currentSlide === slides.length - 1 ? 'inline-block' : 'none';
    
    if (teacherText && lectureSlides[gameState.currentSlide]) {
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

// Игра «Очистка воды»
function setupWaterCleaning() {
    updateCleaningProgress();
}

function removePollution(event) {
    const pollutionItem = event.currentTarget;
    const teacherSpeech = document.querySelector('.teacher-speech p');
    
    // Анимация удаления
    pollutionItem.classList.add('removing');
    
    setTimeout(() => {
        pollutionItem.remove();
        gameState.waterCleaned += (100 / gameState.totalPollution);
        gameState.score += 5;
        
        updateScore();
        updateCleaningProgress();
        
        // ПОКАЗЫВАЕМ КОММЕНТАРИЙ ПОСЛЕ ДЕЙСТВИЯ
        if (teacherSpeech) {
            teacherSpeech.innerHTML = '🎉 Отлично! Мусор убран! +5 очков!';
            teacherSpeech.style.color = '#22c55e';
            setTimeout(() => {
                if (teacherSpeech.innerHTML.includes('Отлично')) {
                    teacherSpeech.innerHTML = '🐧 Продолжай очищать воду! Нажимай на мусор!';
                    teacherSpeech.style.color = '';
                }
            }, 2500);
        }
        
        showScorePopup(event.clientX, event.clientY, '+5');
        
        const remainingPollution = document.querySelectorAll('.pollution-item').length;
        if (remainingPollution === 0) {
            setTimeout(() => {
                completeWaterCleaning();
            }, 1000);
        }
    }, 500);
}

function updateCleaningProgress() {
    const percentage = Math.min(gameState.waterCleaned, 100);
    const progressBar = document.getElementById('cleaningProgress');
    const percentageText = document.getElementById('cleaningPercentage');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (percentageText) percentageText.textContent = Math.round(percentage) + '%';
    
    if (percentage === 100) {
        const waterSurface = document.querySelector('.water-surface');
        if (waterSurface) waterSurface.classList.add('clean');
    }
}

function completeWaterCleaning() {
    gameState.score += 20;
    updateScore();
    
    const teacherSpeech = document.querySelector('.teacher-speech p');
    if (teacherSpeech) {
        teacherSpeech.innerHTML = '🎉 Ура! Ты очистил всю воду! +20 бонусных очков!';
        teacherSpeech.style.color = '#22c55e';
    }
    
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
    gameState.correctAnswers = 0;
    gameState.isAnswerLocked = false;
    showQuestion();
}

function createProgressDots() {
    const progressDots = document.getElementById('progressDots');
    if (!progressDots) return;
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
    
    const currentQuestionEl = document.getElementById('currentQuestion');
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const questionTextEl = document.getElementById('questionText');
    const helperText = document.getElementById('helperText');
    const questionImage = document.querySelector('#questionImage .creature-icon');
    const answersContainer = document.getElementById('quizAnswers');
    
    if (currentQuestionEl) currentQuestionEl.textContent = gameState.currentQuestion + 1;
    if (totalQuestionsEl) totalQuestionsEl.textContent = quizQuestions.length;
    if (questionTextEl) questionTextEl.textContent = question.question;
    
    // Сбрасываем текст помощника
    if (helperText) {
        helperText.innerHTML = "🤔 Подумай хорошенько! Выбери правильный ответ!";
        helperText.style.color = '';
    }
    
    if (questionImage && question.image) {
        questionImage.src = question.image;
    }
    
    if (answersContainer) {
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.textContent = answer;
            answerDiv.addEventListener('click', () => selectAnswer(index));
            answersContainer.appendChild(answerDiv);
        });
    }
    
    updateProgressDots();
    gameState.isAnswerLocked = false;
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
    if (gameState.isAnswerLocked) return;
    gameState.isAnswerLocked = true;
    
    const question = quizQuestions[gameState.currentQuestion];
    const answerOptions = document.querySelectorAll('.answer-option');
    const helperText = document.getElementById('helperText');
    
    answerOptions.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    answerOptions[selectedIndex].classList.add('selected');
    
    setTimeout(() => {
        if (answerOptions[question.correct]) {
            answerOptions[question.correct].classList.add('correct');
        }
        
        if (selectedIndex !== question.correct) {
            if (answerOptions[selectedIndex]) {
                answerOptions[selectedIndex].classList.add('incorrect');
            }
            if (helperText) {
                helperText.innerHTML = `❌ Неправильно! ${question.helper}`;
                helperText.style.color = '#ef4444';
            }
        } else {
            gameState.correctAnswers++;
            gameState.score += 10;
            updateScore();
            showScorePopup(window.innerWidth / 2, 200, '+10');
            if (helperText) {
                helperText.innerHTML = question.helper;
                helperText.style.color = '#22c55e';
            }
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
async function showResults() {
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    calculateFinalResults();
    displayResults();
    startFactCarousel();
    
    try {
        await forceUpdateUserScore('pin', gameState.score);
        console.log('✅ Результат сохранен! Очки:', gameState.score);
    } catch (error) {
        console.error('Ошибка при сохранении результата:', error);
    }
}

function calculateFinalResults() {
    const cleaningBonus = gameState.waterCleaned === 100 ? 12 : 0;
    gameState.score += cleaningBonus;
    updateScore();
}

function displayResults() {
    const finalScoreEl = document.getElementById('finalScore');
    const correctAnswersEl = document.getElementById('correctAnswers');
    const waterCleanedEl = document.getElementById('waterCleaned');
    const finalMedalEl = document.getElementById('finalMedal');
    const resultsTitleEl = document.getElementById('resultsTitle');
    const resultsDescriptionEl = document.getElementById('resultsDescription');
    
    if (finalScoreEl) finalScoreEl.textContent = gameState.score;
    if (correctAnswersEl) correctAnswersEl.textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    if (waterCleanedEl) waterCleanedEl.textContent = Math.round(gameState.waterCleaned) + '%';
    
    let medal = '🏆';
    let title = 'Отличная работа!';
    let description = 'Ты помог очистить воду и узнал много нового о морских обитателях!';
    
    if (gameState.score >= 80) {
        medal = '🥇';
        title = 'Настоящий защитник воды!';
        description = 'Потрясающе! Ты очистил всю воду и показал отличные знания!';
    } else if (gameState.score >= 50) {
        medal = '🥈';
        title = 'Отличный эко-герой!';
        description = 'Замечательно! Водные обитатели очень благодарны тебе!';
    } else if (gameState.score >= 30) {
        medal = '🥉';
        title = 'Хороший друг природы!';
        description = 'Хорошо! Ты на правильном пути к защите водного мира!';
    }
    
    if (finalMedalEl) finalMedalEl.textContent = medal;
    if (resultsTitleEl) resultsTitleEl.textContent = title;
    if (resultsDescriptionEl) resultsDescriptionEl.textContent = description;
}

// Карусель интересных фактов
function setupFactCarousel() {
    const factCarousel = document.getElementById('factCarousel');
    const factDots = document.querySelector('.fact-dots');

    if (!factCarousel || !factDots) return;
    
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
    // Запускаем автоматическую смену фактов
    const factInterval = setInterval(() => {
        // Проверяем, активен ли экран результатов
        if (gameState.currentScreen === 'results') {
            nextFact();
        } else {
            clearInterval(factInterval);
        }
    }, 5000);
}


function showFact(index) {
    currentFactIndex = index;
    
    const factItems = document.querySelectorAll('.fact-item');
    const factDots = document.querySelectorAll('.fact-dot');
    
    factItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    factDots.forEach((dot, i) => {
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
    
    setTimeout(() => popup.remove(), 2000);
}

// Игровые действия
function playAgain() {
    gameState = {
        currentScreen: 'intro',
        score: 0,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        waterCleaned: 0,
        totalPollution: 6,
        currentSlide: 0,
        isAnswerLocked: false
    };
    
    // Сброс пользовательского интерфейса
    updateScore();
    showScreen('introScreen');
    
    // Сброс очистки воды
    resetWaterCleaning();
}

function resetWaterCleaning() {
    const waterSurface = document.querySelector('.water-surface');
    if (!waterSurface) return;
    
    waterSurface.classList.remove('clean');
    
    // Удаляем существующий мусор
    document.querySelectorAll('.pollution-item').forEach(item => item.remove());
    
    const pollutionItems = [
        { type: 'plastic', src: 'ФотоПин/стакан.jpg', top: '20%', left: '15%' },
        { type: 'trash', src: 'ФотоПин/Мусор2.png', top: '40%', left: '70%' },
        { type: 'plastic', src: 'ФотоПин/Мусор4.png', top: '60%', left: '30%' },
        { type: 'oil', src: 'ФотоПин/Мусор5.png', top: '80%', left: '80%' },
        { type: 'trash', src: 'ФотоПин/Мусор1.png', top: '25%', left: '85%' },
        { type: 'plastic', src: 'ФотоПин/Мусор3.png', top: '75%', left: '10%' }
    ];
    
    pollutionItems.forEach(item => {
        const pollutionDiv = document.createElement('div');
        pollutionDiv.className = 'pollution-item';
        pollutionDiv.dataset.type = item.type;
        pollutionDiv.style.position = 'absolute';
        pollutionDiv.style.top = item.top;
        pollutionDiv.style.left = item.left;
        pollutionDiv.style.cursor = 'pointer';
        pollutionDiv.innerHTML = `<img src="${item.src}" class="pollution-icon" style="width: 50px; height: auto; pointer-events: none;" />`;
        pollutionDiv.addEventListener('click', removePollution);
        waterSurface.appendChild(pollutionDiv);
    });
    
    const progressBar = document.getElementById('cleaningProgress');
    const percentageText = document.getElementById('cleaningPercentage');
    if (progressBar) progressBar.style.width = '0%';
    if (percentageText) percentageText.textContent = '0%';
    
    gameState.waterCleaned = 0;
}

function goToNextAdventure() {
    // Это перенаправит к следующему приключению на основном сайте
    window.location.href = 'index.html#adventures';
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

// Добавляем CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes scorePopup {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1) translateY(-50px); opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .removing {
        animation: fadeOut 0.5s ease-out forwards;
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    .answer-option {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .answer-option:hover {
        transform: translateX(10px);
        background: #0EA5E9 !important;
    }
    
    .answer-option.correct {
        background: linear-gradient(135deg, #22c55e, #16a34a) !important;
        color: white;
    }
    
    .answer-option.incorrect {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        color: white;
    }
    
    .pollution-item {
        position: absolute;
        cursor: pointer;
        transition: transform 0.2s;
        z-index: 10;
    }
    
    .pollution-item:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// Функция для полного завершения игры (если нужна)
async function completeGame() {
    try {
        // Здесь можно добавить логику отправки результата на сервер
        alert('🎉 Поздравляем! Вы завершили игру эко-героя!');
    } catch (error) {
        console.error('Ошибка при завершении игры:', error);
    }
}
