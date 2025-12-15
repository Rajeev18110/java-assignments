document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    // Attach event listeners
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    taskList.addEventListener('click', handleTaskClick);

    // Initial load of tasks from localStorage
    loadTasks();

    /**
     * Function to create and add a new task to the list.
     * @param {string} [taskText] - The text of the task. Used when loading from storage.
     * @param {boolean} [isCompleted=false] - Completion status. Used when loading from storage.
     */
    function addTask(taskText, isCompleted = false) {
        const text = taskText || taskInput.value.trim();

        if (text === '') {
            alert('Please enter a task!');
            return;
        }

        // 1. Create the new list item element (li)
        const listItem = document.createElement('li');
        if (isCompleted) {
            listItem.classList.add('completed');
        }
        
        // 2. Add the text content
        const taskSpan = document.createElement('span');
        taskSpan.classList.add('task-text');
        taskSpan.textContent = text;
        listItem.appendChild(taskSpan);

        // 3. Add the delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.setAttribute('data-action', 'delete'); // Custom attribute for delegation
        listItem.appendChild(deleteButton);

        // 4. Append the new task to the UL
        taskList.appendChild(listItem);

        // 5. Clear the input field for a fresh start
        taskInput.value = '';

        // 6. Save the updated list to local storage
        saveTasks();
    }

    /**
     * Handles clicks on the task list, delegating actions (toggle complete/delete).
     * @param {Event} e - The click event object.
     */
    function handleTaskClick(e) {
        const target = e.target;
        const listItem = target.closest('li');

        if (!listItem) return; // Clicked outside of an LI

        // Handle Delete Button Click
        if (target.closest('.delete-btn')) {
            listItem.remove(); // Remove the list item from the DOM
        } 
        
        // Handle Toggle Completion Click (on the text)
        else if (target.classList.contains('task-text')) {
            listItem.classList.toggle('completed'); // Toggle the completion class
        }
        
        // Save state after any action
        saveTasks();
    }

    /**
     * Saves the current list of tasks to the browser's local storage.
     */
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(listItem => {
            tasks.push({
                text: listItem.querySelector('.task-text').textContent,
                completed: listItem.classList.contains('completed')
            });
        });
        // Convert array to JSON string before storing
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * Loads tasks from local storage and renders them on the page.
     */
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            const tasks = JSON.parse(storedTasks); // Convert JSON string back to array
            tasks.forEach(task => {
                // Reuse the addTask function to render the task
                addTask(task.text, task.completed);
            });
        }
    }
});