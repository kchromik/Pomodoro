/**
 * Ambient Module
 * Handles background themes and ambient sounds
 */

// DOM elements
let bgButtons;
let soundButtons;
let volumeSlider;

// Audio elements
let soundRain;
let soundForest;
let soundWaves;
let soundLofi;

// Current sound playing
let currentSound = null;

/**
 * Initialize ambient features
 */
function initAmbient() {
    console.log('Initializing ambient features');
    
    try {
        // Get DOM elements
        bgButtons = document.querySelectorAll('.bg-btn');
        soundButtons = document.querySelectorAll('.sound-btn');
        volumeSlider = document.getElementById('volume');
        
        if (!bgButtons.length || !soundButtons.length || !volumeSlider) {
            console.error('Could not find all ambient DOM elements');
        } else {
            console.log('Found ambient DOM elements:', {
                bgButtons: bgButtons.length,
                soundButtons: soundButtons.length,
                volumeSlider: volumeSlider.id
            });
        }
        
        // Get audio elements
        soundRain = document.getElementById('sound-rain');
        soundForest = document.getElementById('sound-forest');
        soundWaves = document.getElementById('sound-waves');
        soundLofi = document.getElementById('sound-lofi');
        
        // Check if audio elements exist
        if (!soundRain || !soundForest || !soundWaves || !soundLofi) {
            console.warn('Audio elements not found. Using placeholder audio.');
            createPlaceholderAudio();
        } else {
            console.log('Found audio elements successfully');
        }
        
        // Load ambient settings
        loadAmbienceSettings();
        
        // Add event listeners for background buttons
        bgButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Background button clicked:', btn.dataset.bg);
                changeBackground(btn.dataset.bg);
                
                // Update active button
                bgButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Save setting
                saveAmbienceSettings();
            });
        });
        
        // Add event listeners for sound buttons
        soundButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Sound button clicked:', btn.dataset.sound);
                changeSound(btn.dataset.sound);
                
                // Update active button
                soundButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Save setting
                saveAmbienceSettings();
            });
        });
        
        // Add event listener for volume control
        volumeSlider.addEventListener('input', () => {
            const volume = volumeSlider.value / 100;
            console.log('Volume changed:', volume);
            updateVolume(volume);
            saveAmbienceSettings();
        });
        
        console.log('Ambient features initialized successfully');
    } catch (error) {
        console.error('Error initializing ambient features:', error);
    }
}

/**
 * Create placeholder audio elements if the real ones don't exist
 */
function createPlaceholderAudio() {
    console.log('Creating placeholder audio elements');
    
    try {
        // Create an audio context (this will work even without audio files)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Function to create a placeholder audio element
        const createAudio = (id) => {
            const audio = document.createElement('audio');
            audio.id = id;
            audio.loop = true;
            document.body.appendChild(audio);
            console.log(`Created placeholder audio element with id: ${id}`);
            return audio;
        };
        
        // Create placeholders if needed
        if (!soundRain) soundRain = createAudio('sound-rain');
        if (!soundForest) soundForest = createAudio('sound-forest');
        if (!soundWaves) soundWaves = createAudio('sound-waves');
        if (!soundLofi) soundLofi = createAudio('sound-lofi');
        
        // Since we won't have real audio files, we'll simulate audio
        window.simulateAudio = function(sound) {
            console.log(`Simulating ${sound} sound (no actual audio file available)`);
            return {
                play: () => Promise.resolve(),
                pause: () => {},
                volume: 1
            };
        };
        
        console.log('Placeholder audio elements created successfully');
    } catch (error) {
        console.error('Error creating placeholder audio:', error);
    }
}

/**
 * Change background theme
 */
function changeBackground(bg) {
    try {
        document.body.dataset.background = bg;
        console.log(`Background changed to: ${bg}`);
    } catch (error) {
        console.error('Error changing background:', error);
    }
}

/**
 * Change ambient sound
 */
function changeSound(sound) {
    try {
        // Stop any currently playing sound
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0;
            console.log('Stopped previously playing sound');
        }
        
        // Play the selected sound
        switch (sound) {
            case 'rain':
                currentSound = soundRain;
                break;
            case 'forest':
                currentSound = soundForest;
                break;
            case 'waves':
                currentSound = soundWaves;
                break;
            case 'lofi':
                currentSound = soundLofi;
                break;
            default:
                currentSound = null;
                console.log('No sound selected (sound turned off)');
                return;
        }
        
        if (currentSound) {
            try {
                currentSound.volume = volumeSlider.value / 100;
                console.log(`Setting volume to ${currentSound.volume}`);
                
                // Try to play the sound
                const playPromise = currentSound.play();
                console.log(`Attempting to play ${sound} sound`);
                
                // Handle potential errors (e.g., if audio file doesn't exist)
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.warn(`Error playing audio (${sound}):`, e);
                        if (window.simulateAudio) {
                            console.log('Falling back to simulated audio');
                            currentSound = window.simulateAudio(sound);
                        }
                    });
                }
            } catch (e) {
                console.warn('Error setting up audio:', e);
                if (window.simulateAudio) {
                    console.log('Falling back to simulated audio');
                    currentSound = window.simulateAudio(sound);
                }
            }
        }
    } catch (error) {
        console.error('Error changing sound:', error);
    }
}

/**
 * Update volume for all sound elements
 */
function updateVolume(volume) {
    try {
        soundRain.volume = volume;
        soundForest.volume = volume;
        soundWaves.volume = volume;
        soundLofi.volume = volume;
        console.log(`Volume updated to ${volume}`);
    } catch (error) {
        console.error('Error updating volume:', error);
    }
}

/**
 * Save ambience settings to localStorage
 */
function saveAmbienceSettings() {
    try {
        const settings = {
            background: document.body.dataset.background,
            sound: getActiveSound(),
            volume: volumeSlider.value
        };
        
        localStorage.setItem('ambienceSettings', JSON.stringify(settings));
        console.log('Ambience settings saved:', settings);
    } catch (error) {
        console.error('Error saving ambience settings:', error);
    }
}

/**
 * Load ambience settings from localStorage
 */
function loadAmbienceSettings() {
    try {
        const savedSettings = localStorage.getItem('ambienceSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            console.log('Loaded ambience settings from localStorage:', settings);
            
            // Set background
            if (settings.background) {
                changeBackground(settings.background);
                
                // Update active button
                bgButtons.forEach(btn => {
                    if (btn.dataset.bg === settings.background) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                console.log('Applied background setting:', settings.background);
            }
            
            // Set volume
            if (settings.volume) {
                volumeSlider.value = settings.volume;
                updateVolume(settings.volume / 100);
                console.log('Applied volume setting:', settings.volume);
            }
            
            // Set sound
            if (settings.sound && settings.sound !== 'none') {
                setTimeout(() => {
                    changeSound(settings.sound);
                    
                    // Update active button
                    soundButtons.forEach(btn => {
                        if (btn.dataset.sound === settings.sound) {
                            btn.classList.add('active');
                        } else {
                            btn.classList.remove('active');
                        }
                    });
                    console.log('Applied sound setting:', settings.sound);
                }, 500);
            }
        } else {
            console.log('No saved ambience settings found, using defaults');
        }
    } catch (error) {
        console.error('Error loading ambience settings:', error);
    }
}

/**
 * Get the currently active sound
 */
function getActiveSound() {
    try {
        const activeButton = document.querySelector('.sound-btn.active');
        const sound = activeButton ? activeButton.dataset.sound : 'none';
        return sound;
    } catch (error) {
        console.error('Error getting active sound:', error);
        return 'none';
    }
}

// Export functions
window.initAmbient = initAmbient;
window.loadAmbienceSettings = loadAmbienceSettings;
