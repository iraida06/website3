// ========== НАСТРОЙКА FIREBASE ==========
const firebaseConfig = {
    apiKey: "AIzaSyCY2mFu6xUL70sZhQKWv_CnM5DzGhfiPvI",
    authDomain: "ecoadventures-1c201.firebaseapp.com",
    projectId: "ecoadventures-1c201",
    storageBucket: "ecoadventures-1c201.firebasestorage.app",
    messagingSenderId: "865358200859",
    appId: "1:865358200859:web:62ec18608185782719b8be",
    measurementId: "G-JS1JE6PJZW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ========== ПРОВЕРКА АВТОРИЗАЦИИ ==========
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'auth.html';
    } else {
        const user = JSON.parse(currentUser);
        const avatarImg = document.getElementById('userAvatar');
        const userNameSpan = document.getElementById('userName');
        const userAgeSpan = document.getElementById('userAge');
        const userProfile = document.getElementById('userProfile');
        
        if (avatarImg) avatarImg.src = user.avatar;
        if (userNameSpan) userNameSpan.textContent = user.username;
        if (userAgeSpan) userAgeSpan.textContent = user.age + ' лет';
        if (userProfile) userProfile.style.display = 'flex';
        
        // Загружаем успехи пользователя
        loadUserSuccess();
    }
}

async function loadUserSuccess() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    try {
        const user = JSON.parse(currentUser);
        const userDoc = await db.collection('users').doc(user.id).get();

        if (userDoc.exists) {
            const userData = userDoc.data();

            // Обновляем отображение очков и уровня
            document.getElementById('totalScore').textContent = userData.totalScore || 0;
            document.getElementById('levelTitle').textContent = userData.levelTitle || "🌱 Юный эколог";
            document.getElementById('levelNumber').textContent = `Уровень ${userData.level || 1}`;

            // Иконка уровня
            const levelIcons = {1: "🌱", 2:"🍃", 3:"🌿", 4:"🌸", 5:"🌟", 6:"⭐", 7:"🏆", 8:"🦸", 9:"🌍", 10:"💚"};
            document.getElementById('levelIcon').textContent = levelIcons[userData.level] || "🌱";

            // Прогресс-бар
            const currentScore = userData.totalScore || 0;
            const pointsNeeded = 100 - (currentScore % 100);
            const progressPercent = (currentScore % 100);
            document.getElementById('pointsToNext').textContent = pointsNeeded;
            document.getElementById('progressFill').style.width = progressPercent + '%';

            // Обновляем достижения
            const achievements = userData.achievements || {};
            if (achievements.pin) markAchievementCompleted('achPin');
            if (achievements.losyash) markAchievementCompleted('achLosyash');
            if (achievements.krosh) markAchievementCompleted('achKrosh');
            if (achievements.sovunya) markAchievementCompleted('achSovunya');

            // ПОКАЗЫВАЕМ БЛОК!
            const successBlock = document.getElementById('mySuccessBlock');
            if (successBlock) {
                successBlock.style.display = 'block';
                console.log('Блок "Мои успехи" показан');
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки успехов:', error);
    }
}

function markAchievementCompleted(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('completed');
        const statusSpan = element.querySelector('.achievements-status');
        if (statusSpan) {
            statusSpan.innerHTML = '✅ Пройдено!';
            statusSpan.style.color = '#4caf50';
        }
    }
}

// == Обновление очков после игры == 
async function updateUserScore(gameId, earnedPoints) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт!');
        window.location.href = 'auth.html';
        return false;
    }

    try {
        const user = JSON.parse(currentUser);
        const userRef = db.collection('users').doc(user.id);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        // Проверяем, не получал ли уже пользователь очки за эту игру
        const gameScores = userData.gameScores || {};
        if (gameScores[gameId] && gameScores[gameId] >= earnedPoints) {
            console.log('Очки за эту игру уже были поллучены');
            return false;
        }

        // Обновляем очки
        const newTotalScore = (userData.totalScore || 0) + earnedPoints;
        const newGameScores = { ...gameScores, [gameId]: earnedPoints };

        // Проверяем повышение уровня
        const newLevel = Math.floor(newTotalScore / 100) +1;
        const levelTitles = {
            1: "🌱 Юный эколог",
            2: "🍃 Начинающий защитник",
            3: "🌿 Помощник природы",
            4: "🌸 Друг леса",
            5: "🌟 Эко-герой",
            6: "⭐ Хранитель планеты",
            7: "🏆 Мастер экологии",
            8: "🦸 Защитник природы",
            9: "🌍 Эко-чемпион",
            10: "💚 Легенда экологии"
        };

        const updates = {
            totalScore: newTotalScore,
            level: Math.min(newLevel, 10),
            levelTitle: levelTitles[Math.min(newLevel, 10)],
            gameScores: newGameScores
        };

        // Если игра пройдена полностью (например, за 100 очков), отмечаем достижение
        if (earnedPoints >= 100) {
            const achievements = userData.achievements || {};
            achievements[gameId] = true;
            updates.achievements = achievements;
        }

        await userRef.update(updates);

        // Обновляем локальное хранилище
        const updatedUser = { ...user, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        return true;
    } catch (error) {
        console.error('Ошибка обновления очков:', error);
        return false;
    }
}

// ========== ВЫХОД ИЗ АККАУНТА ==========
function showUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth.html';
}

// Вызываем загрузку успехов при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    const profile = document.getElementById('userProfile');
    if (profile) profile.onclick = showUserMenu;
    updateGameScoresInMenu();
});

// Обновление очков для каждого персонажа в меню
async function updateGameScoresInMenu() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    try {
        const user = JSON.parse(currentUser);
        const userDoc = await db.collection('users').doc(user.id).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            const gameScores = userData.gameScores || {};

            // Общий счёт 
            const totalScore = userData.totalScore || 0;
            const totalScoreElem = document.getElementById('totalScoreHeader');
            if (totalScoreElem) totalScoreElem.textContent = totalScore;

            // Обновляем каждую игру
            updateGameCard('pin', gameScores.pin || 0);
            updateGameCard('losyash', gameScores.losyash || 0);
            updateGameCard('krosh', gameScores.krosh || 0);
            updateGameCard('sovunya', gameScores.sovunya || 0);
        }
    } catch (error) {
        console.error('Ошибка загрузки очков игр:', error);
    }
}

function updateGameCard(gameId, points) {
    const percentage = Math.min(points, 100);
    const circumference = 283;
    const offset = circumference - (percentage / 100) * circumference;
    
    // Определение цвета в зависимости от звёзд
    let color;
    if (percentage < 30) {
        color = '#c72020'; // Красный - меньше 30
    } else if (percentage < 70) {
        color = '#ff8400'; // Оранжевый - от 30 до 69
    } else {
        color = '#30bf37'; // Зелёный - от 70 до 100
    }
    // Круговой прогресс
    const circleFill = document.getElementById(`${gameId}CircleFill`);
    if (circleFill) {
        circleFill.style.stroke = color;
        circleFill.style.strokeDashoffset = offset;
    }
    
    // Очки
    const pointsElem = document.getElementById(`${gameId}Points`);
    if (pointsElem) pointsElem.textContent = points;
    
    // Прогресс-бар
    const progressFill = document.getElementById(`${gameId}ProgressFill`);
    if (progressFill) {
        progressFill.style.width = percentage + '%';
        progressFill.style.background = color;
    }
    // Статус и награда
    const statusElem = document.getElementById(`${gameId}Status`);
    const rewardElem = document.getElementById(`${gameId}Reward`);
    
    if (percentage >= 100) {
        if (statusElem) {
            statusElem.className = 'card-status unlocked';
            statusElem.style.background = '#4caf50';
        }
        if (rewardElem) {
            rewardElem.className = 'reward-badge unlocked';
            rewardElem.innerHTML = '🏆';
        }
    } else if (percentage > 0) {
        if (statusElem) {
            statusElem.className = 'card-status unlocked';
            statusElem.style.background = '#ffc107';
        }
        if (rewardElem) {
            rewardElem.className = 'reward-badge';
            rewardElem.innerHTML = '⭐';
        }
    } else {
        if (statusElem) {
            statusElem.className = 'card-status locked';
            statusElem.style.background = '#9e9e9e';
        }
        if (rewardElem) {
            rewardElem.className = 'reward-badge';
            rewardElem.innerHTML = '🔒';
        }
    }
}



// ===== КАРУСЕЛЬ ДЛЯ РАЗДЕЛА "О НАШЕЙ ПРОГРАММЕ" =====
document.addEventListener('DOMContentLoaded', function() {
    initAboutCarousel();
});

function initAboutCarousel() {
    const slides = document.querySelectorAll('#about1 .carousel-slide');
    const dots = document.querySelectorAll('#about1 .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (!slides.length) return;
    
    let currentIndex = 0;
    let autoInterval;
    
    // Функция показа слайда по индексу
    function showSlide(index) {
        // Корректируем индекс
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        currentIndex = index;
        
        // Скрываем все слайды
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Показываем текущий
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
    }
    
    // Переключение на следующий слайд
    function nextSlide() {
        showSlide(currentIndex + 1);
        resetAutoPlay();
    }
    
    // Переключение на предыдущий слайд
    function prevSlide() {
        showSlide(currentIndex - 1);
        resetAutoPlay();
    }
    
    // Автоматическое перелистывание
    function startAutoPlay() {
        autoInterval = setInterval(() => {
            nextSlide();
        }, 5000); // каждые 5 секунд
    }
    
    function resetAutoPlay() {
        if (autoInterval) clearInterval(autoInterval);
        startAutoPlay();
    }
    
    // Обработчики кнопок
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Обработчики точек
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            resetAutoPlay();
        });
    });
    
    // Запускаем автоперелистывание
    startAutoPlay();
    
    // При наведении на карусель - автоперелистывание останавливается
    const carouselContainer = document.querySelector('#about1 .carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            if (autoInterval) clearInterval(autoInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
}

// Проверка подключения к Firebase
db.collection('users').limit(1).get()
    .then(() => console.log('✅ Подключение к Firebase работает'))
    .catch(err => console.error('❌ Ошибка подключения:', err));
