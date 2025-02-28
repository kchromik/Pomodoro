/**
 * Timer Module
 * Handles all functionality related to the Pomodoro timer
 */

// Timer variables
let timer;
let timeLeft;
let isRunning = false;
let currentMode = 'pomodoro';
let sessionsCompleted = 0;
let totalSessionsToday = 0;

// Default time settings (in minutes)
let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;

// Timer elements
let minutesDisplay;
let secondsDisplay;
let startBtn;
let pauseBtn;
let resetBtn;
let timerForeground;
let modeBtns;
let timerCompleteSound;

/**
 * Initialize the timer
 */
function initTimer() {
    // Get DOM elements
    minutesDisplay = document.getElementById('minutes');
    secondsDisplay = document.getElementById('seconds');
    startBtn = document.getElementById('start-btn');
    pauseBtn = document.getElementById('pause-btn');
    resetBtn = document.getElementById('reset-btn');
    timerForeground = document.querySelector('.timer-foreground');
    modeBtns = document.querySelectorAll('.mode-btn');
    timerCompleteSound = document.getElementById('timer-complete');

    // Load timer settings from localStorage
    loadTimerSettings();
    
    // Set initial time
    updateTimer(pomodoroTime * 60);
    
    // Event listeners for timer controls
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // Event listeners for mode buttons
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!isRunning) {
                changeMode(btn.dataset.mode);
            } else {
                // Show a notification that timer needs to be stopped first
                showNotification('Timer muss zuerst gestoppt werden', 'warning');
            }
        });
    });

    console.log('Timer initialized successfully');
}

/**
 * Start the timer
 */
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        
        // If it's a pomodoro session and focus mode is enabled
        if (currentMode === 'pomodoro' && document.getElementById('focus-mode').checked) {
            window.activateFocusMode();
        }
        
        const startTime = Date.now();
        const endTime = startTime + (timeLeft * 1000);
        
        timer = setInterval(() => {
            const currentTime = Date.now();
            const remaining = Math.max(0, Math.round((endTime - currentTime) / 1000));
            
            if (remaining <= 0) {
                completeTimer();
            } else {
                updateTimer(remaining);
                updateProgress(remaining);
            }
        }, 100);
    }
}

/**
 * Pause the timer
 */
function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }
}

/**
 * Reset the timer
 */
function resetTimer() {
    pauseTimer();
    const modeTime = getModeTime(currentMode);
    updateTimer(modeTime * 60);
    updateProgress(modeTime * 60);
}

/**
 * Update the timer display
 */
function updateTimer(seconds) {
    timeLeft = seconds;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    minutesDisplay.textContent = mins.toString().padStart(2, '0');
    secondsDisplay.textContent = secs.toString().padStart(2, '0');
}

/**
 * Update the progress circle
 */
function updateProgress(seconds) {
    const modeTime = getModeTime(currentMode);
    const totalSeconds = modeTime * 60;
    const progress = (totalSeconds - seconds) / totalSeconds;
    
    // Calculate stroke dashoffset (circle circumference is 2πr, r=45)
    const circumference = 2 * Math.PI * 45;
    const dashoffset = circumference * (1 - progress);
    
    timerForeground.style.strokeDasharray = circumference;
    timerForeground.style.strokeDashoffset = dashoffset;
}

/**
 * Handle timer completion
 */
function completeTimer() {
    clearInterval(timer);
    isRunning = false;
    
    // Play sound notification
    if (document.getElementById('notification').checked) {
        timerCompleteSound.play();
        
        // Desktop notification
        if (Notification.permission === 'granted') {
            const notificationTitle = currentMode === 'pomodoro' 
                ? 'Pomodoro abgeschlossen! Zeit für eine Pause.' 
                : 'Pause beendet! Bereit für den nächsten Pomodoro?';
            
            new Notification('Cozy Pomodoro Timer', {
                body: notificationTitle,
                icon: '/assets/icons/icon-192x192.png'
            });
        }
    }
    
    // If a pomodoro is completed
    if (currentMode === 'pomodoro') {
        sessionsCompleted++;
        totalSessionsToday++;
        
        // Update statistics
        updateStats(sessionsCompleted, totalSessionsToday);
        
        // Show reward popup for every completed pomodoro
        window.showReward(sessionsCompleted);
        
        // Deactivate focus mode if active
        window.deactivateFocusMode();
        
        // Auto switch to break time
        if (document.getElementById('auto-start').checked) {
            const breakMode = sessionsCompleted % 4 === 0 ? 'long-break' : 'short-break';
            changeMode(breakMode);
            startTimer();
        } else {
            const breakMode = sessionsCompleted % 4 === 0 ? 'long-break' : 'short-break';
            changeMode(breakMode);
        }
    } else {
        // If a break is completed
        if (document.getElementById('auto-start').checked) {
            changeMode('pomodoro');
            startTimer();
        } else {
            changeMode('pomodoro');
        }
    }
    
    startBtn.classList.remove('hidden');
    pauseBtn.classList.add('hidden');
}

/**
 * Change the timer mode (pomodoro, short break, long break)
 */
function changeMode(mode) {
    currentMode = mode;
    
    // Update active button
    modeBtns.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Reset timer with new mode time
    const modeTime = getModeTime(mode);
    updateTimer(modeTime * 60);
    updateProgress(modeTime * 60);
    
    // Change colors based on mode
    document.documentElement.style.setProperty('--timer-color', getModeColor(mode));
}

/**
 * Get the time duration for a specific mode
 */
function getModeTime(mode) {
    switch (mode) {
        case 'short-break':
            return shortBreakTime;
        case 'long-break':
            return longBreakTime;
        default:
            return pomodoroTime;
    }
}

/**
 * Get color for a specific mode
 */
function getModeColor(mode) {
    switch (mode) {
        case 'short-break':
            return 'var(--secondary)';
        case 'long-break':
            return 'var(--accent)';
        default:
            return 'var(--primary)';
    }
}

/**
 * Load timer settings from localStorage
 */
function loadTimerSettings() {
    const settings = JSON.parse(localStorage.getItem('timerSettings')) || {};
    
    pomodoroTime = settings.pomodoroTime || 25;
    shortBreakTime = settings.shortBreakTime || 5;
    longBreakTime = settings.longBreakTime || 15;
    
    // Update input fields
    document.getElementById('pomodoro-time').value = pomodoroTime;
    document.getElementById('short-break-time').value = shortBreakTime;
    document.getElementById('long-break-time').value = longBreakTime;
    
    // Set initial timer
    updateTimer(pomodoroTime * 60);
    updateProgress(pomodoroTime * 60);
}

/**
 * Save timer settings to localStorage
 */
function saveTimerSettings() {
    const settings = {
        pomodoroTime,
        shortBreakTime,
        longBreakTime
    };
    
    localStorage.setItem('timerSettings', JSON.stringify(settings));
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
    // Create a simple notification that disappears after a few seconds
    const notification = document.createElement('div');
    notification.classList.add('notification', `notification-${type}`);
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Request permission for notifications
if (Notification && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

// Export functions
window.initTimer = initTimer;
window.loadTimerSettings = loadTimerSettings;
window.resetTimer = resetTimer;
window.startTimer = startTimer;
window.pauseTimer = pauseTimer;
window.updateStats = function(sessions, todaySessions) {
    // This function will be implemented in stats.js
    console.log('Sessions completed:', sessions, 'Today:', todaySessions);
};
