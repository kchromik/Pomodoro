/**
 * Statistics Module
 * Handles all functionality related to statistics tracking
 */

// Stats storage
let stats = {
    daily: {},
    weekly: {},
    monthly: {},
    total: 0
};

// DOM elements
const todayCountEl = document.getElementById('today-count');
const weekCountEl = document.getElementById('week-count');
const monthCountEl = document.getElementById('month-count');
const totalCountEl = document.getElementById('total-count');
const weeklyChartEl = document.getElementById('weekly-chart');

// Chart instance
let weeklyChart;

/**
 * Initialize statistics
 */
function initStats() {
    // Load stats from localStorage
    loadStats();
    
    // Initialize weekly chart
    initWeeklyChart();
    
    // Update stats display
    updateStatsDisplay();
}

/**
 * Initialize weekly chart
 */
function initWeeklyChart() {
    const ctx = weeklyChartEl.getContext('2d');
    
    // Get week days
    const weekDays = getWeekDays();
    
    // Get completions for each day
    const weekData = weekDays.map(day => {
        const dateStr = day.dateStr;
        return stats.daily[dateStr] || 0;
    });
    
    // Create chart
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekDays.map(day => day.label),
            datasets: [{
                label: 'Pomodoros',
                data: weekData,
                backgroundColor: 'rgba(94, 129, 172, 0.7)',
                borderColor: 'rgba(94, 129, 172, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

/**
 * Update the stats when a pomodoro is completed
 */
function updateStats(session, todayCount) {
    // Get current date in ISO format (YYYY-MM-DD)
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const monthStr = dateStr.substring(0, 7); // YYYY-MM
    const weekStr = getWeekNumber(today);
    
    // Update daily stats
    stats.daily[dateStr] = todayCount;
    
    // Update weekly stats
    stats.weekly[weekStr] = (stats.weekly[weekStr] || 0) + 1;
    
    // Update monthly stats
    stats.monthly[monthStr] = (stats.monthly[monthStr] || 0) + 1;
    
    // Update total
    stats.total += 1;
    
    // Save stats
    saveStats();
    
    // Update display
    updateStatsDisplay();
    
    // Update chart
    updateWeeklyChart();
}

/**
 * Update the stats display
 */
function updateStatsDisplay() {
    // Get current date info
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const monthStr = dateStr.substring(0, 7);
    const weekStr = getWeekNumber(today);
    
    // Get counts
    const todayCount = stats.daily[dateStr] || 0;
    const weekCount = calculateWeekTotal();
    const monthCount = calculateMonthTotal();
    const totalCount = stats.total || 0;
    
    // Update display
    todayCountEl.textContent = todayCount;
    weekCountEl.textContent = weekCount;
    monthCountEl.textContent = monthCount;
    totalCountEl.textContent = totalCount;
}

/**
 * Update the weekly chart data
 */
function updateWeeklyChart() {
    if (weeklyChart) {
        const weekDays = getWeekDays();
        const weekData = weekDays.map(day => {
            const dateStr = day.dateStr;
            return stats.daily[dateStr] || 0;
        });
        
        weeklyChart.data.datasets[0].data = weekData;
        weeklyChart.update();
    }
}

/**
 * Calculate total pomodoros for the current week
 */
function calculateWeekTotal() {
    const weekDays = getWeekDays();
    let total = 0;
    
    weekDays.forEach(day => {
        total += stats.daily[day.dateStr] || 0;
    });
    
    return total;
}

/**
 * Calculate total pomodoros for the current month
 */
function calculateMonthTotal() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let total = 0;
    
    for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
        const dateStr = day.toISOString().split('T')[0];
        total += stats.daily[dateStr] || 0;
    }
    
    return total;
}

/**
 * Get the week number for a date
 */
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return `${d.getUTCFullYear()}-W${Math.ceil((((d - yearStart) / 86400000) + 1) / 7)}`;
}

/**
 * Get array of week days for the current week
 */
function getWeekDays() {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Start from Monday of current week
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const weekDays = [];
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    
    // Generate dates for each day of the week
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        weekDays.push({
            date,
            dateStr,
            label: dayNames[i]
        });
    }
    
    return weekDays;
}

/**
 * Save stats to localStorage
 */
function saveStats() {
    localStorage.setItem('stats', JSON.stringify(stats));
}

/**
 * Load stats from localStorage
 */
function loadStats() {
    const savedStats = localStorage.getItem('stats');
    
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
}

// Export functions
window.initStats = initStats;
window.updateStats = updateStats;
