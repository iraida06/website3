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
    currentSlide: 0
};

// Quiz questions data
const quizQuestions = [
    {
        question: "Какое животное делает запасы орехов на зиму?",
        image: "ФотоЛосяш/Белка.png",
        answers: ["Белка", "Медведь", "Лиса", "Волк"],
        correct: 0,
        helper: "Белки запасают орехи и грибы на зиму!"
    },
    {
        question: "Что едят медведи?",
        image: "ФотоЛосяш/Медведь.png",
        answers: ["Только мясо", "Только растения", "Всё подряд", "Только рыбу"],
        correct: 2,
        helper: "Медведи всеядные! Они едят ягоды, рыбу, мёд и многое другое."
    },
    {
        question: "Кто строит гнёзда на деревьях?",
        image: "ФотоЛосяш/Птица.png",
        answers: ["Медведи", "Птицы", "Еноты", "Лисы"],
        correct: 1,
        helper: "Птицы вьют гнёзда на ветках деревьев!"
    },
    {
        question: "Когда совы наиболее активны?",
        image: "ФотоЛосяш/Сова.png",
        answers: ["Утром", "Днём", "Вечером", "Ночью"],
        correct: 3,
        helper: "Совы - ночные хищники с отличным зрением в темноте!"
    },
    {
        question: "Что НЕЛЬЗЯ делать в лесу?",
        image: "ФотоЛосяш/Елка.png",
        answers: ["Собирать грибы", "Наблюдать за птицами", "Оставлять мусор", "Слушать звуки природы"],
        correct: 2,
        helper: "Мусор вредит животным и загрязняет природу!"
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

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
    console.log('Игра загружается...');
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    updateScore();
    setupForestHelping();
    setupQuiz();
    setupFactCarousel();
}

function setupEventListeners() {
    // Animal helping listeners
    document.querySelectorAll('.animal-need').forEach(animal => {
        animal.addEventListener('click', helpAnimal);
    });

    // Tool selection listeners
    document.querySelectorAll('.tool').forEach(tool => {
        tool.addEventListener('click', selectTool);
    });
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
}

function showScreen(screenId) {
    console.log('Переход к экрану:', screenId);
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

// Lecture functions
function updateLectureDisplay() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const startGameButton = document.querySelector('.start-game-button');
    
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');
        if (index === gameState.currentSlide) {
            slide.classList.add('active');
        }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === gameState.currentSlide);
    });
    
    // Update navigation buttons
    if (prevButton) prevButton.disabled = gameState.currentSlide === 0;
    if (nextButton) nextButton.style.display = gameState.currentSlide === slides.length - 1 ? 'none' : 'inline-block';
    if (startGameButton) startGameButton.style.display = gameState.currentSlide === slides.length - 1 ? 'inline-block' : 'none';
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

// Forest helping game
function setupForestHelping() {
    updateHelpingProgress();
}

function selectTool(event) {
    document.querySelectorAll('.tool').forEach(tool => {
        tool.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

function helpAnimal(event) {
    const animalElement = event.currentTarget;
    const animalNeed = animalElement.dataset.need;
    const activeTool = document.querySelector('.tool.active').dataset.tool;
    
    // Check if correct tool is selected
    if (animalNeed === activeTool) {
        // Correct help!
        animalElement.classList.add('helped');
        gameState.animalsHelped++;
        gameState.score += 8;
        
        updateScore();
        updateHelpingProgress();
        
        // Remove animal after animation
        setTimeout(() => {
            animalElement.remove();
            checkAllAnimalsHelped();
        }, 800);
        
        // Add success popup
        showScorePopup(event.clientX, event.clientY, '+8');
        
    } else {
        // Wrong tool - show gentle feedback
        animalElement.style.animation = 'none';
        setTimeout(() => {
            animalElement.style.animation = '';
        }, 100);
        
        showFeedbackPopup(event.clientX, event.clientY, 'Попробуй другой инструмент! 🤔');
    }
}

function checkAllAnimalsHelped() {
    const remainingAnimals = document.querySelectorAll('.animal-need').length;
    console.log('Осталось животных:', remainingAnimals);
    if (remainingAnimals === 0) {
        setTimeout(() => {
            completeForestHelping();
        }, 1000);
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
    console.log('Все животные помогли! Переход к викторине...');
    // Add bonus for completing helping
    gameState.score += 15;
    updateScore();
    
    showScorePopup(window.innerWidth / 2, window.innerHeight / 2, '+15 Бонус за доброту!');
    
    // Переход к викторине через 2 секунды
    setTimeout(() => {
        startQuiz();
    }, 2000);
}

// Quiz game
function setupQuiz() {
    createProgressDots();
}

function startQuiz() {
    showScreen('quizScreen');
    gameState.currentScreen='quiz';
    gameState.currentQuestion=0;
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
    
    // Update question info
    document.getElementById('currentQuestion').textContent = gameState.currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('quizTitle').textContent = "Вопрос о лесных обитателях"; // Заголовок остается постоянным
    document.getElementById('questionText').textContent = q.question; // А вот это меняет сам вопрос под картинкой
    document.getElementById('helperText').textContent = q.helper;

    // Update question image
    const img = document.querySelector('#questionImage .creature-icon');
    if (img && q.image) {
        img.src = q.image;
        img.alt = "Изображение животного";
    }

    const answersContainer = document.getElementById('quizAnswers');
    answersContainer.innerHTML = '';
    
    q.answers.forEach((ans, idx) => {
        const div = document.createElement('div');
        div.className = 'answer-option';
        div.textContent = ans;
        div.addEventListener('click', () => selectAnswer(idx));
        answersContainer.appendChild(div);
    });
    
    updateProgressDots();
}

function updateProgressDots() {
    document.querySelectorAll('.progress-dot').forEach((d,i) => {
        d.classList.remove('active','completed');
        if(i<gameState.currentQuestion) d.classList.add('completed');
        if(i===gameState.currentQuestion) d.classList.add('active');
    });
}

function selectAnswer(index) {
    const q=quizQuestions[gameState.currentQuestion];
    const options=document.querySelectorAll('.answer-option');
    options.forEach(o=>o.style.pointerEvents='none');
    options[index].classList.add('selected');

    setTimeout(()=>{
        options[q.correct].classList.add('correct');
        if(index!==q.correct) {
            options[index].classList.add('incorrect');
        } else {
            gameState.correctAnswers++;
            gameState.score+=12;
            updateScore();
            showScorePopup(window.innerWidth/2,200,'+12');
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

// Results screen
function showResults() {
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    calculateFinalResults();
    displayResults();
    startFactCarousel();
}

function calculateFinalResults() {
    // Calculate final score based on performance
    const helpingBonus = gameState.animalsHelped === gameState.totalAnimals ? 12 : 0;
    const perfectQuizBonus = gameState.correctAnswers === quizQuestions.length ? 18 : 0;
    
    gameState.score += helpingBonus + perfectQuizBonus;
    updateScore();
}

function displayResults() {
    // Update final stats
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('correctAnswers').textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    document.getElementById('animalsHelped').textContent = Math.round((gameState.animalsHelped / gameState.totalAnimals) * 100) + '%';
    
    // Determine medal and title based on performance
    let medal = '🏆';
    let title = 'Отличная работа!';
    let description = 'Ты помог лесным животным и узнал много нового о природе!';
    
    if (gameState.score >= 80) {
        medal = '🥇';
        title = 'Настоящий лесной герой!';
        description = 'Потрясающе! Ты спас всех лесных жителей и показал глубокие знания природы!';
    } else if (gameState.score >= 50) {
        medal = '🥈';
        title = 'Отличный защитник леса!';
        description = 'Замечательно! Лесные животные очень благодарны за твою помощь!';
    } else if (gameState.score >= 30) {
        medal = '🥉';
        title = 'Хороший друг природы!';
        description = 'Хорошо! Ты на правильном пути к тому, чтобы стать защитником леса!';
    }
    
    document.getElementById('finalMedal').textContent = medal;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsDescription').textContent = description;
}

// Fun facts carousel - ИСПРАВЛЕННАЯ ВЕРСИЯ
function setupFactCarousel() {
    const factCarousel = document.getElementById('factCarousel');
    const factDots = document.querySelector('.fact-dots');
    
    if (!factCarousel || !factDots) {
        console.log('Элементы карусели фактов не найдены');
        return;
    }
    
    // Clear existing content
    factCarousel.innerHTML = '';
    factDots.innerHTML = '';
    
    console.log('Создание карусели с', funFacts.length, 'фактами');
    
    // Create fact items
    funFacts.forEach((fact, index) => {
        const factItem = document.createElement('div');
        factItem.className = 'fact-item';
        if (index === 0) factItem.classList.add('active');
        
        factItem.innerHTML = `
            <img src="${fact.image}" alt="Факт" class="fact-icon">
            <p>${fact.text}</p>
        `;
        
        factCarousel.appendChild(factItem);
        
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'fact-dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showFact(index));
        factDots.appendChild(dot);
    });
    
    console.log('Создано фактов:', document.querySelectorAll('.fact-item').length);
    console.log('Создано точек:', document.querySelectorAll('.fact-dot').length);
}

function startFactCarousel() {
    console.log('Запуск автоматической смены фактов');
    // Auto-rotate facts every 6 seconds
    setInterval(() => {
        nextFact();
    }, 6000);
}

function showFact(index) {
    console.log('Показ факта:', index);
    currentFactIndex = index;
    
    const factItems = document.querySelectorAll('.fact-item');
    const factDots = document.querySelectorAll('.fact-dot');
    
    // Hide all facts
    factItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show current fact
    if (factItems[index]) {
        factItems[index].classList.add('active');
    }
    
    // Update dots
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


// Utility functions
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
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
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
        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
        animation: feedbackPopup 2s ease-out forwards;
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

// Game actions - ИСПРАВЛЕННАЯ ФУНКЦИЯ resetForestHelping
function playAgain() {
    // Reset game state
    gameState = {
        currentScreen: 'intro',
        score: 0,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        animalsHelped: 0,
        totalAnimals: 6,
        currentSlide: 0
    };
    
    // Reset UI
    updateScore();
    showScreen('introScreen');
    
    // Reset forest helping
    resetForestHelping();
}

function resetForestHelping() {
    // Remove existing animals
    document.querySelectorAll('.animal-need').forEach(animal => animal.remove());
    
    // Add new animals
    const forestScene = document.querySelector('.forest-scene');
    if (!forestScene) return;
    
    const animalNeeds = [
        { need: 'food', animalImage: 'ФотоЛосяш/Белка.png', bubbleImage: 'ФотоЛосяш/Орехи.png', top: '20%', left: '15%' },
        { need: 'food', animalImage: 'ФотоЛосяш/Заяц.png', bubbleImage: 'ФотоЛосяш/Орехи.png', top: '50%', left: '80%' },
        { need: 'home', animalImage: 'ФотоЛосяш/Ёжик.png', bubbleImage: 'ФотоЛосяш/Дом.png', top: '40%', left: '40%' },
        { need: 'home', animalImage: 'ФотоЛосяш/Лиса.png', bubbleImage: 'ФотоЛосяш/Дом.png', top: '70%', left: '60%' },
        { need: 'home', animalImage: 'ФотоЛосяш/Сова.png', bubbleImage: 'ФотоЛосяш/Дом.png', top: '20%', left: '60%' },
        { need: 'food', animalImage: 'ФотоЛосяш/Енот.png', bubbleImage: 'ФотоЛосяш/Орехи.png', top: '60%', left: '20%' }
    ];
    
    animalNeeds.forEach(animal => {
        const animalDiv = document.createElement('div');
        animalDiv.className = 'animal-need';
        animalDiv.dataset.need = animal.need;
        animalDiv.style.top = animal.top;
        animalDiv.style.left = animal.left;
        animalDiv.innerHTML = `
            <img class="animal-icon" src="${animal.animalImage}" alt="Животное"/>
            <img class="need-bubble" src="${animal.bubbleImage}" alt="Потребность"/>
        `;
        animalDiv.addEventListener('click', helpAnimal);
        forestScene.appendChild(animalDiv);
    });
    
    // Reset progress
    document.getElementById('helpingProgress').style.width = '0%';
    document.getElementById('helpingPercentage').textContent = '0%';
}

function goToNextAdventure() {
    window.location.href = '../ГлавнаяОр/ГлавнаяОр.html#adventures';
}

// Add CSS for popup animations
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
    
    @keyframes feedbackPopup {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 0;
        }
    }
    
    .animal-need.helped {
        animation: helpSuccess 0.8s ease-in-out forwards;
    }
    
    @keyframes helpSuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.3) rotate(360deg); }
        100% { transform: scale(0) rotate(720deg); opacity: 0; }
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
    
    /* Стили для изображений в фактах */
    .fact-icon {
        width: 60px !important;
        height: 60px !important;
        object-fit: contain;
        border-radius: 12px;
    }
    
    /* Стили для изображений животных */
    .animal-icon {
        width: 60px;
        height: 60px;
        object-fit: contain;
    }
    
    .need-bubble {
        width: 40px;
        height: 40px;
        object-fit: contain;
    }
`;
document.head.appendChild(style);