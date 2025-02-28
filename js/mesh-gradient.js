/**
 * Mesh Gradient Background
 * Controls the modern animated mesh gradient background
 */

// Settings
let gradientTheme = 'default';
let gradientSpeed = 'normal';
let gradientIntensity = 'medium';
let gradientEnabled = true;

// DOM elements
let gradientContainer;
let gradientElement;
let gradientOverlay;
let themeButtons;
let speedButtons;
let intensityButtons;
let toggleGradientBtn;

/**
 * Initialize the mesh gradient background
 */
function initMeshGradient() {
    console.log('Initializing mesh gradient background');
    
    try {
        // Create gradient elements if they don't exist
        if (!document.querySelector('.mesh-gradient-container')) {
            createGradientElements();
        }
        
        // Get DOM elements
        gradientContainer = document.querySelector('.mesh-gradient-container');
        gradientElement = document.querySelector('.mesh-gradient');
        gradientOverlay = document.querySelector('.mesh-gradient-overlay');
        themeButtons = document.querySelectorAll('.gradient-theme-btn');
        speedButtons = document.querySelectorAll('.gradient-speed-btn');
        intensityButtons = document.querySelectorAll('.gradient-intensity-btn');
        toggleGradientBtn = document.getElementById('toggle-gradient');
        
        // Set up event listeners
        if (themeButtons) {
            themeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    changeGradientTheme(theme);
                    
                    // Update active button
                    themeButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Save settings
                    saveGradientSettings();
                });
            });
        }
        
        if (speedButtons) {
            speedButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const speed = btn.dataset.speed;
                    changeGradientSpeed(speed);
                    
                    // Update active button
                    speedButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Save settings
                    saveGradientSettings();
                });
            });
        }
        
        if (intensityButtons) {
            intensityButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const intensity = btn.dataset.intensity;
                    changeGradientIntensity(intensity);
                    
                    // Update active button
                    intensityButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                    // Save settings
                    saveGradientSettings();
                });
            });
        }
        
        if (toggleGradientBtn) {
            toggleGradientBtn.addEventListener('click', () => {
                toggleGradient();
                
                // Save settings
                saveGradientSettings();
            });
        }
        
        // Load settings from localStorage
        loadGradientSettings();
        
        console.log('Mesh gradient initialized successfully');
    } catch (error) {
        console.error('Error initializing mesh gradient:', error);
    }
}

/**
 * Create the gradient DOM elements
 */
function createGradientElements() {
    try {
        // Create container
        const container = document.createElement('div');
        container.className = 'mesh-gradient-container';
        
        // Create gradient element
        const gradient = document.createElement('div');
        gradient.className = 'mesh-gradient';
        
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'mesh-gradient-overlay';
        
        // Add to DOM
        container.appendChild(gradient);
        container.appendChild(overlay);
        document.body.appendChild(container);
        
        console.log('Gradient elements created');
    } catch (error) {
        console.error('Error creating gradient elements:', error);
    }
}

/**
 * Change the gradient theme
 */
function changeGradientTheme(theme) {
    try {
        document.body.classList.remove(`theme-${gradientTheme}`);
        document.body.classList.add(`theme-${theme}`);
        gradientTheme = theme;
        console.log(`Gradient theme changed to: ${theme}`);
    } catch (error) {
        console.error('Error changing gradient theme:', error);
    }
}

/**
 * Change the gradient animation speed
 */
function changeGradientSpeed(speed) {
    try {
        document.body.classList.remove(`gradient-speed-${gradientSpeed}`);
        document.body.classList.add(`gradient-speed-${speed}`);
        gradientSpeed = speed;
        console.log(`Gradient speed changed to: ${speed}`);
    } catch (error) {
        console.error('Error changing gradient speed:', error);
    }
}

/**
 * Change the gradient intensity
 */
function changeGradientIntensity(intensity) {
    try {
        document.body.classList.remove(`gradient-intensity-${gradientIntensity}`);
        document.body.classList.add(`gradient-intensity-${intensity}`);
        gradientIntensity = intensity;
        console.log(`Gradient intensity changed to: ${intensity}`);
    } catch (error) {
        console.error('Error changing gradient intensity:', error);
    }
}

/**
 * Toggle the gradient on/off
 */
function toggleGradient() {
    try {
        gradientEnabled = !gradientEnabled;
        
        if (gradientEnabled) {
            gradientContainer.style.display = '';
            if (toggleGradientBtn) toggleGradientBtn.textContent = 'Disable Gradient';
            console.log('Gradient enabled');
        } else {
            gradientContainer.style.display = 'none';
            if (toggleGradientBtn) toggleGradientBtn.textContent = 'Enable Gradient';
            console.log('Gradient disabled');
        }
    } catch (error) {
        console.error('Error toggling gradient:', error);
    }
}

/**
 * Save gradient settings to localStorage
 */
function saveGradientSettings() {
    try {
        const settings = {
            theme: gradientTheme,
            speed: gradientSpeed,
            intensity: gradientIntensity,
            enabled: gradientEnabled
        };
        
        localStorage.setItem('gradientSettings', JSON.stringify(settings));
        console.log('Gradient settings saved:', settings);
    } catch (error) {
        console.error('Error saving gradient settings:', error);
    }
}

/**
 * Load gradient settings from localStorage
 */
function loadGradientSettings() {
    try {
        const savedSettings = localStorage.getItem('gradientSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            console.log('Loaded gradient settings:', settings);
            
            // Apply theme
            if (settings.theme) {
                changeGradientTheme(settings.theme);
                
                // Update active button
                if (themeButtons) {
                    themeButtons.forEach(btn => {
                        if (btn.dataset.theme === settings.theme) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            }
            
            // Apply speed
            if (settings.speed) {
                changeGradientSpeed(settings.speed);
                
                // Update active button
                if (speedButtons) {
                    speedButtons.forEach(btn => {
                        if (btn.dataset.speed === settings.speed) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            }
            
            // Apply intensity
            if (settings.intensity) {
                changeGradientIntensity(settings.intensity);
                
                // Update active button
                if (intensityButtons) {
                    intensityButtons.forEach(btn => {
                        if (btn.dataset.intensity === settings.intensity) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                }
            }
            
            // Apply enabled state
            if (settings.enabled !== undefined) {
                gradientEnabled = settings.enabled;
                
                if (!gradientEnabled) {
                    gradientContainer.style.display = 'none';
                    if (toggleGradientBtn) toggleGradientBtn.textContent = 'Enable Gradient';
                }
            }
        } else {
            console.log('No saved gradient settings found, using defaults');
        }
    } catch (error) {
        console.error('Error loading gradient settings:', error);
    }
}

// Export functions
window.initMeshGradient = initMeshGradient;
