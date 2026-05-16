// Garden Adventure Game Script

// Game state
let gameState = {
    currentScreen: 'intro',
    score: 0,
    level: 1,
    currentQuestion: 0,
    correctAnswers: 0,
    plantsGrown: 0,
    totalPlants: 6,
    currentSlide: 0,
    totalSlides: 5,
    currentTool: 'water',
    questionResults: [], // Массив для хранения результатов каждого вопроса: true - правильный, false - неправильный
    isAnswerLocked: false,
    quizCompleted: false,
    gardenBonusGiven: false
};

// Quiz questions data
const quizQuestions = [
    {
        question: "Что больше всего нужно растениям для фотосинтеза?",
        image: "ФотоСовунья/Солнце.png",
        answers: ["Солнечный свет", "Много воды", "Холод", "Темнота"],
        correct: 0,
        helper: "Растения используют солнечный свет для создания пищи в процессе фотосинтеза!"
    },
    {
        question: "Когда лучше всего поливать растения?",
        image: "ФотоСовунья/Капля.png",
        answers: ["В полдень", "Утром или вечером", "Ночью", "Когда жарко"],
        correct: 1,
        helper: "Утром и вечером вода не испаряется так быстро и лучше впитывается!"
    },
    {
        question: "Зачем нужно рыхлить почву вокруг растений?",
        image: "ФотоСовунья/Расток.png",
        answers: ["Для красоты", "Чтобы корни дышали", "Чтобы было грязно", "Незачем"],
        correct: 1,
        helper: "Рыхление помогает воздуху проникать к корням, что очень важно для роста!"
    },
    {
        question: "Какие насекомые помогают растениям размножаться?",
        image: "ФотоСовунья/Пчела.png",
        answers: ["Комары", "Пчёлы и бабочки", "Мухи", "Муравьи"],
        correct: 1,
        helper: "Пчёлы и бабочки переносят пыльцу с цветка на цветок - это опыление!"
    },
    {
        question: "Что происходит с растением, если его не поливать?",
        image: "ФотоСовунья/УвядшаяРазо.png",
        answers: ["Растёт быстрее", "Вянет и может погибнуть", "Становится красивее", "Цветёт лучше"],
        correct: 1,
        helper: "Вода нужна растениям для жизни, без неё они засыхают и погибают!"
    }
];

// Fun facts for the carousel
const funFacts = [
    {
        icon: "🌻",
        text: "Подсолнухи могут вырастать до 4 метров в высоту!"
    },
    {
        icon: "🌹",
        text: "Роза - символ любви, а её аромат успокаивает нервы!"
    },
    {
        icon: "🌳",
        text: "Одно дерево за день производит кислород для двух человек!"
    },
    {
        icon: "🌱",
        text: "Семена некоторых растений могут прорасти через 100 лет!"
    }
];

let currentFactIndex = 0;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    updateScoreDisplay();
    initializeFacts();
    initializeTools();
    setupPlantEventListeners();
    showInstruction();
});

// ========== ИНСТРУКЦИЯ ПРИ ЗАГРУЗКЕ ==========
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
            border: 2px solid #D962D9; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">🦉</div>
            <h2 style="color: #D962D9; margin-bottom: 15px;">Как играть?</h2>
            <div style="color: white; text-align: left; margin-bottom: 20px;">
                <p style="margin: 10px 0;">📖 <strong>Шаг 1:</strong> Посмотри обучающий урок о садоводстве</p>
                <p style="margin: 10px 0;">🌱 <strong>Шаг 2:</strong> Ухаживай за растениями (выбери инструмент, потом нажми на растение)</p>
                <p style="margin: 10px 0;">❓ <strong>Шаг 3:</strong> Ответь на вопросы викторины</p>
                <p style="margin: 10px 0;">⭐ <strong>Шаг 4:</strong> Получи награду эко-героя!</p>
                <hr style="margin: 15px 0; border-color: #D962D9;">
                <p style="margin: 10px 0; color: #D962D9;">💡 Совет: У каждого растения есть значок-подсказка! Сначала выбери инструмент, потом нажми на растение!</p>
            </div>
            <button onclick="closeInstruction()" style="background: #D962D9; border: none; padding: 12px 30px; 
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

// Update score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        // Ограничиваем максимальное количество звезд 100
        scoreElement.textContent = Math.min(gameState.score, 100);
    }
}

// Start lecture
function startLecture() {
    showScreen('lectureScreen');
    gameState.currentScreen = 'lecture';
}

// Lecture navigation
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
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show current slide
    const currentSlide = document.getElementById(`slide${slideIndex + 1}`);
    if (currentSlide) {
        currentSlide.classList.add('active');
    }
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === slideIndex);
    });
    
    // Update teacher text based on slide
    const teacherTexts = [
        "Растения - живые существа, и им нужна наша забота и внимание!",
        "Каждый цветок прекрасен по-своему! Изучай разные виды растений!",
        "Правильный полив - основа здорового сада! Не переливай и не забывай поливать!",
        "Уход за садом - это ежедневная работа, но как она прекрасна!",
        "Теперь ты знаешь основы садоводства! Готова применить знания на практике?"
    ];
    
    document.getElementById('teacherText').textContent = teacherTexts[slideIndex] || "Теперь ты готова стать настоящим садоводом!";
}

function updateLectureNavigation() {
    const prevButton = document.querySelector('.nav-button.prev');
    const nextButton = document.querySelector('.nav-button.next');
    const startGameButton = document.querySelector('.start-game-button');
    
    prevButton.disabled = gameState.currentSlide === 0;
    
    if (gameState.currentSlide === gameState.totalSlides - 1) {
        nextButton.style.display = 'none';
        startGameButton.style.display = 'block';
    } else {
        nextButton.style.display = 'block';
        startGameButton.style.display = 'none';
    }
}

// Start garden game
function startGame() {
    showScreen('gardenScreen');
    gameState.currentScreen = 'garden';
    initializeGardenGame();
}

// Initialize garden mini-game
function initializeGardenGame() {
    const plants = document.querySelectorAll('.plant');
    
    // Add click functionality to plants
    plants.forEach(plant => {
        updatePlantAppearance(plant);
    });
    
    updateGardenProgress();
}

function setupPlantEventListeners() {
    const plants = document.querySelectorAll('.plant');
    plants.forEach(plant => {
        plant.addEventListener('click', handlePlantClick);
    });
}

function initializeTools() {
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.addEventListener('click', function() {
            // Remove active class from all tools
            tools.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tool
            this.classList.add('active');
            // Update current tool
            gameState.currentTool = this.dataset.tool;
        });
    });
}

function handlePlantClick(e) {
    const plant = e.currentTarget;
    const plantNeed = plant.dataset.need;
    const currentTool = gameState.currentTool;
    
    if (plant.classList.contains('cared')) {
        return; 
    }
    
    if (plantNeed === currentTool) {
        // Correct tool used
        plant.classList.add('cared');
        gameState.plantsGrown++;
        
        // Добавляем баллы только если ещё не достигли 100
        if (gameState.score < 100) {
            let newScore = gameState.score + 5;
            if (newScore > 100) newScore = 100;
            gameState.score = newScore;
        }
        
        // Update plant appearance - скрываем иконку потребности
        updatePlantAppearance(plant);
        
        // Show positive feedback с баллами
        showScorePopup(e.clientX, e.clientY, '+5');
        
        // Проверяем, все ли растения ухожены
        if (gameState.plantsGrown >= gameState.totalPlants && !gameState.gardenBonusGiven) {
            gameState.gardenBonusGiven = true;  // ← добавьте это поле в gameState
            
            if (gameState.score < 100) {
                let bonusScore = gameState.score + 20;
                if (bonusScore > 100) bonusScore = 100;
                gameState.score = bonusScore;
                showScorePopup(window.innerWidth / 2, window.innerHeight / 2, '+20 Бонус за заботу!');
                updateScoreDisplay();
            }
            
            setTimeout(() => {
                startQuiz();
            }, 1500);
        }
    } else {
        showGardenFeedback("Не тот инструмент! Посмотри на подсказку!");
    }
    
    updateScoreDisplay();
    updateGardenProgress();
}

function updatePlantAppearance(plant) {
    const stage = parseInt(plant.dataset.stage);
    const plantStageElement = plant.querySelector('.plant-stage');
    const plantStatusElement = plant.querySelector('.plant-status');
    
    if (plant.classList.contains('cared')) {
        // Plant is cared for - показываем цветущее растение и скрываем иконку потребности
        const bloomingStages = ['🌸', '🌺', '🌻', '🌷'];
        plantStageElement.textContent = bloomingStages[Math.floor(Math.random() * bloomingStages.length)];
        
        // Скрываем иконку потребности
        if (plantStatusElement) {
            plantStatusElement.style.display = 'none';
        }
        
        plant.classList.remove('need-attention');
        
        // Добавляем анимацию успеха
        plant.style.animation = 'flourish 0.8s ease-out';
        
    } else {
        // Plant needs attention - показываем иконку потребности
        plant.classList.add('need-attention');
        if (plantStatusElement) {
            plantStatusElement.style.display = 'block';
        }
        
        // Устанавливаем соответствующую стадию растения
        const stages = ['🌱', '🌿', '🌸'];
        if (stage >= 1 && stage <= 3) {
            plantStageElement.textContent = stages[stage - 1];
        }
    }
}

function showGardenFeedback(message) {
    const helperText = document.getElementById('gardenHelperText');
    const originalText = helperText.textContent;
    
    helperText.textContent = message;
    helperText.style.color = '#ef4444';
    
    setTimeout(() => {
        helperText.textContent = "Выбери нужный инструмент и нажми на растение, которому он требуется!";
        helperText.style.color = '';
    }, 2000);
}

function updateGardenProgress() {
    const percentage = Math.round((gameState.plantsGrown / gameState.totalPlants) * 100);
    const progressBar = document.getElementById('gardenProgress');
    const percentageText = document.getElementById('gardenPercentage');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (percentageText) percentageText.textContent = percentage + '%';
}

// Start quiz
function startQuiz() {
    showScreen('quizScreen');
    gameState.currentScreen = 'quiz';
    gameState.currentQuestion = 0;
    gameState.correctAnswers = 0;
    gameState.questionResults = []; // Сбрасываем результаты
    
    // Initialize progress dots
    initializeProgressDots();
    showQuestion();
}

function initializeProgressDots() {
    const progressDots = document.getElementById('progressDots');
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
    
    document.getElementById('currentQuestion').textContent = gameState.currentQuestion + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionText').textContent = question.question;
    
    // Обновляем изображение вопроса
    const questionImage = document.getElementById('questionImage');
    if (questionImage) {
        questionImage.innerHTML = `<img class="plant-icon" src="${question.image}" alt="Изображение вопроса">`;
    }
    
    // ✅ ВОТ ЗДЕСЬ - сбрасываем цвет и текст на чёрный/стандартный
    const helperTextElement = document.getElementById('helperText');
    helperTextElement.textContent = "Подумай внимательно! Вспомни урок о садоводстве!";
    helperTextElement.style.color = ''; // Сбрасываем цвет (вернётся к чёрному из CSS)
    // или явно: helperTextElement.style.color = '#000000';
    
    // Создаём варианты ответов
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
    if (gameState.isAnswerLocked) return;
    gameState.isAnswerLocked = true;
    
    const question = quizQuestions[gameState.currentQuestion];
    const answerButtons = document.querySelectorAll('.answer-option');
    const isCorrect = selectedIndex === question.correct;
    
    gameState.questionResults[gameState.currentQuestion] = isCorrect;
    
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    
    answerButtons[selectedIndex].classList.add('selected');
    
    setTimeout(() => {
        const helperText = document.getElementById('helperText');
        
        if (isCorrect) {
            answerButtons[selectedIndex].classList.add('correct');
            gameState.correctAnswers++;
            
            const newScore = gameState.score + 10;
            gameState.score = Math.min(newScore, 100);
            
            helperText.innerHTML = "✅ Правильно! " + question.helper;
            helperText.style.color = '#22c55e'; // Зелёный
            showScorePopup(window.innerWidth / 2, 200, '+10');
        } else {
            answerButtons[selectedIndex].classList.add('incorrect');
            answerButtons[question.correct].classList.add('correct');
            
            helperText.innerHTML = `❌ Неправильно! ${question.helper}`;
            helperText.style.color = '#ef4444'; // Красный
        }
        
        updateScoreDisplay();
        updateProgressDots();
        
        setTimeout(() => {
            gameState.isAnswerLocked = false;
            nextQuestion();
        }, 3000);
    }, 500);
}

function nextQuestion() {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < quizQuestions.length) {
        showQuestion(); // Там уже будет сброс цвета
    } else {
        showResults();
    }
    gameState.isAnswerLocked = false;
}


function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dots .dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('current', 'completed', 'correct', 'incorrect');
        
        if (index < gameState.currentQuestion) {
            dot.classList.add('completed');
            // Проверяем результат для завершенных вопросов
            if (gameState.questionResults[index] !== undefined) {
                if (gameState.questionResults[index] === true) {
                    dot.classList.add('correct');
                } else {
                    dot.classList.add('incorrect');
                }
            }
        } else if (index === gameState.currentQuestion) {
            dot.classList.add('current');
            // Для текущего вопроса, если ответ уже дан
            if (gameState.currentQuestionAnswered) {
                if (gameState.questionResults[gameState.currentQuestion] === true) {
                    dot.classList.add('correct');
                } else {
                    dot.classList.add('incorrect');
                }
            }
        }
    });
}

// Show results
async function showResults() {
    // Если викторина уже была завершена - не начисляем бонусы повторно
    if (gameState.quizCompleted) {
        showScreen('resultsScreen');
        gameState.currentScreen = 'results';
        return;
    }
    
    gameState.quizCompleted = true;  // Отмечаем, что викторина завершена
    
    showScreen('resultsScreen');
    gameState.currentScreen = 'results';
    
    // Рассчитать финальную статистику с бонусами
    const helpingBonus = (gameState.plantsGrown === gameState.totalPlants && gameState.score < 100) ? 0 : 0;
    const perfectQuizBonus = (gameState.correctAnswers === quizQuestions.length && gameState.score < 100) ? 0 : 0;
    
    // Добавляем бонусы с ограничением максимум 100
    let totalScore = gameState.score + helpingBonus + perfectQuizBonus;
    
    // Ограничиваем максимум 100
    if (totalScore > 100) totalScore = 100;
    gameState.score = totalScore;
    
    updateScoreDisplay();
    
    // Calculate percentages
    const scorePercentage = Math.round((gameState.correctAnswers / quizQuestions.length) * 100);
    const plantsPercentage = Math.round((gameState.plantsGrown / gameState.totalPlants) * 100);
    
    // Update results display
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('correctAnswers').textContent = `${gameState.correctAnswers}/${quizQuestions.length}`;
    document.getElementById('plantsGrown').textContent = plantsPercentage + '%';
    
    // Set medal based on performance (как в игре с Лосяшем)
    const medal = document.getElementById('finalMedal');
    if (gameState.score >= 80) {
        medal.textContent = '🥇';
        document.getElementById('resultsTitle').textContent = 'Настоящий садовый герой!';
        document.getElementById('resultsDescription').textContent = 'Потрясающе! Ты вырастила все растения и показала глубокие знания садоводства!';
    } else if (gameState.score >= 50) {
        medal.textContent = '🥈';
        document.getElementById('resultsTitle').textContent = 'Отличный садовод!';
        document.getElementById('resultsDescription').textContent = 'Замечательно! Твои растения цветут и радуются твоей заботе!';
    } else if (gameState.score >= 30) {
        medal.textContent = '🥉';
        document.getElementById('resultsTitle').textContent = 'Хороший друг растений!';
        document.getElementById('resultsDescription').textContent = 'Хорошо! Ты на правильном пути к тому, чтобы стать мастером садоводства!';
    } else {
        medal.textContent = '🏆';
        document.getElementById('resultsTitle').textContent = 'Начинающий садовод!';
        document.getElementById('resultsDescription').textContent = 'Неплохо! Продолжай учиться и у тебя всё получится!';
    }

    await forceUpdateUserScore('sovunya', gameState.score);
}

// Initialize facts carousel
function initializeFacts() {
    const factCarousel = document.getElementById('factCarousel');
    if (!factCarousel) return;
    
    const factNavigation = document.querySelector('.fact-navigation .fact-dots');
    if (factNavigation) {
        factNavigation.innerHTML = '';
        
        funFacts.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.onclick = () => goToFact(index);
            factNavigation.appendChild(dot);
        });
    }
    
    // Set initial fact
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

// Game controls -
function playAgain() {
    // Reset game state - обновление глобальной переменной gameState
    gameState = {
        currentScreen: 'intro',
        score: 0,
        level: 1,
        currentQuestion: 0,
        correctAnswers: 0,
        plantsGrown: 0,
        totalPlants: 6,
        currentSlide: 0,
        totalSlides: 5,
        currentTool: 'water',
        questionResults: [],
        isAnswerLocked: false,
        quizCompleted: false,
        gardenBonusGiven: false 
    };
    
    // Reset UI
    updateScoreDisplay();
    
    // Reset all plants
    const plants = document.querySelectorAll('.plant');
    plants.forEach(plant => {
        plant.classList.remove('cared', 'need-attention');
        const plantStatusElement = plant.querySelector('.plant-status');
        if (plantStatusElement) {
            plantStatusElement.style.display = 'block';
        }
        updatePlantAppearance(plant);
    });
    
    // Reset tools
    const tools = document.querySelectorAll('.tool');
    tools.forEach(tool => {
        tool.classList.remove('active');
    });
    document.querySelector('.tool[data-tool="water"]').classList.add('active');
    
    // Reset progress
    document.getElementById('gardenProgress').style.width = '0%';
    document.getElementById('gardenPercentage').textContent = '0%';
    
    // Reset lecture slides
    gameState.currentSlide = 0;
    showSlide(0);
    updateLectureNavigation();
    
    // Go back to intro
    showScreen('introScreen');
}

function goToNextAdventure() {
    // Redirect to main page or next adventure
    window.location.href = 'index.html';
}

// Screen management
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

// Mobile support
document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.plant') || e.target.closest('.tool')) {
        e.preventDefault();
    }
});

// Add some garden ambiance
document.addEventListener('DOMContentLoaded', function() {
    // Animate garden decorations
    const decorations = document.querySelectorAll('.garden-decoration');
    decorations.forEach((decoration, index) => {
        decoration.style.animationDelay = (index * 0.5) + 's';
    });
});

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
    
    .plant.cared {
        border-color: #22c55e;
        animation: flourish 0.8s ease-out forwards;
    }
`;
document.head.appendChild(style);

// Function to show score popup
function showScorePopup(x, y, text) {
    const popup = document.createElement('div');
    popup.textContent = text;
    popup.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #8EA325, #A3C959);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 700;
        font-size: 1.125rem;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 10px 20px rgba(142, 163, 37, 0.4);
        animation: scorePopup 2s ease-out forwards;
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.remove();
    }, 2000);
}

async function completeGame() {
    const success = await updateUserScore('sovunya', 100); // 100 очков за игру
    if (success) {
        alert('🎉 Поздравляем! Вы получили 100 очков эко-героя!');
        // Перенаправление или продолжение
    }
}
