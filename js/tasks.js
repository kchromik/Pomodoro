/**
 * Tasks Module
 * Handles all functionality related to task management
 */

// Tasks storage
let tasks = [];

// DOM elements
let taskInput;
let addTaskBtn;
let taskList;
let notesTextarea;

/**
 * Initialize the tasks functionality
 */
function initTasks() {
    // Get DOM elements
    taskInput = document.getElementById('task-input');
    addTaskBtn = document.getElementById('add-task-btn');
    taskList = document.getElementById('task-list');
    notesTextarea = document.getElementById('notes');
    
    // Check if all elements exist
    if (!taskInput || !addTaskBtn || !taskList || !notesTextarea) {
        console.error('Some task elements could not be found in the DOM');
        return;
    }
    
    console.log('Task elements found, initializing tasks');
    
    // Load tasks from localStorage
    loadTasks();
    
    // Set up event listeners
    addTaskBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Set up notes saving
    notesTextarea.addEventListener('input', saveNotes);
    
    // Load saved notes
    loadNotes();
    
    console.log('Tasks initialized successfully');
}

/**
 * Add a new task
 */
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            timestamp: new Date().toISOString()
        };
        
        tasks.push(task);
        saveTasks();
        renderTask(task);
        
        // Clear input field
        taskInput.value = '';
        taskInput.focus();
        
        console.log('Task added:', task);
    }
}

/**
 * Render a single task
 */
function renderTask(task) {
    try {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('task-delete');
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteBtn);
        
        taskList.appendChild(taskItem);
        
        // Apply completed styling if needed
        if (task.completed) {
            taskText.style.textDecoration = 'line-through';
            taskText.style.color = 'var(--text-secondary)';
        }
    } catch (error) {
        console.error('Error rendering task:', error, task);
    }
}

/**
 * Render all tasks
 */
function renderTasks() {
    try {
        // Clear the task list
        taskList.innerHTML = '';
        
        // Sort tasks: completed tasks at the bottom
        const sortedTasks = [...tasks].sort((a, b) => {
            if (a.completed === b.completed) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            }
            return a.completed ? 1 : -1;
        });
        
        // Render each task
        sortedTasks.forEach(task => renderTask(task));
        
        console.log(`Rendered ${tasks.length} tasks`);
    } catch (error) {
        console.error('Error rendering tasks:', error);
    }
}

/**
 * Toggle task completion status
 */
function toggleTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
        console.log(`Task ${id} toggled:`, tasks[taskIndex].completed);
    }
}

/**
 * Delete a task
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    console.log(`Task ${id} deleted`);
}

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log(`${tasks.length} tasks saved to localStorage`);
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

/**
 * Load tasks from localStorage
 */
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem('tasks');
        
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            console.log(`${tasks.length} tasks loaded from localStorage`);
            renderTasks();
        } else {
            console.log('No saved tasks found');
            tasks = [];
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        tasks = [];
    }
}

/**
 * Save notes to localStorage
 */
function saveNotes() {
    try {
        localStorage.setItem('notes', notesTextarea.value);
        console.log('Notes saved to localStorage');
    } catch (error) {
        console.error('Error saving notes to localStorage:', error);
    }
}

/**
 * Load notes from localStorage
 */
function loadNotes() {
    try {
        const savedNotes = localStorage.getItem('notes');
        
        if (savedNotes) {
            notesTextarea.value = savedNotes;
            console.log('Notes loaded from localStorage');
        } else {
            console.log('No saved notes found');
        }
    } catch (error) {
        console.error('Error loading notes from localStorage:', error);
    }
}

// Export functions
window.initTasks = initTasks;
window.loadTasks = loadTasks;
window.loadNotes = loadNotes;
