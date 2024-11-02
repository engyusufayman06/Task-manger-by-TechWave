const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const taskPriority = document.getElementById('taskPriority');
const taskDisplay = document.getElementById('taskDisplay');
const themeToggle = document.getElementById('themeToggle');
const searchBar = document.getElementById('searchBar');

window.onload = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTaskToDisplay(task));
};

function addTaskToDisplay(task) {
    const taskContainer = document.createElement('div');
    taskContainer.className = `task-item priority-${task.priority}`;

    const title = document.createElement('h3');
    title.textContent = task.title;

    const description = document.createElement('p');
    description.textContent = task.description;

    const dates = document.createElement('p');
    dates.textContent = `Start: ${task.startDate} | End: ${task.endDate}`;

    const priority = document.createElement('p');
    priority.textContent = `Priority: ${task.priority}`;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.onclick = () => {
        taskContainer.classList.toggle('completed');
        completeButton.textContent = taskContainer.classList.contains('completed') ? 'Undo' : 'Complete';
    };

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.onclick = () => editTask(task);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => {
        if (confirm("Are you sure you want to delete this task?")) {
            deleteTask(task);
            taskContainer.remove();
        }
    };

    taskContainer.appendChild(title);
    taskContainer.appendChild(description);
    taskContainer.appendChild(dates);
    taskContainer.appendChild(priority);
    taskContainer.appendChild(completeButton);
    taskContainer.appendChild(editButton);
    taskContainer.appendChild(deleteButton);
    taskDisplay.appendChild(taskContainer);
}

saveButton.addEventListener('click', () => {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const start = startDate.value;
    const end = endDate.value;
    const priority = taskPriority.value;

    if (title && description && start && end) {
        if (new Date(end) < new Date(start)) {
            alert("End date cannot be before start date!");
            return;
        }

        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = { title, description, startDate: start, endDate: end, priority };
        savedTasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
        
        addTaskToDisplay(newTask);
        clearInputs();
        showNotification('Task saved successfully!');
    } else {
        alert("Please fill in all fields!");
    }
});

clearButton.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
        localStorage.removeItem('tasks');
        taskDisplay.innerHTML = '';
        showNotification('All tasks cleared!');
    }
});

function editTask(task) {
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    startDate.value = task.startDate;
    endDate.value = task.endDate;
    taskPriority.value = task.priority;

    deleteTask(task);
}

function deleteTask(task) {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = savedTasks.filter(t => t.title !== task.title || t.startDate !== task.startDate);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function clearInputs() {
    taskTitle.value = '';
    taskDescription.value = '';
    startDate.value = '';
    endDate.value = '';
    taskPriority.value = 'low';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
});

searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        const title = task.querySelector('h3').textContent.toLowerCase();
        task.style.display = title.includes(query) ? 'flex' : 'none';
    });
});
