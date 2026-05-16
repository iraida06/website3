// Forest Adventure Game Script

// Game state
let gameState = {
    currentScreen: 'intro',
    score: 0,
    level: 1,
    currentQuestion: 0,
    correctAnswers: 0,
    animalsHelped: 0,
    totalAnimals: 6,
    currentSlide: 0,
    isAnswerLocked: false
};

// Quiz questions data with helpers
const quizQuestions = [
    {
        question: "Какое животное делает запасы орехов на зиму?",
        image: "ФотоЛосяш/Орехи.png",
        answers: ["Белка", "Медведь", "Лиса", "Волк"],
        correct: 0,
        helper: "✅ Правильно! Белки запасают орехи и грибы на зиму!"
    },
    {
        question: "Что едят медведи?",
        image: "ФотоЛосяш/Медведь.png",
        answers: ["Только мясо", "Только растения", "Всё подряд", "Только рыбу"],
        correct: 2,
        helper: "✅ Верно! Медведи всеядные! Они едят ягоды, рыбу, мёд и многое другое."
    },
    {
        question: "Кто строит гнёзда на деревьях?",
        image: "ФотоЛосяш/Гнездо.png",
        answers: ["Медведи", "Птицы", "Еноты", "Лисы"],
        correct: 1,
        helper: "✅ Отлично! Птицы вьют гнёзда на ветках деревьев!"
    },
    {
        question: "Когда совы наиболее активны?",
        image: "ФотоЛосяш/Сова.png",
        answers: ["Утром", "Днём", "Вечером", "Ночью"],
        correct: 3,
        helper: "✅ Правильно! Совы - ночные хищники с отличным зрением в темноте!"
    },
    {
        question: "Что НЕЛЬЗЯ делать в лесу?",
        image: "ФотоЛосяш/Елка.png",
        answers: ["Собирать грибы", "Наблюдать за птицами", "Оставлять мусор", "Слушать звуки природы"],
        correct: 2,
        helper: "✅ Верно! Мусор вредит животным и загрязняет природу!"
    }
];

// Fun facts for results screen
const funFacts = [
    {
        image: "ФотоЛосяш/Елка.png",
        text: "Леса производят 28% кислорода на Земле!"
    },
    {
        image: "ФотоЛосяш/Птица.png",
        text: "В лесах живёт 80% всех наземных животных!"
    },
    {
        image: "ФотоЛосяш/Дерево.png",
        text: "Одно большое дерево может жить 500+ лет!"
    },
    {
        image: "ФотоЛосяш/Белка.png",
        text: "Белки забывают, где спрятали 74% своих запасов!"
    },
    {
        image: "ФотоЛосяш/Сова.png", 
        text: "Совы могут поворачивать голову на 270 градусов!"
    },
    {
        image: "ФотоЛосяш/Медведь.png",
        text: "Медведи могут бегать со скоростью до 50 км/ч!"
    }
];

let currentFactIndex = 0;
let factInterval = null;
let gameCompleted = false;

// ========== ИНСТРУКЦИЯ (СТРОГО ПО ЦЕНТРУ) ==========
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
            border: 2px solid #f59e0b; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🦌</div>
            <h2 style="color: #f59e0b; margin-bottom: 15px;">Как играть?</h2>
            <div style="color: white; text-align: left; margin-bottom: 20px;">
                <p style="margin: 10px 0;">📖 <strong>Шаг 1:</strong> Посмотри обучающий урок о лесе</p>
                <p style="margin: 10px 0;">🦊 <strong>Шаг 2:</strong> Помоги лесным животным (выбери инструмент, потом животное)</p>
                <p style="margin: 10px 0;">❓ <strong>Шаг 3:</strong> Ответь на вопросы викторины</p>
                <p style="margin: 10px 0;">⭐ <strong>Шаг 4:</strong> Получи награду эко-героя!</p>
                <hr style="margin: 15px 0; border-color: #f59e0b;">
                <p style="margin: 10px 0; color: #f59e0b;">💡 Совет: Сначала выбери инструмент, потом нажми на картинку животного!</p>
            </div>
            <button onclick="closeInstruction()" style="background: #f59e0b; border: none; padding: 12px 30px; 
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

// ========== ОСНОВНЫЕ ФУНКЦИИ ==========
function initializeGame() {
    console.log('Инициализация игры...');
    gameCompleted = false;
    updateScore();
    setupEventListeners();
    updateLectureDisplay();
    updateHelpingProgress();
    setupQuiz();
    setupFactCarousel();
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = gameState.score;
    }
}
function setupEventListeners() {
    document.querySelectorAll('.animal-need').forEach(animal => {
        animal.removeEventListener('click', helpAnimal);
        animal.addEventListener('click', helpAnimal);
    });
    
    document.querySelectorAll('.tool').forEach(tool => {
        tool.removeEventListener('click', selectTool);
        tool.addEventListener('click', selectTool);
    });
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

function startLecture() {
    showScreen('lectureScreen');
    gameState.currentScreen = 'lecture';
    gameState.currentSlide = 0;
    updateLectureDisplay();
}

function startGame() {
    showScreen('helpingScreen');
    gameState.currentScreen = 'helping';
    document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
    const firstTool = document.querySelector('.tool');
    if (firstTool) firstTool.classList.add('active');
}

// ========== ФУНКЦИИ ЛЕКЦИИ ==========
function updateLectureDisplay() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const startGameButton = document.querySelector('.start-game-button');
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === gameState.currentSlide) {
            slide.classList.add('active');
        }
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === gameState.currentSlide);
    });
    
    if (prevButton) prevButton.disabled = gameState.currentSlide === 0;
    if (nextButton) {
        nextButton.style.display = gameState.currentSlide === slides.length - 1 ? 'none' : 'inline-block';
    }
    if (startGameButton) {
        startGameButton.style.display = gameState.currentSlide === slides.length - 1 ? 'inline-block' : 'none';
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

// ========== ИГРА "ПОМОЩЬ ЖИВОТНЫМ" ==========
function selectTool(event) {
    document.querySelectorAll('.tool').forEach(tool => {
        tool.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    const teacherSpeech = document.querySelector('.losyash-teacher .teacher-speech p');
    if (teacherSpeech) {
        teacherSpeech.innerHTML = '🔧 Инструмент выбран! Теперь нажми на животное!';
        setTimeout(() => {
            if (teacherSpeech.innerHTML === '🔧 Инструмент выбран! Теперь нажми на животное!') {
                teacherSpeech.innerHTML = '🦌 Выбери инструмент, затем нажми на животное!';
            }
        }, 2000);
    }
}

function helpAnimal(event) {
    const animalElement = event.currentTarget;
    const animalNeed = animalElement.dataset.need;
    const activeTool = document.querySelector('.tool.active');
    const teacherSpeech = document.querySelector('.losyash-teacher .teacher-speech p');
    
    if (!activeTool) {
        if (teacherSpeech) {
            teacherSpeech.innerHTML = '⚠️ Сначала выбери инструмент! Нажми на один из инструментов внизу!';
        }
        return;
    }
    
    const toolType = activeTool.dataset.tool;
    
    if (animalElement.classList.contains('helped')) {
        if (teacherSpeech) {
            teacherSpeech.innerHTML = '✨ Этому животному уже помогли! Найди другое!';
        }
        return;
    }
    
    if (animalNeed === toolType) {
        animalElement.classList.add('helped');
        gameState.animalsHelped++;
        gameState.score += 5;
        
        updateScore();
        updateHelpingProgress();
        
        if (teacherSpeech) {
            teacherSpeech.innerHTML = '🎉 Отлично! Ты помог животному! +5 очков!';
        }
        
        showScorePopup(event.clientX, event.clientY, '+5');
        
        setTimeout(() => {
            animalElement.style.opacity = '0';
            animalElement.style.transform = 'scale(0)';
            animalElement.style.transition = 'all 0.3s';
            setTimeout(() => {
                animalElement.remove();
                checkAllAnimalsHelped();
            }, 300);
        }, 300);
    } else {
        if (teacherSpeech) {
            teacherSpeech.innerHTML = '😔 Неправильный инструмент! Посмотри, что просит животное!';
        }
        showFeedbackPopup(event.clientX, event.clientY, 'Не тот инструмент! 🤔');
    }
}

function checkAllAnimalsHelped() {
    const remainingAnimals = document.querySelectorAll('.animal-need:not(.helped)').length;
    console.log('Осталось животных:', remainingAnimals);
    if (remainingAnimals === 0 && !gameCompleted) {
        setTimeout(() => {
            completeForestHelping();
        }, 500);
    }
}

function updateHelpingProgress() {
    const percentage = Math.min((gameState.animalsHelped / gameState.totalAnimals) * 100, 100);
    const progressBar = document.getElementById('helpingProgress');
    const percentageText = document.getElementById('helpingPercentage');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (percentageText) percentageText.textContent = Math.round(percentage) + '%';
}

function completeForestHelping() {
    // Проверяем, не был ли уже добавлен бонус
    if (gameState.bonusAdded) {
        console.log('Бонус уже был добавлен, пропускаем');
        return;
    }
    
    console.log('Все животные помогли! Добавляем бонус...');
    gameState.bonusAdded = true;
    gameState.score += 20;
    updateScore();
    
    showScorePopup(window.innerWidth / 2, window.innerHeight / 2, '+20 Бонус!');
    
    setTimeout(() => {
        startQuiz();
    }, 2000);
}

// ========== ВИКТОРИНА ==========
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
    const container = document.getElementById('progressDots');
    if (!container) return;
    container.innerHTML='';
    for(let i=0; i<quizQuestions.length; i++) {
        const dot = document.createElement('div');
        dot.className='progress-dot';
        if(i===0) dot.classList.add('active');
        container.appendChild(dot);
    }
}

function showQuestion() {
    const q = quizQuestions[gameState.currentQuestion];
    
    const currentQSpan = document.getElementById('currentQuestion');
    const totalQSpan = document.getElementById('totalQuestions');
    const questionText = document.getElementById('questionText');
    const helperText = document.getElementById('helperText');
    const creatureIcon = document.querySelector('.creature-icon');
    
    if (currentQSpan) currentQSpan.textContent = gameState.currentQuestion + 1;
    if (totalQSpan) totalQSpan.textContent = quizQuestions.length;
    if (questionText) questionText.textContent = q.question;
    if (helperText) {
        helperText.innerHTML = "🤔 Подумай хорошенько! Выбери правильный ответ!";
        helperText.style.color = '';
    }
    if (creatureIcon && q.image) {
        creatureIcon.src = q.image;
    }

    const answersContainer = document.getElementById('quizAnswers');
    if (answersContainer) {
        answersContainer.innerHTML = '';
        
        q.answers.forEach((ans, idx) => {
            const div = document.createElement('div');
            div.className = 'answer-option';
            div.textContent = ans;
            div.addEventListener('click', () => selectAnswer(idx));
            answersContainer.appendChild(div);
        });
    }
    
    updateProgressDots();
    gameState.isAnswerLocked = false;
}

function updateProgressDots() {
    document.querySelectorAll('.progress-dot').forEach((d,i) => {
        d.classList.remove('active','completed');
        if(i<gameState.currentQuestion) d.classList.add('completed');
        if(i===gameState.currentQuestion) d.classList.add('active');
    });
}

function selectAnswer(index) {
    if (gameState.isAnswerLocked) return;
    gameState.isAnswerLocked = true;
    
    const q = quizQuestions[gameState.currentQuestion];
    const options = document.querySelectorAll('.answer-option');
    const helperText = document.getElementById('helperText');
    
    options.forEach(o => o.style.pointerEvents = 'none');
    options[index].classList.add('selected');

    setTimeout(() => {
        options[q.correct].classList.add('correct');
        
        if (index !== q.correct) {
            options[index].classList.add('incorrect');
            if (helperText) {
                helperText.innerHTML = `❌ Неправильно! ${q.helper}`;
                helperText.style.color = '#ef4444';
            }
        } else {
            gameState.correctAnswers++;
            gameState.score += 10;
            updateScore();
            showScorePopup(window.innerWidth/2, 200, '+10');
            if (helperText) {
                helperText.innerHTML = q.helper;
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
    if (gameState.currentQuestion<quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// ========== ЭКРАН РЕЗУЛЬТАТОВ ==========
async function showResults() {
    if (gameCompleted) return;
    gameCompleted = true;
    
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    displayResults();
    startFactCarousel();

    if (typeof forceUpdateUserScore !== 'undefined') {
        await forceUpdateUserScore('losyash', gameState.score);
    }
}

function displayResults() {
    const finalScoreSpan = document.getElementById('finalScore');
    const correctAnswersSpan = document.getElementById('correctAnswers');
    const animalsHelpedSpan = document.getElementById('animalsHelped');
    const medalDiv = document.getElementById('finalMedal');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsDesc = document.getElementById('resultsDescription');
    
    if (finalScoreSpan) finalScoreSpan.textContent = gameState.score;
    if (correctAnswersSpan) correctAnswersSpan.textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    if (animalsHelpedSpan) animalsHelpedSpan.textContent = Math.round((gameState.animalsHelped / gameState.totalAnimals) * 100) + '%';
    
    let medal = '🏆';
    let title = 'Отличная работа!';
    let description = 'Ты помог лесным животным и узнал много нового о природе!';
    
    // Максимум 80 очков (6×5=30 + 5×10=50)
    if (gameState.score >= 80) {
        medal = '🥇';
        title = 'Настоящий лесной герой!';
        description = 'Потрясающе! Ты спас всех лесных жителей и показал отличные знания!';
    } else if (gameState.score >= 50) {
        medal = '🥈';
        title = 'Отличный защитник леса!';
        description = 'Замечательно! Лесные животные очень благодарны за твою помощь!';
    } else if (gameState.score >= 30) {
        medal = '🥉';
        title = 'Хороший друг природы!';
        description = 'Хорошо! Ты на правильном пути к тому, чтобы стать защитником леса!';
    }
    
    if (medalDiv) medalDiv.textContent = medal;
    if (resultsTitle) resultsTitle.textContent = title;
    if (resultsDesc) resultsDesc.textContent = description;
}

// ========== КАРУСЕЛЬ ФАКТОВ ==========
function setupFactCarousel() {
    const factCarousel = document.getElementById('factCarousel');
    const factDots = document.querySelector('.fact-dots');
    
    if (!factCarousel || !factDots) return;
    
    factCarousel.innerHTML = '';
    factDots.innerHTML = '';
    
    funFacts.forEach((fact, index) => {
        const factItem = document.createElement('div');
        factItem.className = 'fact-item';
        if (index === 0) factItem.classList.add('active');
        
        factItem.innerHTML = `
            <img src="${fact.image}" alt="Факт" class="fact-icon">
            <p>${fact.text}</p>
        `;
        
        factCarousel.appendChild(factItem);
        
        const dot = document.createElement('div');
        dot.className = 'fact-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showFact(index));
        factDots.appendChild(dot);
    });
}

function startFactCarousel() {
    if (factInterval) clearInterval(factInterval);
    factInterval = setInterval(() => {
        nextFact();
    }, 6000);
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

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function showScorePopup(x, y, text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #f59e0b, #d97706);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 700;
        font-size: 1.125rem;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 10px 20px rgba(245, 158, 11, 0.4);
        animation: scorePopup 2s ease-out forwards;
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

function showFeedbackPopup(x, y, text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        background: rgba(59, 130, 246, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 600;
        font-size: 1rem;
        z-index: 1000;
        pointer-events: none;
        animation: feedbackPopup 2s ease-out forwards;
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

// ========== ИГРОВЫЕ ДЕЙСТВИЯ ==========
function playAgain() {
    gameCompleted = false;
    gameState = {
        currentScreen: 'intro',
        score: 0,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        animalsHelped: 0,
        totalAnimals: 6,
        currentSlide: 0,
        isAnswerLocked: false
    };
    
    updateScore();
    showScreen('introScreen');
    location.reload();
}

function resetForestHelping() {
    gameState.animalsHelped = 0;
    updateHelpingProgress();
}

function goToNextAdventure() {
    window.location.href = 'index.html#adventures';
}

// ========== ЗАПУСК ИГРЫ ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен!');
    initializeGame();
    showInstruction();
});

console.log('Скрипт Forest Adventure загружен!');
