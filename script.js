document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const categorySelect = document.getElementById('category');
    const prioritySelect = document.getElementById('priority');
    const dueDateInput = document.getElementById('due-date');

    loadTasks();  // Load tasks from localStorage

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskAction);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value;
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;

        if (taskText !== '') {
            const li = document.createElement('li');
            li.setAttribute('data-category', category);
            li.setAttribute('data-priority', priority);

            li.innerHTML = `
                ${taskText} <br>
                <small>Due: ${new Date(dueDate).toLocaleString()}</small>
                <button class="edit-btn">✏</button>
                <button class="delete-btn">✖</button>
            `;

            taskList.appendChild(li);
            saveTasks();  // Save tasks to localStorage
            taskInput.value = '';
            dueDateInput.value = '';
        }
    }

    function handleTaskAction(e) {
        if (e.target.classList.contains('delete-btn')) {
            e.target.parentElement.remove();
            saveTasks();  // Save tasks to localStorage
        } else if (e.target.classList.contains('edit-btn')) {
            const li = e.target.parentElement;
            taskInput.value = li.textContent.trim().split('\n')[0];
            li.remove();
            saveTasks();  // Save tasks to localStorage
        } else {
            e.target.classList.toggle('completed');
            saveTasks();  // Save tasks to localStorage
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    function clearCompletedTasks() {
        const completedTasks = document.querySelectorAll('li.completed');
        completedTasks.forEach(task => task.remove());
        saveTasks();  // Save tasks to localStorage
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(task => {
            tasks.push({
                text: task.textContent.trim().split('\n')[0],
                category: task.getAttribute('data-category'),
                priority: task.getAttribute('data-priority'),
                dueDate: task.querySelector('small').textContent,
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(taskData => {
            const li = document.createElement('li');
            li.setAttribute('data-category', taskData.category);
            li.setAttribute('data-priority', taskData.priority);
            if (taskData.completed) li.classList.add('completed');
            li.innerHTML = `
                ${taskData.text} <br>
                <small>${taskData.dueDate}</small>
                <button class="edit-btn">✏</button>
                <button class="delete-btn">✖</button>
            `;
            taskList.appendChild(li);
        });
    }
});
