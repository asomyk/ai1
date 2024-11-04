document.addEventListener("DOMContentLoaded", () => {
    loadTasks();

    const addTaskButton = document.getElementById("addTaskButton");
    addTaskButton.addEventListener("click", addTask);

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("keyup", filterTasks);
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task, index) => addTaskToDOM(task, index));
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskText = taskInput.value.trim();
    const dueDate = taskDueDate.value;

    if (taskText.length < 3 || taskText.length > 255 || (dueDate && new Date(dueDate) < new Date())) {
        alert("Nazwa taska jest za krótka/za długa lub w  przeszłości");
        return;
    }

    const task = { text: taskText, dueDate: dueDate };
    addTaskToDOM(task);
    saveTask(task);

    taskInput.value = '';
    taskDueDate.value = '';
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function editTask(taskContent, task, index) {
    const taskName = task.text;
    const taskDate = task.dueDate;

    taskContent.innerHTML = `
        <input type="text" value="${taskName}" class="edit-name">
        <input type="datetime-local" value="${taskDate}" class="edit-date">
    `;

    document.addEventListener('click', function handleClickOutside(event) {
        if (!taskContent.contains(event.target)) {
            saveTaskEdit(taskContent, task, index);
            document.removeEventListener('click', handleClickOutside);
        }
    });
}

function saveTaskEdit(taskContent, task, index) {
    const newName = taskContent.querySelector('.edit-name').value;
    const newDate = taskContent.querySelector('.edit-date').value;

    task.text = newName;
    task.dueDate = newDate;

    updateTaskInLocalStorage(task, index);

    taskContent.innerHTML = `
        <span class="task-name">${task.text}</span>
        <span class="task-date">${task.dueDate ? `Termin do: ${task.dueDate.replace('T', ' ')}` : ''}</span>
    `;

    const taskTextElement = taskContent.querySelector('.task-name');
    const taskDateElement = taskContent.querySelector('.task-date');

    taskTextElement.addEventListener('click', (event) => {
        event.stopPropagation();
        editTask(taskContent, task, index);
    });

    taskDateElement.addEventListener('click', (event) => {
        event.stopPropagation();
        editTask(taskContent, task, index);
    });
}


function updateTaskInLocalStorage(updatedTask, index) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks[index] = updatedTask;

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToDOM(task, index) {
    const taskList = document.getElementById('taskList');
    const taskItem = document.createElement('li');
    taskItem.setAttribute('data-index', index);

    const taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    const taskTextElement = document.createElement('span');
    taskTextElement.classList.add('task-name');
    taskTextElement.textContent = task.text;

    const taskDateElement = document.createElement('span');
    taskDateElement.classList.add('task-date');
    taskDateElement.textContent = task.dueDate ? `Termin do: ${task.dueDate.replace('T', ' ')}` : '';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = task.completed || false;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task, index, taskTextElement));

    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskTextElement);
    if (task.dueDate) {
        taskContent.appendChild(taskDateElement);
    }

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✗';
    deleteButton.classList.add('delete-button');

    taskItem.appendChild(taskContent);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);

    taskTextElement.addEventListener('click', (event) => {
        event.stopPropagation();
        editTask(taskContent, task, index);
    });

    taskDateElement.addEventListener('click', (event) => {
        event.stopPropagation();
        editTask(taskContent, task, index);
    });

    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        removeTask(deleteButton);
    });
    if (task.completed) {
        taskTextElement.classList.add('completed');
    }
}

function removeTask(element) {
    const taskItem = element.parentElement;
    const taskText = taskItem.querySelector('span').textContent;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => !taskText.includes(task.text));
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskItem.remove();
}

function filterTasks() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        const taskTextElement = task.querySelector('.task-name');

        if (!taskTextElement.getAttribute('data-original')) {
            taskTextElement.setAttribute('data-original', taskTextElement.innerHTML);
        }

        const originalHTML = taskTextElement.getAttribute('data-original');
        const taskText = taskTextElement.textContent.toLowerCase();

        if (searchTerm.length < 2) {
            taskTextElement.innerHTML = originalHTML;
            task.style.display = '';
        } else if (taskText.includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            taskTextElement.innerHTML = originalHTML.replace(regex, '<span class="highlight">$1</span>');
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function toggleTaskCompletion(task, index, taskTextElement) {
    task.completed = !task.completed;

    if (task.completed) {
        taskTextElement.classList.add('completed');
    } else {
        taskTextElement.classList.remove('completed');
    }
    updateTaskInLocalStorage(task, index);
}