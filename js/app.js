/**
 * Main Application Controller
 * Initializes and coordinates all the components of the Pomodoro Timer application
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Cozy Pomodoro Timer...');
    
    // Initialize components
    initTimer();
    initTasks();
    initSettings();
    initAmbient();
    initMeshGradient();
    
    // Load saved data
    loadSavedData();
    
    // Initialize dark mode
    initDarkMode();
    
    console.log('Cozy Pomodoro Timer initialized successfully');
});

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
    try {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        
        if (darkModeToggle) {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('darkMode');
            
            // Apply saved theme or default to system preference
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            } else if (savedTheme === 'light') {
                document.body.classList.remove('dark-mode');
                darkModeToggle.checked = false;
            } else {
                // Check system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-mode');
                    darkModeToggle.checked = true;
                }
            }
            
            // Add event listener for toggle
            darkModeToggle.addEventListener('change', () => {
                if (darkModeToggle.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'light');
                }
            });
            
            console.log('Dark mode initialized');
        } else {
            console.warn('Dark mode toggle element not found');
        }
    } catch (error) {
        console.error('Error initializing dark mode:', error);
    }
}

/**
 * Initialize theme toggle functionality
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = `theme-${savedTheme}`;
    updateThemeIcon(themeIcon, savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.className.includes('theme-light') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.className = document.body.className.replace(`theme-${currentTheme}`, `theme-${newTheme}`);
        localStorage.setItem('theme', newTheme);
        
        updateThemeIcon(themeIcon, newTheme);
    });
}

/**
 * Update the theme toggle icon based on current theme
 */
function updateThemeIcon(iconElement, theme) {
    if (theme === 'light') {
        iconElement.className = 'fas fa-moon';
    } else {
        iconElement.className = 'fas fa-sun';
    }
}

/**
 * Initialize fullscreen toggle functionality
 */
function initFullscreenToggle() {
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    const fullscreenIcon = fullscreenToggle.querySelector('i');
    
    fullscreenToggle.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
            fullscreenIcon.className = 'fas fa-compress';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                fullscreenIcon.className = 'fas fa-expand';
            }
        }
    });
    
    // Listen for fullscreen change event
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenIcon.className = 'fas fa-compress';
        } else {
            fullscreenIcon.className = 'fas fa-expand';
        }
    });
}

/**
 * Initialize focus mode
 */
function initFocusMode() {
    const focusModeOverlay = document.getElementById('focus-mode-overlay');
    const exitFocusMode = document.getElementById('exit-focus-mode');
    
    // Focus mode can be triggered from the timer.js when starting a pomodoro
    window.activateFocusMode = function() {
        focusModeOverlay.classList.remove('hidden');
    };
    
    window.deactivateFocusMode = function() {
        focusModeOverlay.classList.add('hidden');
    };
    
    exitFocusMode.addEventListener('click', () => {
        window.deactivateFocusMode();
    });
}

/**
 * Show reward popup after completing sessions
 */
function showReward(sessionCount) {
    const rewardPopup = document.getElementById('reward-popup');
    const rewardMessage = document.getElementById('reward-message');
    const achievementImg = document.getElementById('achievement-img');
    const closeReward = document.getElementById('close-reward');
    
    // Different rewards based on session count
    let message = 'Du hast einen Pomodoro-Zyklus erfolgreich abgeschlossen!';
    let imgSrc = 'assets/images/achievements/achievement-1.png';
    
    if (sessionCount > 1 && sessionCount % 4 === 0) {
        message = 'Super! Du hast einen ganzen Pomodoro-Block abgeschlossen!';
        imgSrc = 'assets/images/achievements/achievement-2.png';
    }
    
    if (sessionCount > 10 && sessionCount % 10 === 0) {
        message = 'Beeindruckend! 10 Pomodoros erledigt - du bist im Flow!';
        imgSrc = 'assets/images/achievements/achievement-3.png';
    }
    
    rewardMessage.textContent = message;
    achievementImg.src = imgSrc;
    rewardPopup.classList.remove('hidden');
    
    closeReward.addEventListener('click', () => {
        rewardPopup.classList.add('hidden');
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        rewardPopup.classList.add('hidden');
    }, 5000);
}

/**
 * Initialize service worker for offline support
 */
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered successfully');
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
}

/**
 * Load all saved user data from localStorage
 */
function loadSavedData() {
    console.log('Loading saved data from localStorage');
    
    try {
        // Check if localStorage is available
        if (typeof localStorage === 'undefined') {
            console.error('localStorage is not available in this browser');
            return;
        }
        
        // Load timer settings
        if (window.loadTimerSettings) {
            window.loadTimerSettings();
            console.log('Timer settings loaded');
        } else {
            console.warn('loadTimerSettings function not available');
        }
        
        // Load tasks
        if (window.loadTasks) {
            window.loadTasks();
            console.log('Tasks loaded');
        } else {
            console.warn('loadTasks function not available');
        }
        
        // Load notes
        if (window.loadNotes) {
            window.loadNotes();
            console.log('Notes loaded');
        } else {
            console.warn('loadNotes function not available');
        }
        
        // Load ambience settings
        if (window.loadAmbienceSettings) {
            window.loadAmbienceSettings();
            console.log('Ambience settings loaded');
        } else {
            console.warn('loadAmbienceSettings function not available');
        }
        
        console.log('All saved data loaded successfully');
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Make functions available globally for other modules
window.showReward = showReward;
