    // Global variables
    const API_BASE_URL = 'https://opentdb.com/api.php';
    let currentUser = null;
    let currentQuizData = null;
    let currentQuestionIndex = 0;
    let currentScore = 0;
    let questionsAnswered = 0;
    
    // Add these near your other API constants
const QUIZAPI_URL = "https://quizapi.io/api/v1/questions";
const QUIZAPI_KEY = "0w9EFWwAuKiqTONNmhpGB0ZiCXs8kZ4ZCS9hbK4w"; // Your key
const QUIZAPI_CATEGORIES = {
    "linux": "Linux",
    "bash": "Bash",
    "uncategorized": "Uncategorized", 
    "docker": "Docker",
    "sql": "SQL",
    "cms": "CMS",
    "code": "Code",
    "devops": "DevOps",
    "react": "React",
    "laravel": "Laravel",
    "postgres": "PostgreSQL",
    "django": "Django",
    "cpanel": "cPanel",
    "nodejs": "Node.js",
    "wordpress": "WordPress",
    "next-js": "Next.js",
    "vue-js": "Vue.js",
    "apache-kafka": "Apache Kafka",
    "html": "HTML"
  };
const QUIZAPI_DIFFICULTIES = ["easy", "medium", "hard"];


    // Category mapping
    const CATEGORIES = {
        9: "General Knowledge",
        10: "Entertainment: Books",
        11: "Entertainment: Film",
        12: "Entertainment: Music",
        13: "Entertainment: Musicals & Theatres",
        14: "Entertainment: Television",
        15: "Entertainment: Video Games",
        16: "Entertainment: Board Games",
        17: "Science & Nature",
        18: "Science: Computers",
        19: "Science: Mathematics",
        20: "Mythology",
        21: "Sports",
        22: "Geography",
        23: "History",
        24: "Politics",
        25: "Art",
        26: "Celebrities",
        27: "Animals",
        28: "Vehicles",
        29: "Entertainment: Comics",
        30: "Science: Gadgets",
        31: "Entertainment: Japanese Anime & Manga",
        32: "Entertainment: Cartoon & Animations"
    };
    
    // DOM Elements
    const pageContainer = document.getElementById('page-container');
    const userInfo = document.getElementById('user-info');
    const userAvatar = document.getElementById('user-avatar');
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Initialize application
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        setupEventListeners();
    });
    
    function initApp() {
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            updateUserDisplay();
            navigateTo('home');
        } else {
            navigateTo('login');
        }
    }
    
    function setupEventListeners() {
        // Navigation
        navItems.forEach(item => {
            if (item.id !== 'logout-button') {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = item.getAttribute('data-page');
                    navigateTo(page);
                });
            }
        });
        
        // Logout functionality
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    function updateUserDisplay() {
        if (currentUser) {
            usernameDisplay.textContent = currentUser.username;
            userAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        } else {
            usernameDisplay.textContent = 'Guest';
            userAvatar.textContent = '?';
        }
    }
    
    function navigateTo(page) {
        // If not logged in and trying to access a restricted page
        if (!currentUser && page !== 'login') {
            navigateTo('login');
            return;
        }
        
        // Update active nav item
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Render the appropriate page
        switch (page) {
            case 'login':
                renderLoginPage();
                break;
            case 'home':
                renderHomePage();
                break;
            case 'topic-selection':
                renderTopicSelectionPage();
                break;
            case 'daily-challenge':
                renderDailyChallengePagePage();
                break;
            case 'ai-help':
                renderAiHelpPage();
                break;
            case 'exam':
                renderExamSetupPage();
                break;
            case 'exam-session':
                renderExamSessionPage();
                break;
            case 'flashcards':
                renderFlashcardsPage();
                break;
            case 'profile':
                renderProfilePage();
                break;
            case 'quiz':
                renderQuizPage();
                break;
            default:
                renderHomePage();
        }
    }
    
    // Page Rendering Functions
    
    function renderLoginPage() {
        pageContainer.innerHTML = `
            <div class="page">
                <div class="login">
                    <h2>Login to Quiz Master</h2>
                    <form id="login-form">
                        <input type="text" id="username" placeholder="Username" required>
                        <input type="password" id="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add event listener for login form
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // For demo purposes, just check if username/password are not empty
        if (username && password) {
            // Check if user exists in local storage
            let user = localStorage.getItem(`user_${username}`);
            
            if (!user) {
                // Create new user if not exists
                user = {
                    username,
                    password,
                    totalScore: 0,
                    quizzesCompleted: 0,
                    correctAnswers: 0,
                    questionsAttempted: 0,
                    dailyStreak: 0
                };
                localStorage.setItem(`user_${username}`, JSON.stringify(user));
            } else {
                user = JSON.parse(user);
                // Check password
                if (user.password !== password) {
                    alert('Incorrect password!');
                    return;
                }
            }
            
            // Set current user and save to local storage
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update display and navigate to home
            updateUserDisplay();
            navigateTo('home');
        }
    }
    
    function logout() {
        localStorage.removeItem('currentUser');
        currentUser = null;
        updateUserDisplay();
        navigateTo('login');
    }
    
    function renderHomePage() {
        pageContainer.innerHTML = `
            <div class="page">
                <h2>Welcome to Quiz Master, ${currentUser.username}!</h2>
                <p>Choose from the options below to start your quiz journey:</p>
                <div class="topics" style="margin-top: 30px;">
                    <button data-page="topic-selection">
                        <i class="fas fa-list" style="margin-right: 10px;"></i>
                        Browse Quiz Topics
                    </button>
                    <button data-page="daily-challenge">
                        <i class="fas fa-calendar-day" style="margin-right: 10px;"></i>
                        Take Daily Challenge
                    </button>
                    <button data-page="exam">
                        <i class="fas fa-graduation-cap" style="margin-right: 10px;"></i>
                        Take Comprehensive Exam
                    </button>
                    <button data-page="profile">
                        <i class="fas fa-user" style="margin-right: 10px;"></i>
                        View Your Profile
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners for home page buttons
        document.querySelectorAll('.topics button').forEach(button => {
            button.addEventListener('click', () => {
                navigateTo(button.getAttribute('data-page'));
            });
        });
    }
    
    function renderTopicSelectionPage() {
        pageContainer.innerHTML = `
            <div class="page">
                <div class="topic-selection">
                    <h2>Select a Quiz Topic</h2>
                    <div class="topics" id="topics-container">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // For now, we'll use the hardcoded categories instead of fetching them
        renderHardcodedCategories();
    }
    
    function renderHardcodedCategories() {
        const topicsContainer = document.getElementById('topics-container');
        topicsContainer.innerHTML = '';
        
        // Loop through our hardcoded categories
        Object.keys(CATEGORIES).forEach(categoryId => {
            const categoryName = CATEGORIES[categoryId];
            
            // Create buttons for each difficulty
            ['easy', 'medium', 'hard'].forEach(difficulty => {
                const buttonElement = document.createElement('button');
                buttonElement.setAttribute('data-category', categoryId);
                buttonElement.setAttribute('data-difficulty', difficulty);
                buttonElement.innerHTML = `${categoryName} <span style="display:block; font-size:12px; margin-top:5px; opacity:0.8;">(${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})</span>`;
                
                buttonElement.addEventListener('click', () => {
                    startQuiz(categoryId, difficulty, categoryName);
                });
                
                topicsContainer.appendChild(buttonElement);
            });
        });
    }
    
    function renderDailyChallengePagePage() {
        pageContainer.innerHTML = `
            <div class="page">
                <div class="daily-challenge">
                    <h2>Daily Challenge</h2>
                    <div class="streak-info">
                        <i class="fas fa-fire"></i> Current streak: <span id="daily-streak">${currentUser.dailyStreak || 0}</span> days
                    </div>
                    <div id="daily-quiz-content" class="quiz-content">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Check if daily challenge already completed today
        const lastDailyDate = localStorage.getItem(`lastDaily_${currentUser.username}`);
        const today = new Date().toDateString();
        
        if (lastDailyDate === today) {
            document.getElementById('daily-quiz-content').innerHTML = `
                <div class="feedback correct">
                    <i class="fas fa-check-circle"></i> You've already completed today's challenge. Come back tomorrow for a new one!
                </div>
            `;
        } else {
            // Fetch a random question for daily challenge
            fetchDailyChallenge();
        }
    }
    
    function renderProfilePage() {
        const userStats = getUserStats();
        
        pageContainer.innerHTML = `
            <div class="page">
                <div class="profile">
                    <h2>Your Profile</h2>
                    <div class="stats">
                        <div>Total Score: <span id="total-score">${userStats.totalScore}</span></div>
                        <div>Quizzes Completed: <span id="quizzes-completed">${userStats.quizzesCompleted}</span></div>
                        <div>Exams Taken: <span id="exams-taken">${userStats.examsTaken}</span></div>
                        <div>Average Exam Score: <span id="avg-exam-score">${userStats.averageExamScore}%</span></div>
                        <div>Daily Streak: <span id="daily-streak">${userStats.dailyStreak}</span></div>
                        <div>Correct Answers: <span id="correct-answers">${userStats.correctAnswers}</span></div>
                        <div>Questions Attempted: <span id="questions-attempted">${userStats.questionsAttempted}</span></div>
                        <div>Accuracy: <span id="accuracy">${userStats.accuracy}%</span></div>
                    </div>
                    
                    ${userStats.examsTaken > 0 ? `
                    <div class="exam-history">
                        <h3>Exam History</h3>
                        <table class="exam-history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Topics</th>
                                    <th>Difficulty</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${currentUser.examHistory.map(exam => `
                                    <tr>
                                        <td>${new Date(exam.date).toLocaleDateString()}</td>
                                        <td>${exam.topics.join(', ')}</td>
                                        <td>${exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}</td>
                                        <td>${exam.scorePercent}%</td>
                                        <td class="grade ${exam.grade}">${exam.grade}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    function renderQuizPage() {
        if (!currentQuizData) {
            navigateTo('topic-selection');
            return;
        }
        
        // Update progress tracker
        updateProgressTracker();
        
        // Check if quiz is completed
        if (currentQuestionIndex >= currentQuizData.questions.length) {
            renderQuizResults();
            return;
        }
        
        pageContainer.innerHTML = `
            <div class="page">
                <div class="quiz-container">
                    <h2 id="quiz-title">${currentQuizData.categoryName} (${currentQuizData.difficulty.charAt(0).toUpperCase() + currentQuizData.difficulty.slice(1)})</h2>
                    <div class="quiz-content" id="quiz-content">
                        <div class="loading">
                            <div class="loading-spinner"></div>
                        </div>
                    </div>
                    <button class="next-btn" id="next-btn" style="display: none;">Next Question</button>
                </div>
            </div>
        `;
        
        // Display the current question
        displayCurrentQuestion();
        
        // Add event listener for next button
        document.getElementById('next-btn').addEventListener('click', handleNextQuestion);
    }
    
    function renderQuizResults() {
        // Calculate percentage score
        const totalQuestions = currentQuizData.questions.length;
        const scorePercent = Math.round((currentScore / totalQuestions) * 100);
        
        pageContainer.innerHTML = `
            <div class="page">
                <div class="quiz-results">
                    <h2>Quiz Completed!</h2>
                    <div class="score-display">
                        Your Score:
                        <span class="score-value">${currentScore}/${totalQuestions} (${scorePercent}%)</span>
                    </div>
                    <button id="home-btn">Back to Home</button>
                    <button id="topics-btn">Try Another Quiz</button>
                </div>
            </div>
        `;
        
        // Update user stats
        updateUserStats({
            quizzesCompleted: 1,
            questionsAttempted: totalQuestions,
            correctAnswers: currentScore,
            totalScore: currentScore * 10
        });
        
        // Add event listeners for buttons
        document.getElementById('home-btn').addEventListener('click', () => navigateTo('home'));
        document.getElementById('topics-btn').addEventListener('click', () => navigateTo('topic-selection'));
    }
    
    // Quiz Functions
    
    async function fetchQuestions(category, difficulty, amount = 10) {
        try {
            const url = `${API_BASE_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
            console.log("Fetching from URL:", url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("API Response:", data);
            
            if (data.response_code === 0 && data.results && data.results.length > 0) {
                return data.results;
            } else {
                throw new Error(`API Error: ${data.response_code}`);
            }
        } catch (error) {
            console.error("Error fetching questions:", error);
            throw error;
        }
    }
    
    async function fetchDailyChallenge() {
        try {
            // Choose a random category and difficulty for daily challenge
            const categoryKeys = Object.keys(CATEGORIES);
            const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
            const randomDifficulty = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
            
            const url = `${API_BASE_URL}?amount=1&category=${randomCategory}&difficulty=${randomDifficulty}&type=multiple`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.response_code === 0 && data.results && data.results.length > 0) {
                renderDailyQuestion(data.results[0], CATEGORIES[randomCategory], randomDifficulty);
            } else {
                throw new Error('No questions received');
            }
        } catch (error) {
            console.error('Error fetching daily challenge:', error);
            document.getElementById('daily-quiz-content').innerHTML = `
                <div class="feedback incorrect">
                    <i class="fas fa-exclamation-circle"></i> Failed to load daily challenge. Please try again later.
                </div>
            `;
        }
    }
    
    function renderDailyQuestion(question, category, difficulty) {
        const dailyQuizContent = document.getElementById('daily-quiz-content');
    
        // Decode HTML entities and URL-encoded strings
        const questionText = decodeURIComponent(question.question);
        const correctAnswer = decodeURIComponent(question.correct_answer);
        const incorrectAnswers = question.incorrect_answers.map(a => decodeURIComponent(a));
    
        // Create options array with all answers
        const options = [...incorrectAnswers, correctAnswer];
    
        // Shuffle options
        shuffleArray(options);
    
        // Create HTML for options
        const optionsHTML = options.map(option => `
            <div class="option" data-option="${option}" data-correct="${option === correctAnswer}">
                ${option}
            </div>
        `).join('');
    
        // Update DOM
        dailyQuizContent.innerHTML = `
            <div style="margin-bottom: 15px;">
                <span style="font-weight: bold;">Category:</span> ${category} | 
                <span style="font-weight: bold;">Difficulty:</span> ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>
            <div class="question">${questionText}</div>
            <div class="options">
                ${optionsHTML}
            </div>
            <div class="feedback" id="daily-feedback"></div>
        `;
    
        // Add event listeners to options
        document.querySelectorAll('#daily-quiz-content .option').forEach(option => {
            option.addEventListener('click', handleDailyAnswer);
        });
    }

function handleDailyAnswer(e) {
const selectedOption = e.currentTarget;
const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
const feedbackElement = document.getElementById('daily-feedback');

// Disable all options
document.querySelectorAll('#daily-quiz-content .option').forEach(opt => {
    opt.style.pointerEvents = 'none';
    
    // Highlight correct and incorrect answers
    if (opt.getAttribute('data-correct') === 'true') {
        opt.classList.add('correct');
    } else if (opt === selectedOption && !isCorrect) {
        opt.classList.add('incorrect');
    }
});

// Show feedback
if (isCorrect) {
    feedbackElement.classList.add('correct');
    feedbackElement.innerHTML = '<i class="fas fa-check-circle"></i> Correct! Well done!';
    
    // Update streak
    updateDailyStreak(true);
} else {
    feedbackElement.classList.add('incorrect');
    feedbackElement.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect. Better luck tomorrow!';
    
    // Reset streak
    updateDailyStreak(false);
}

// Mark daily challenge as completed for today
const today = new Date().toDateString();
localStorage.setItem(`lastDaily_${currentUser.username}`, today);
}

function updateDailyStreak(continued) {
if (continued) {
    // Increment streak
    currentUser.dailyStreak = (currentUser.dailyStreak || 0) + 1;
} else {
    // Reset streak
    currentUser.dailyStreak = 0;
}

// Update streak display
document.getElementById('daily-streak').textContent = currentUser.dailyStreak;

// Save updated user data
localStorage.setItem(`user_${currentUser.username}`, JSON.stringify(currentUser));
localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function startQuiz(categoryId, difficulty, categoryName) {
// Reset quiz state
currentQuestionIndex = 0;
currentScore = 0;
questionsAnswered = 0;

// Show loading state
pageContainer.innerHTML = `
    <div class="page">
        <div class="loading">
            <div class="loading-spinner"></div>
            <p style="margin-top: 15px;">Loading quiz questions...</p>
        </div>
    </div>
`;

// Fetch questions
fetchQuestions(categoryId, difficulty)
    .then(questions => {
        // Store quiz data
        currentQuizData = {
            categoryId,
            categoryName,
            difficulty,
            questions,
            startTime: new Date()
        };
        
        // Navigate to quiz page
        navigateTo('quiz');
    })
    .catch(error => {
        pageContainer.innerHTML = `
            <div class="page">
                <div class="feedback incorrect" style="display: block;">
                    <i class="fas fa-exclamation-circle"></i> Failed to load quiz questions. Please try again.
                    <p style="margin-top: 10px;">${error.message}</p>
                </div>
                <button id="back-btn" style="margin-top: 20px;">Back to Topics</button>
            </div>
        `;
        
        document.getElementById('back-btn').addEventListener('click', () => {
            navigateTo('topic-selection');
        });
    });
}

function displayCurrentQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const currentQuestion = currentQuizData.questions[currentQuestionIndex];

    // Decode HTML entities and URL-encoded strings
    const questionText = decodeURIComponent(currentQuestion.question);
    const correctAnswer = decodeURIComponent(currentQuestion.correct_answer);
    const incorrectAnswers = currentQuestion.incorrect_answers.map(a => decodeURIComponent(a));

    // Create options array with all answers
    const options = [...incorrectAnswers, correctAnswer];

    // Shuffle options
    shuffleArray(options);

    // Create HTML for options
    const optionsHTML = options.map(option => `
        <div class="option" data-option="${option}" data-correct="${option === correctAnswer}">
            ${option}
        </div>
    `).join('');

    // Update DOM
    quizContent.innerHTML = `
        <div class="question-number">Question ${currentQuestionIndex + 1} of ${currentQuizData.questions.length}</div>
        <div class="question">${questionText}</div>
        <div class="options">
            ${optionsHTML}
        </div>
        <div class="feedback" id="question-feedback"></div>
    `;

    // Add event listeners to options
    document.querySelectorAll('#quiz-content .option').forEach(option => {
        option.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
const selectedOption = e.currentTarget;
const isCorrect = selectedOption.getAttribute('data-correct') === 'true';
const feedbackElement = document.getElementById('question-feedback');

// Disable all options
document.querySelectorAll('#quiz-content .option').forEach(opt => {
    opt.style.pointerEvents = 'none';
    
    // Highlight correct and incorrect answers
    if (opt.getAttribute('data-correct') === 'true') {
        opt.classList.add('correct');
    } else if (opt === selectedOption && !isCorrect) {
        opt.classList.add('incorrect');
    }
});

// Show feedback
if (isCorrect) {
    feedbackElement.classList.add('correct');
    feedbackElement.innerHTML = '<i class="fas fa-check-circle"></i> Correct!';
    currentScore++;
} else {
    feedbackElement.classList.add('incorrect');
    feedbackElement.innerHTML = '<i class="fas fa-times-circle"></i> Incorrect. The correct answer is: ' + 
        document.querySelector('#quiz-content .option[data-correct="true"]').textContent;
}

// Update progress
questionsAnswered++;
updateProgressTracker();

// Show next button
document.getElementById('next-btn').style.display = 'block';
}

function handleNextQuestion() {
currentQuestionIndex++;
navigateTo('quiz');
}

function updateProgressTracker() {
const progressTracker = document.querySelector('.progress-tracker .circle');
const progressDisplay = document.querySelector('.progress-tracker .inner');

if (currentQuizData) {
    const totalQuestions = currentQuizData.questions.length;
    const progress = (questionsAnswered / totalQuestions) * 100;
    
    progressTracker.style.setProperty('--progress', `${progress}%`);
    progressDisplay.textContent = `${Math.round(progress)}%`;
} else {
    progressTracker.style.setProperty('--progress', '0%');
    progressDisplay.textContent = '0%';
}
}

function getUserStats() {
    // Calculate accuracy
    const accuracy = currentUser.questionsAttempted > 0 
        ? Math.round((currentUser.correctAnswers / currentUser.questionsAttempted) * 100) 
        : 0;

    // Count exams taken
    const examsTaken = currentUser.examHistory ? currentUser.examHistory.length : 0;
    
    // Calculate average exam score
    let averageExamScore = 0;
    if (examsTaken > 0) {
        const totalExamScore = currentUser.examHistory.reduce((sum, exam) => sum + exam.scorePercent, 0);
        averageExamScore = Math.round(totalExamScore / examsTaken);
    }
    
    return {
        totalScore: currentUser.totalScore || 0,
        quizzesCompleted: currentUser.quizzesCompleted || 0,
        dailyStreak: currentUser.dailyStreak || 0,
        correctAnswers: currentUser.correctAnswers || 0,
        questionsAttempted: currentUser.questionsAttempted || 0,
        examsTaken: examsTaken,
        averageExamScore: averageExamScore,
        accuracy
    };
}

function updateUserStats(stats) {
// Update user stats
currentUser.totalScore = (currentUser.totalScore || 0) + (stats.totalScore || 0);
currentUser.quizzesCompleted = (currentUser.quizzesCompleted || 0) + (stats.quizzesCompleted || 0);
currentUser.correctAnswers = (currentUser.correctAnswers || 0) + (stats.correctAnswers || 0);
currentUser.questionsAttempted = (currentUser.questionsAttempted || 0) + (stats.questionsAttempted || 0);

// Save updated user data
localStorage.setItem(`user_${currentUser.username}`, JSON.stringify(currentUser));
localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Utility functions
function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
return array;
}



        // Pomodoro Timer Logic
        let pomodoroMinutes = 25;
        let pomodoroSeconds = 0;
        let isPaused = true;
        let isSession = true;
        let interval;
        
        const minutesElement = document.getElementById("pomodoro-minutes");
        const secondsElement = document.getElementById("pomodoro-seconds");
        const timerDisplay = document.getElementById("timer-display");
        const startButton = document.getElementById("pomodoro-start");
        const pauseButton = document.getElementById("pomodoro-pause");
        const resetButton = document.getElementById("pomodoro-reset");
        const sessionTimeInput = document.getElementById("session-time");
        const breakTimeInput = document.getElementById("break-time");
        const applySettingsButton = document.getElementById("apply-settings");
        const timerModal = document.getElementById("timer-modal");
        
        // Open and Close Modal
        function openTimerModal() {
            timerModal.style.display = "flex";
        }
        
        function closeTimerModal() {
            timerModal.style.display = "none";
        }
        
        // Timer Functions
        function startTimer() {
            if (isPaused) {
                isPaused = false;
                interval = setInterval(updateTimer, 1000);
            }
        }
        
        function pauseTimer() {
            if (!isPaused) {
                isPaused = true;
                clearInterval(interval);
            }
        }
        
        function resetTimer() {
            clearInterval(interval);
            isPaused = true;
            isSession = true;
            pomodoroMinutes = parseInt(sessionTimeInput.value);
            pomodoroSeconds = 0;
            updateDisplay();
        }
        
        function updateTimer() {
            if (pomodoroSeconds === 0) {
                if (pomodoroMinutes === 0) {
                    // Switch between session and break
                    if (isSession) {
                        isSession = false;
                        pomodoroMinutes = parseInt(breakTimeInput.value);
                    } else {
                        isSession = true;
                        pomodoroMinutes = parseInt(sessionTimeInput.value);
                    }
                } else {
                    pomodoroMinutes--;
                    pomodoroSeconds = 59;
                }
            } else {
                pomodoroSeconds--;
            }
            updateDisplay();
        }
        
        function updateDisplay() {
            minutesElement.textContent = String(pomodoroMinutes).padStart(2, "0");
            secondsElement.textContent = String(pomodoroSeconds).padStart(2, "0");
            timerDisplay.textContent = `${String(pomodoroMinutes).padStart(2, "0")}:${String(pomodoroSeconds).padStart(2, "0")}`;
        }
        
        // Apply Settings
        applySettingsButton.addEventListener("click", () => {
            pomodoroMinutes = parseInt(sessionTimeInput.value);
            pomodoroSeconds = 0;
            updateDisplay();
        });
        
        // Event Listeners
        startButton.addEventListener("click", startTimer);
        pauseButton.addEventListener("click", pauseTimer);
        resetButton.addEventListener("click", resetTimer);
        
        // Initialize Timer Display
        updateDisplay();





// OpenRouter API Integration with DeepSeek model
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = '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';

function renderAiHelpPage() {
    pageContainer.innerHTML = `
        <div class="page">
            <div class="ai-help">
                <h2>AI Quiz Assistant</h2>
                <p>Ask any question about quizzes, topics, or get help with difficult questions:</p>
                <div class="ai-chat-container">
                    <div class="ai-chat-messages" id="ai-chat-messages">
                        <div class="message ai-message">
                            <div class="ai-avatar">🤖</div>
                            <div class="ai-content">
                                Hello! I'm your Quiz Assistant. How can I help you with your quiz questions today?
                            </div>
                        </div>
                        <div class="typing-indicator" id="typing-indicator">
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                    </div>
                    <div class="ai-chat-input">
                        <input type="text" id="ai-input" placeholder="Type your question here...">
                        <button id="ai-send-btn">Send</button>
                    </div>
                </div>
            </div>
        </div>
        <style>
            .ai-chat-container {
                border-radius: 10px;
                background-color: #f5f7fa;
                height:75vh;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .ai-chat-messages {
                height: 400px;
                overflow-y: auto;
                padding: 16px;
                background-color: #ffffff;
            }
            
            .message {
                margin-bottom: 16px;
                max-width: 80%;
                clear: both;
                overflow-wrap: break-word;
            }
            
            .user-message {
                float: right;
                background-color: #1e88e5;
                color: white;
                border-radius: 18px 18px 0 18px;
                padding: 12px 16px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            
            .ai-message {
                float: left;
                width: 85%;
                display: flex;
                align-items: flex-start;
            }
            
            .ai-avatar {
                background-color: #6a11cb;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                flex-shrink: 0;
            }
            
            .ai-content {
                background-color: #f0f2f5;
                border-radius: 0 18px 18px 18px;
                padding: 12px 16px;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                color: #333;
                line-height: 1.5;
            }
            
            .ai-content h3 {
                margin-top: 8px;
                margin-bottom: 8px;
                color: #4527a0;
                font-weight: 600;
            }
            
            .ai-content strong {
                color: #303f9f;
                font-weight: 600;
            }
            
            .ai-content ul, .ai-content ol {
                padding-left: 20px;
                margin: 8px 0;
            }
            
            .ai-content code {
                background-color: #e8eaf6;
                padding: 2px 4px;
                border-radius: 4px;
                font-family: monospace;
                color: #d81b60;
            }
            
            .ai-content pre {
                background-color: #263238;
                color: #eeffff;
                padding: 12px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 8px 0;
            }
            
            .ai-content pre code {
                background-color: transparent;
                color: inherit;
                padding: 0;
            }
            
            .typing-indicator {
                display: none;
                padding: 12px 16px;
                background-color: #f0f2f5;
                border-radius: 18px;
                width: 60px;
                margin-bottom: 16px;
                float: left;
                clear: both;
            }
            
            .typing-indicator span {
                height: 8px;
                width: 8px;
                float: left;
                margin: 0 1px;
                background-color: #9e9ea1;
                display: block;
                border-radius: 50%;
                opacity: 0.4;
                animation: blink 1.4s infinite both;
            }
            
            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes blink {
                0% { opacity: 0.4; }
                20% { opacity: 1; }
                100% { opacity: 0.4; }
            }
            
            .ai-chat-input {
                display: flex;
                padding: 12px;
                border-top: 1px solid #e0e0e0;
                background-color: #ffffff;
            }
            
            .ai-chat-input input {
                flex-grow: 1;
                border: 1px solid #e0e0e0;
                border-radius: 24px;
                padding: 10px 16px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s;
            }
            
            .ai-chat-input input:focus {
                border-color: #1e88e5;
                box-shadow: 0 0 0 2px rgba(30,136,229,0.2);
            }
            
            .ai-chat-input button {
                background-color: #1e88e5;
                color: white;
                border: none;
                border-radius: 24px;
                padding: 10px 20px;
                margin-left: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            }
            
            .ai-chat-input button:hover {
                background-color: #1976d2;
            }
        </style>
    `;
    
    // Add event listeners
    document.getElementById('ai-send-btn').addEventListener('click', sendAiMessage);
    document.getElementById('ai-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendAiMessage();
        }
    });
}

function sendAiMessage() {
    const inputElement = document.getElementById('ai-input');
    const userMessage = inputElement.value.trim();
    
    if (!userMessage) return;
    
    // Clear input
    inputElement.value = '';
    
    // Add user message to chat
    addMessageToChat(userMessage, 'user');
    
    // Show typing indicator
    document.getElementById('typing-indicator').style.display = 'block';
    
    // Call OpenRouter API with DeepSeek model
    fetchAiResponse(userMessage)
        .then(response => {
            // Hide typing indicator
            document.getElementById('typing-indicator').style.display = 'none';
            
            // Add AI response to chat
            addMessageToChat(response, 'ai');
        })
        .catch(error => {
            // Hide typing indicator
            document.getElementById('typing-indicator').style.display = 'none';
            
            // Add error message to chat
            addMessageToChat('Sorry, I encountered an error. Please try again later.', 'ai');
            console.error('OpenRouter API Error:', error);
        });
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('ai-chat-messages');
    const messageElement = document.createElement('div');
    
    messageElement.classList.add('message');
    
    if (sender === 'user') {
        messageElement.classList.add('user-message');
        messageElement.textContent = message;
    } else {
        messageElement.classList.add('ai-message');
        
        // Create avatar and content container for AI messages
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('ai-avatar');
        avatarDiv.textContent = '🤖';
        
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('ai-content');
        
        // Process markdown-style formatting
        let processedMessage = message
            // Escape HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Handle code blocks with ```
        processedMessage = processedMessage.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Handle inline code with `
        processedMessage = processedMessage.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Handle headers: # Header text
        processedMessage = processedMessage.replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>');
        processedMessage = processedMessage.replace(/^##\s+(.*?)$/gm, '<h3>$1</h3>');
        processedMessage = processedMessage.replace(/^#\s+(.*?)$/gm, '<h3>$1</h3>');
        
        // Handle bold: **text** or __text__
        processedMessage = processedMessage.replace(/\*\*(.*?)\*\*|__(.*?)__/g, function(match, p1, p2) {
            return `<strong>${p1 || p2}</strong>`;
        });
        
        // Handle italic: *text* or _text_
        processedMessage = processedMessage.replace(/\b\*([^*]+)\*\b|\b_([^_]+)_\b/g, function(match, p1, p2) {
            return `<em>${p1 || p2}</em>`;
        });
        
        // Process lists
        let inList = false;
        let listType = '';
        const lines = processedMessage.split('\n');
        processedMessage = lines.map((line, index) => {
            // Ordered list: 1. item
            if (line.match(/^\d+\.\s+(.*?)$/)) {
                const listItem = line.replace(/^\d+\.\s+(.*?)$/, '$1');
                if (!inList || listType !== 'ol') {
                    inList = true;
                    listType = 'ol';
                    return `<ol><li>${listItem}</li>`;
                } else {
                    return `<li>${listItem}</li>`;
                }
            }
            // Unordered list: - item or * item
            else if (line.match(/^[-*]\s+(.*?)$/)) {
                const listItem = line.replace(/^[-*]\s+(.*?)$/, '$1');
                if (!inList || listType !== 'ul') {
                    inList = true;
                    listType = 'ul';
                    return `<ul><li>${listItem}</li>`;
                } else {
                    return `<li>${listItem}</li>`;
                }
            } 
            // Not a list item
            else {
                if (inList) {
                    inList = false;
                    return `</${listType}>${line}`;
                } else {
                    return line;
                }
            }
        }).join('\n');
        
        // Close list if still open
        if (inList) {
            processedMessage += `</${listType}>`;
        }
        
        // Handle line breaks
        processedMessage = processedMessage.replace(/\n/g, '<br>');
        
        contentDiv.innerHTML = processedMessage;
        
        messageElement.appendChild(avatarDiv);
        messageElement.appendChild(contentDiv);
    }
    
    // Insert before typing indicator
    messagesContainer.insertBefore(messageElement, document.getElementById('typing-indicator'));
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function fetchAiResponse(userMessage) {
    try {
        // Make actual API call to OpenRouter using DeepSeek model
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin, // Current site URL
                "X-Title": "Quiz Master", // Site title
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "deepseek/deepseek-r1:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful quiz assistant. Provide concise, educational answers to help users with their quiz questions and topics. Focus on explanations that teach concepts rather than just giving answers. Use markdown formatting like **bold**, *italic*, and bullet points to make your answers easy to read and visually appealing."
                    },
                    {
                        "role": "user",
                        "content": userMessage
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling OpenRouter API:", error);
        
        // Fallback to mock responses for testing or when API fails
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Return mock responses with markdown formatting for testing
        if (userMessage.toLowerCase().includes('help')) {
            return "I can help you with quiz topics in several ways:\n\n**Study Resources:**\n- Practice questions and explanations\n- Concept summaries\n- Memory techniques\n\n**Topic Areas:**\n1. General Knowledge\n2. Science subjects\n3. History and geography\n4. Literature and arts\n\nWhat specific area are you looking for help with?";
        } else if (userMessage.toLowerCase().includes('quiz')) {
            return "# Quiz Categories\n\nOur quizzes cover **various topics** including:\n\n- **Science**: Physics, Chemistry, Biology\n- **History**: World events, Ancient civilizations\n- **Literature**: Classic works, Authors, Literary devices\n- **Mathematics**: Algebra, Geometry, Calculus\n- **General Knowledge**: Current affairs, Geography\n\nWhich category interests you the most?";
        } else {
            return "That's an interesting question! Let me think about how I can help you best.\n\n**For effective quiz preparation**, I recommend:\n\n1. **Active recall** - test yourself regularly\n2. **Spaced repetition** - review material at increasing intervals\n3. **Concept mapping** - connect related ideas visually\n\nWould you like more specific strategies for a particular subject area?";
        }
    }
}

async function fetchQuizApiQuestions(topics, difficulty, limit = 10) {
    const questionsPerTopic = Math.max(1, Math.floor(limit / topics.length));
    let questions = [];
  
    for (const topic of topics) {
      // Use the topic.id directly as the category parameter
      // This is the key from QUIZAPI_CATEGORIES that the user selected
      const params = new URLSearchParams({
        apiKey: QUIZAPI_KEY,
        category: topic.id, // Use the key name directly
        difficulty: difficulty === 'mixed' 
          ? QUIZAPI_DIFFICULTIES[Math.floor(Math.random() * 3)]
          : difficulty,
        limit: questionsPerTopic
      });
  
      console.log(`Fetching questions for ${topic.name} with params:`, params.toString());
      
      const response = await fetch(`${QUIZAPI_URL}?${params}`);
      if (!response.ok) {
        console.error(`QuizAPI error: ${response.status}`);
        throw new Error(`QuizAPI error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Received data for ${topic.name}:`, data);
      
      // Process the QuizAPI format
      const processedQuestions = data.map(q => {
        // Find which answer is correct
        const correctAnswerKey = Object.keys(q.correct_answers || {})
          .find(key => q.correct_answers[key] === "true");
        
        // Get the actual correct answer text (remove "_correct" from key)
        const answerKey = correctAnswerKey ? correctAnswerKey.replace("_correct", "") : null;
        const correctAnswer = answerKey ? q.answers[answerKey] : null;
        
        // Get incorrect answers
        const incorrectAnswers = Object.keys(q.answers || {})
          .filter(key => q.answers[key] && (!answerKey || key !== answerKey))
          .map(key => q.answers[key]);
        
        return {
          id: q.id,
          question: q.question,
          correct_answer: correctAnswer,
          incorrect_answers: incorrectAnswers,
          answers: q.answers, // Keep original answers object for reference
          multiple_correct_answers: q.multiple_correct_answers === "true",
          topicName: topic.name,
          points: 10
        };
      });
      
      questions.push(...processedQuestions);
    }
  
    // Shuffle questions if we have more than the limit
    if (questions.length > limit) {
      questions = questions.sort(() => 0.5 - Math.random()).slice(0, limit);
    }
  
    return questions;
  }


function renderExamSetupPage() {
    pageContainer.innerHTML = `
      <div class="page">
        <div class="exam-setup">
          <h2>Technical Skills Exam</h2>
          <p>Test your knowledge with industry-relevant questions. Select  topics:</p>
          
          <div class="exam-settings">
            <h3>Technical Topics</h3>
            <div class="topic-selection-grid" id="exam-topics-grid">
              ${Object.entries(QUIZAPI_CATEGORIES).map(([id, name]) => `
                <div class="topic-checkbox-item">
                  <input type="checkbox" id="exam-topic-${id}" data-category="${id}">
                  <label for="exam-topic-${id}">${name}</label>
                </div>
              `).join('')}
            </div>
            
            <div class="exam-difficulty">
              <h3>Difficulty</h3>
              <select id="exam-difficulty">
                ${QUIZAPI_DIFFICULTIES.map(diff => `
                  <option value="${diff}">${diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                `).join('')}
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <button id="start-exam-btn" disabled>Start Exam</button>
          </div>
        </div>
      </div>
    `;
  
    // Add event listeners
    document.querySelectorAll('#exam-topics-grid input[type="checkbox"]')
      .forEach(checkbox => {
        checkbox.addEventListener('change', updateExamStartButton);
      });
  
    document.getElementById('start-exam-btn')
      .addEventListener('click', startExam);
  }

function populateExamTopicsGrid() {
    const topicsGrid = document.getElementById('exam-topics-grid');
    topicsGrid.innerHTML = '';
  
    // Use QUIZAPI_CATEGORIES instead of CATEGORIES
    Object.keys(QUIZAPI_CATEGORIES).forEach(categoryId => {
      const topicElement = document.createElement('div');
      topicElement.className = 'topic-checkbox-item';
      topicElement.innerHTML = `
        <input type="checkbox" id="exam-topic-${categoryId}" 
               data-category="${categoryId}">
        <label for="exam-topic-${categoryId}">
          ${QUIZAPI_CATEGORIES[categoryId]}
        </label>
      `;
      topicsGrid.appendChild(topicElement);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('#exam-topics-grid input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateStartButtonState);
    });
}

function updateExamStartButton() {
    const checkedCount = document.querySelectorAll('#exam-topics-grid input[type="checkbox"]:checked').length;
    document.getElementById('start-exam-btn').disabled = checkedCount < 1;
  }
  async function startExam() {
    const selectedTopics = Array.from(
      document.querySelectorAll('#exam-topics-grid input[type="checkbox"]:checked')
    ).map(checkbox => ({
      id: checkbox.dataset.category,
      name: QUIZAPI_CATEGORIES[checkbox.dataset.category]
    }));
  
    const difficulty = document.getElementById('exam-difficulty').value;
    
    console.log("Starting exam with topics:", selectedTopics);
    console.log("Difficulty:", difficulty);
  
    // Show loading state
    pageContainer.innerHTML = `
      <div class="page">
        <div class="loading">
          <div class="loading-spinner"></div>
          <p>Preparing your technical exam...</p>
        </div>
      </div>
    `;
  
    try {
      const questions = await fetchQuizApiQuestions(selectedTopics, difficulty);
      console.log("Fetched questions:", questions);
      
      if (questions.length === 0) {
        throw new Error("No questions returned from API");
      }
      
      localStorage.setItem('currentExamQuestions', JSON.stringify(questions));
      localStorage.setItem('examStartTime', new Date().toISOString());
      localStorage.setItem('currentExamConfig', JSON.stringify({
        topics: selectedTopics,
        difficulty,
        totalTime: 60 // minutes
      }));
  
      navigateTo('exam-session');
    } catch (error) {
      console.error("Error starting exam:", error);
      pageContainer.innerHTML = `
        <div class="page">
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load exam questions: ${error.message}</p>
            <button id="retry-btn">Retry</button>
          </div>
        </div>
      `;
      document.getElementById('retry-btn').addEventListener('click', renderExamSetupPage);
    }
  }
async function fetchExamQuestions(examConfig) {
    try {
        // Show loading state
        pageContainer.innerHTML = `
            <div class="page">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p style="margin-top: 15px;">Preparing your exam questions...</p>
                </div>
            </div>
        `;
        
        // Calculate questions per topic
        const questionsPerTopic = Math.floor(10 / examConfig.topics.length);
        let remainingQuestions = 10 - (questionsPerTopic * examConfig.topics.length);
        
        // Array to hold all promises
        const fetchPromises = [];
        const examQuestions = [];
        
        // Fetch questions for each topic
        for (const topic of examConfig.topics) {
            const questions = questionsPerTopic + (remainingQuestions > 0 ? 1 : 0);
            if (remainingQuestions > 0) remainingQuestions--;
            
            // If difficulty is mixed, randomly select a difficulty
            let diff = examConfig.difficulty;
            if (diff === 'mixed') {
                const difficulties = ['easy', 'medium', 'hard'];
                diff = difficulties[Math.floor(Math.random() * difficulties.length)];
            }
            
            // Create and execute the fetch promise
            const promise = fetchQuestions(topic.id, diff, questions)
                .then(result => {
                    // Add topic name to each question
                    result.forEach(question => {
                        question.topicName = topic.name;
                        examQuestions.push(question);
                    });
                });
            
            fetchPromises.push(promise);
        }
        
        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
        
        // Assign point value to each question
        const pointsPerQuestion = Math.floor(examConfig.totalMarks / examQuestions.length);
        let remainingPoints = examConfig.totalMarks - (pointsPerQuestion * examQuestions.length);
        
        examQuestions.forEach(question => {
            question.points = pointsPerQuestion + (remainingPoints > 0 ? 1 : 0);
            if (remainingPoints > 0) remainingPoints--;
        });
        
        // Store exam questions
        localStorage.setItem('currentExamQuestions', JSON.stringify(examQuestions));
        
        // Set exam start time
        localStorage.setItem('examStartTime', new Date().toISOString());
        
        return examQuestions;
    } catch (error) {
        console.error('Error fetching exam questions:', error);
        throw error;
    }
}

function renderExamSessionPage() {
    // Get exam config and questions
    const examConfig = JSON.parse(localStorage.getItem('currentExamConfig'));
    const examQuestions = JSON.parse(localStorage.getItem('currentExamQuestions'));
    const startTime = new Date(localStorage.getItem('examStartTime'));
    const currentTime = new Date();
    
    // Calculate total seconds remaining (60 minutes = 3600 seconds)
    const totalSecondsAllowed = examConfig.totalTime * 60;
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    let remainingSeconds = totalSecondsAllowed - elapsedSeconds;
    
    // Check if time's up
    if (remainingSeconds <= 0) {
        submitExam();
        return;
    }
    
    // Calculate minutes and seconds for display
    const remainingMinutes = Math.floor(remainingSeconds / 60);
    const displaySeconds = remainingSeconds % 60;
    
    // Check if mandatory submission time (50 minutes) has been reached
    const mandatorySubmissionReached = elapsedSeconds >= (examConfig.mandatorySubmissionTime * 60);
    
    // Get saved answers
    let examAnswers = localStorage.getItem('currentExamAnswers');
    if (!examAnswers) {
        examAnswers = Array(examQuestions.length).fill(null);
        localStorage.setItem('currentExamAnswers', JSON.stringify(examAnswers));
    } else {
        examAnswers = JSON.parse(examAnswers);
    }
    
    // Get current question index
    let currentExamQuestionIndex = localStorage.getItem('currentExamQuestionIndex');
    if (!currentExamQuestionIndex) {
        currentExamQuestionIndex = 0;
        localStorage.setItem('currentExamQuestionIndex', currentExamQuestionIndex);
    } else {
        currentExamQuestionIndex = parseInt(currentExamQuestionIndex);
    }
    
    // Render exam page
    pageContainer.innerHTML = `
        <div class="page">
            <div class="exam-session">
                <div class="exam-header">
                    <h2>Comprehensive Exam</h2>
                    <div class="exam-timer ${remainingMinutes <= 10 ? 'warning' : ''}">
                        <i class="fas fa-clock"></i>
                        <span id="exam-time-remaining">${String(remainingMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}</span>
                        ${mandatorySubmissionReached ? 
                            '<span class="mandatory-submission-notice">Mandatory submission time reached</span>' : ''}
                    </div>
                </div>
                
                <div class="exam-navigation">
                    <div class="question-numbers" id="question-numbers">
                        ${examQuestions.map((q, index) => 
                            `<div class="question-number ${index === currentExamQuestionIndex ? 'current' : ''} ${examAnswers[index] !== null ? 'answered' : ''}" 
                                  data-index="${index}">${index + 1}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="exam-question-container" id="exam-question-container">
                    <!-- Question will be displayed here -->
                </div>
                
                <div class="exam-controls">
                    <button id="prev-question" ${currentExamQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button id="next-question" ${currentExamQuestionIndex === examQuestions.length - 1 ? 'disabled' : ''}>Next</button>
                    <button id="submit-exam" ${!mandatorySubmissionReached ? 'disabled' : ''} class="${mandatorySubmissionReached ? 'highlight' : ''}">
                        ${mandatorySubmissionReached ? 'Submit Exam (Required)' : 'Submit Exam (Available after 30 minutes)'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Display current question
    displayExamQuestion(currentExamQuestionIndex);
    
    // Set up exam timer
    startExamTimer(totalSecondsAllowed, elapsedSeconds, examConfig.mandatorySubmissionTime * 60);
    
    // Add event listeners
    document.getElementById('prev-question').addEventListener('click', () => navigateExamQuestion('prev'));
    document.getElementById('next-question').addEventListener('click', () => navigateExamQuestion('next'));
    document.getElementById('submit-exam').addEventListener('click', submitExam);
    
    // Add event listeners to question numbers
    document.querySelectorAll('.question-number').forEach(numEl => {
        numEl.addEventListener('click', () => {
            const index = parseInt(numEl.getAttribute('data-index'));
            navigateExamQuestion(index);
        });
    });
}

function displayExamQuestion(index) {
    const examQuestions = JSON.parse(localStorage.getItem('currentExamQuestions'));
    const examAnswers = JSON.parse(localStorage.getItem('currentExamAnswers'));
    const question = examQuestions[index];
    
    // Decode HTML entities and URL-encoded strings
    const questionText = decodeURIComponent(question.question);
    const correctAnswer = decodeURIComponent(question.correct_answer);
    const incorrectAnswers = question.incorrect_answers.map(a => decodeURIComponent(a));
    
    // Create options array with all answers
    const options = [...incorrectAnswers, correctAnswer];
    
    // Shuffle options
    shuffleArray(options);
    
    // Create HTML for options
    const optionsHTML = options.map(option => `
        <div class="option exam-option ${examAnswers[index] === option ? 'selected' : ''}" data-option="${option}">
            ${option}
        </div>
    `).join('');
    
    // Update container
    const container = document.getElementById('exam-question-container');
    container.innerHTML = `
        <div class="exam-question-header">
            <div class="question-info">
                <span class="question-number-display">Question ${index + 1} of ${examQuestions.length}</span>
                <span class="question-topic">${question.topicName}</span>
                <span class="question-points">${question.points} points</span>
            </div>
        </div>
        <div class="question">${questionText}</div>
        <div class="options">
            ${optionsHTML}
        </div>
    `;
    
    // Add event listeners to options
    document.querySelectorAll('.exam-option').forEach(option => {
        option.addEventListener('click', () => selectExamAnswer(index, option.getAttribute('data-option')));
    });
    
    // Update current index
    localStorage.setItem('currentExamQuestionIndex', index);
    
    // Update question number highlighting
    document.querySelectorAll('.question-number').forEach((numEl, i) => {
        if (i === index) {
            numEl.classList.add('current');
        } else {
            numEl.classList.remove('current');
        }
    });
}

function selectExamAnswer(questionIndex, answer) {
    // Get current answers
    const examAnswers = JSON.parse(localStorage.getItem('currentExamAnswers'));
    
    // Update answer
    examAnswers[questionIndex] = answer;
    
    // Save updated answers
    localStorage.setItem('currentExamAnswers', JSON.stringify(examAnswers));
    
    // Update UI
    document.querySelectorAll('.exam-option').forEach(option => {
        if (option.getAttribute('data-option') === answer) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update question number indicators
    document.querySelectorAll('.question-number')[questionIndex].classList.add('answered');
}

function navigateExamQuestion(direction) {
    const examQuestions = JSON.parse(localStorage.getItem('currentExamQuestions'));
    let currentIndex = parseInt(localStorage.getItem('currentExamQuestionIndex'));
    
    if (direction === 'prev' && currentIndex > 0) {
        currentIndex--;
    } else if (direction === 'next' && currentIndex < examQuestions.length - 1) {
        currentIndex++;
    } else if (typeof direction === 'number') {
        currentIndex = direction;
    }
    
    displayExamQuestion(currentIndex);
    
    // Update button states
    document.getElementById('prev-question').disabled = currentIndex === 0;
    document.getElementById('next-question').disabled = currentIndex === examQuestions.length - 1;
}

function startExamTimer(totalSecondsAllowed, elapsedSeconds, mandatorySubmissionSeconds) {
    // Clear any existing timer
    const existingTimer = localStorage.getItem('examTimerInterval');
    if (existingTimer) clearInterval(parseInt(existingTimer));
    
    let remainingSeconds = totalSecondsAllowed - elapsedSeconds;
    const timerElement = document.getElementById('exam-time-remaining');
    const submitButton = document.getElementById('submit-exam');
    
    // Update timer every second
    const timerInterval = setInterval(() => {
        remainingSeconds--;
        
        // Update display
        if (timerElement) {
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // Add warning class if less than 10 minutes remaining
            if (minutes <= 10) {
                timerElement.parentElement.classList.add('warning');
            }
        }
        
        // Check if mandatory submission time reached (50 minutes = 3000 seconds)
        const timeElapsed = totalSecondsAllowed - remainingSeconds;
        if (timeElapsed >= mandatorySubmissionSeconds) {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.add('highlight');
                submitButton.textContent = 'Submit Exam (Required)';
            }
            
            // Add mandatory submission notice if not already present
            if (!document.querySelector('.mandatory-submission-notice')) {
                const timerParent = timerElement.parentElement;
                const notice = document.createElement('span');
                notice.className = 'mandatory-submission-notice';
                notice.textContent = 'Mandatory submission time reached';
                timerParent.appendChild(notice);
            }
        }
        
        // Check if time's up
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000); // Update every second
    
    // Store interval ID to clear it later
    localStorage.setItem('examTimerInterval', timerInterval);
}

function submitExam() {
    // Clear timer interval
    const timerInterval = localStorage.getItem('examTimerInterval');
    if (timerInterval) clearInterval(parseInt(timerInterval));
    
    // Get exam data
    const examConfig = JSON.parse(localStorage.getItem('currentExamConfig'));
    const examQuestions = JSON.parse(localStorage.getItem('currentExamQuestions'));
    const examAnswers = JSON.parse(localStorage.getItem('currentExamAnswers'));
    const startTime = new Date(localStorage.getItem('examStartTime'));
    const endTime = new Date();
    const durationMinutes = Math.floor((endTime - startTime) / (1000 * 60));
    
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const results = examQuestions.map((question, index) => {
        const userAnswer = examAnswers[index];
        const correctAnswer = decodeURIComponent(question.correct_answer);
        const isCorrect = userAnswer === correctAnswer;
        
        totalPoints += question.points;
        if (isCorrect) earnedPoints += question.points;
        
        return {
            question: decodeURIComponent(question.question),
            userAnswer,
            correctAnswer,
            isCorrect,
            points: question.points,
            earnedPoints: isCorrect ? question.points : 0,
            topicName: question.topicName
        };
    });
    
    // Calculate percentage
    const scorePercent = Math.round((earnedPoints / totalPoints) * 100);
    
    // Determine grade
    let grade = 'F';
    if (scorePercent >= 90) grade = 'A';
    else if (scorePercent >= 80) grade = 'B';
    else if (scorePercent >= 70) grade = 'C';
    else if (scorePercent >= 60) grade = 'D';
    
    // Prepare exam result
    const examResult = {
        date: new Date().toISOString(),
        topics: examConfig.topics.map(t => t.name),
        difficulty: examConfig.difficulty,
        durationMinutes,
        totalPoints,
        earnedPoints,
        scorePercent,
        grade,
        questionResults: results
    };
    
    // Save to user history
    if (!currentUser.examHistory) {
        currentUser.examHistory = [];
    }
    currentUser.examHistory.push(examResult);
    
    // Update user stats
    updateUserStats({
        totalScore: earnedPoints,
        quizzesCompleted: 1,
        questionsAttempted: examQuestions.length,
        correctAnswers: results.filter(r => r.isCorrect).length
    });
    
    // Clean up exam data
    localStorage.removeItem('currentExamConfig');
    localStorage.removeItem('currentExamQuestions');
    localStorage.removeItem('currentExamAnswers');
    localStorage.removeItem('currentExamQuestionIndex');
    localStorage.removeItem('examStartTime');
    localStorage.removeItem('examTimerInterval');
    
    // Navigate to results page
    renderExamResultsPage(examResult);
}

function renderExamResultsPage(examResult) {
    pageContainer.innerHTML = `
        <div class="page">
            <div class="exam-results">
                <h2>Exam Results</h2>
                
                <div class="exam-summary">
                    <div class="grade-display ${examResult.grade}">
                        ${examResult.grade}
                    </div>
                    
                    <div class="score-info">
                        <div class="score-value">${examResult.earnedPoints}/${examResult.totalPoints} points (${examResult.scorePercent}%)</div>
                        <div class="exam-details">
                            <div>Duration: ${examResult.durationMinutes} minutes</div>
                            <div>Difficulty: ${examResult.difficulty.charAt(0).toUpperCase() + examResult.difficulty.slice(1)}</div>
                            <div>Topics: ${examResult.topics.join(', ')}</div>
                            <div>Date: ${new Date(examResult.date).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
                
                <div class="result-breakdown">
                    <h3>Question Analysis</h3>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Topic</th>
                                <th>Points</th>
                                <th>Your Answer</th>
                                <th>Correct Answer</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${examResult.questionResults.map((result, index) => `
                                <tr class="${result.isCorrect ? 'correct-row' : 'incorrect-row'}">
                                    <td>${index + 1}. ${result.question}</td>
                                    <td>${result.topicName}</td>
                                    <td>${result.points}</td>
                                    <td>${result.userAnswer || 'No answer'}</td>
                                    <td>${result.correctAnswer}</td>
                                    <td>${result.isCorrect ? 
                                        `<i class="fas fa-check-circle correct"></i> ${result.points} pts` : 
                                        `<i class="fas fa-times-circle incorrect"></i> 0 pts`}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="exam-controls">
                    <button id="home-btn">Back to Home</button>
                    <button id="new-exam-btn">Take Another Exam</button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for buttons
    document.getElementById('home-btn').addEventListener('click', () => navigateTo('home'));
    document.getElementById('new-exam-btn').addEventListener('click', () => navigateTo('exam'));
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', initApp);
