/**
 * Settings Module
 * Handles all functionality related to user settings
 */

// DOM elements
let pomodoroTimeInput;
let shortBreakTimeInput;
let longBreakTimeInput;
let autoStartToggle;
let notificationToggle;
let focusModeToggle;

/**
 * Initialize settings
 */
function initSettings() {
    // Get DOM elements
    pomodoroTimeInput = document.getElementById('pomodoro-time');
    shortBreakTimeInput = document.getElementById('short-break-time');
    longBreakTimeInput = document.getElementById('long-break-time');
    autoStartToggle = document.getElementById('auto-start');
    notificationToggle = document.getElementById('notification');
    focusModeToggle = document.getElementById('focus-mode');
    
    // Check if all elements exist
    if (!pomodoroTimeInput || !shortBreakTimeInput || !longBreakTimeInput || !autoStartToggle || !notificationToggle || !focusModeToggle) {
        console.error('Some settings elements could not be found in the DOM');
        return;
    }
    
    console.log('Settings elements found, initializing settings');
    
    // Load settings from localStorage
    loadSettings();
    
    // Set up event listeners
    pomodoroTimeInput.addEventListener('change', updateTimerSettings);
    shortBreakTimeInput.addEventListener('change', updateTimerSettings);
    longBreakTimeInput.addEventListener('change', updateTimerSettings);
    autoStartToggle.addEventListener('change', saveSettings);
    notificationToggle.addEventListener('change', saveSettings);
    focusModeToggle.addEventListener('change', saveSettings);
    
    console.log('Settings initialized successfully');
}

/**
 * Update timer settings
 */
function updateTimerSettings() {
    // Get values from inputs
    const pomodoro = parseInt(pomodoroTimeInput.value, 10) || 25;
    const shortBreak = parseInt(shortBreakTimeInput.value, 10) || 5;
    const longBreak = parseInt(longBreakTimeInput.value, 10) || 15;
    
    // Validate inputs
    pomodoroTimeInput.value = Math.min(Math.max(pomodoro, 1), 60);
    shortBreakTimeInput.value = Math.min(Math.max(shortBreak, 1), 30);
    longBreakTimeInput.value = Math.min(Math.max(longBreak, 1), 60);
    
    // Update timer values in timer.js
    window.pomodoroTime = parseInt(pomodoroTimeInput.value, 10);
    window.shortBreakTime = parseInt(shortBreakTimeInput.value, 10);
    window.longBreakTime = parseInt(longBreakTimeInput.value, 10);
    
    // Save settings
    saveSettings();
    
    // Reset timer with new settings
    if (window.resetTimer) {
        window.resetTimer();
    } else {
        console.warn('resetTimer function not available');
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        const settings = {
            pomodoroTime: parseInt(pomodoroTimeInput.value, 10),
            shortBreakTime: parseInt(shortBreakTimeInput.value, 10),
            longBreakTime: parseInt(longBreakTimeInput.value, 10),
            autoStart: autoStartToggle.checked,
            notification: notificationToggle.checked,
            focusMode: focusModeToggle.checked
        };
        
        localStorage.setItem('settings', JSON.stringify(settings));
        console.log('Settings saved successfully', settings);
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
    }
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('settings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            console.log('Loaded settings from localStorage:', settings);
            
            // Update input values
            pomodoroTimeInput.value = settings.pomodoroTime || 25;
            shortBreakTimeInput.value = settings.shortBreakTime || 5;
            longBreakTimeInput.value = settings.longBreakTime || 15;
            autoStartToggle.checked = settings.autoStart || false;
            notificationToggle.checked = settings.notification !== undefined ? settings.notification : true;
            focusModeToggle.checked = settings.focusMode || false;
            
            // Update timer values in timer.js
            window.pomodoroTime = settings.pomodoroTime || 25;
            window.shortBreakTime = settings.shortBreakTime || 5;
            window.longBreakTime = settings.longBreakTime || 15;
        } else {
            console.log('No saved settings found, using defaults');
        }
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
    }
}

// Export functions
window.initSettings = initSettings;
window.loadSettings = loadSettings;
