//The DOM content to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));

    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task));
        updateTaskList();
        updateStats();
    }
});

let tasks = [];

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Add new task
const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const text = taskInput.value.trim();
    const priority = prioritySelect.value; 

    if (text) {
        const task = {
            text: text, 
            completed: false, 
            priority: priority 
        };

        tasks.push(task);
        taskInput.value = "";
        updateTaskList();
        updateStats();
        saveTasks();
    }
};

// Toggle task completion
const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();

    if (tasks.every(task => task.completed)) {
        blaskconfetti();  
    }
};


// Delete task
const deleteTask = (index) => {
    tasks.splice(index, 1);  
    updateTaskList();  
    updateStats();  
    saveTasks();  
};


// Edit task
const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

//creation progress bar and stats
const updateStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = (completedTasks / totalTasks) * 100;

    const progressBar = document.getElementById('progess');
    progressBar.style.width = `${progress}%`;

    document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;
};



// Update the task list
const updateTaskList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = "";
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        let priorityClass = task.priority; 

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
                    <p>${task.text}</p>
                    <span class="priority ${priorityClass}">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                </div>
                <div class="icons">
                    <img src="https://www.clipartmax.com/png/middle/351-3513671_revise-icon-transparent-background-editing-icon.png" onClick="editTask(${index})">
                    <img src="https://as2.ftcdn.net/v2/jpg/02/18/10/25/1000_F_218102502_lIb8UO1ks4FHXNRobsLl9PoHJMScbyIC.jpg" onClick="deleteTask(${index})">
                </div>
            </div>
        `;
        listItem.addEventListener('change', () => toggleTaskComplete(index));
        taskList.append(listItem);
    });
};


// Event listener for adding tasks
document.getElementById("newTask").addEventListener("click", (e) => {
    e.preventDefault();
    addTask();
});

// Confetti animation function
const blaskconfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
};
