document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let currentTaskId;

    const tasks = [
        {
            id: 1,
            title: "Complete project report",
            description: "Prepare and submit the project report",
            dueDate: "2024-12-01",
            comments: []
        },
        {
            id: 2,
            title: "Team Meeting",
            description: "Get ready for the season",
            dueDate: "2024-12-01",
            comments: []
        },
        {
            id: 3,
            title: "Code Review",
            description: "Check partners code",
            dueDate: "2024-12-01",
            comments: []
        },
        {
            id: 4,
            title: "Deploy",
            description: "Check deploy steps",
            dueDate: "2024-12-01",
            comments: []
        }
    ];

    function loadTasks() {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small> </p>
                    <button class="btn btn-info btn-sm add-comment" data-id="${task.id}">Add Comment</button>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
                <div class="comment-list" id="comments-${task.id}">
                    ${task.comments.map(comment => `<p>${comment} <button class="btn btn-danger btn-sm delete-comment" data-comment="${comment}" data-task-id="${task.id}">Delete</button></p>`).join('')}
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });

        document.querySelectorAll('.add-comment').forEach(button => button.addEventListener('click', openCommentModal));
        document.querySelectorAll('.delete-comment').forEach(button => button.addEventListener('click', handleDeleteComment));
        document.querySelectorAll('.edit-task').forEach(button => button.addEventListener('click', handleEditTask));
        document.querySelectorAll('.delete-task').forEach(button => button.addEventListener('click', handleDeleteTask));
    }

    function handleEditTask(event) {
        try {
            // alert(event.target.dataset.id);
            //localizar la tarea quieren editar
            const taskId = parseInt(event.target.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            //cargar los datos en el formulario 
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-desc').value = task.description;
            document.getElementById('due-date').value = task.dueDate;
            //ponerlo en modo edicion
            isEditMode = true;
            edittingId = taskId;
            //mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("taskModal"));
            modal.show();
            

        } catch (error) {
            alert("Error trying to edit a task");
            console.error(error);
        }
    }

    function handleDeleteTask(event) {
        // alert(event.target.dataset.id);
        const id = parseInt(event.target.dataset.id);
        const index = tasks.findIndex(t => t.id === id);
        tasks.splice(index, 1);
        loadTasks();
    }

    function openCommentModal(event) {
        currentTaskId = parseInt(event.target.dataset.id);
        document.getElementById('comment-text').value = "";
        const commentModal = new bootstrap.Modal(document.getElementById("commentModal"));
        commentModal.show();
    }

    function handleAddComment() {
        const commentText = document.getElementById('comment-text').value;
        const task = tasks.find(t => t.id === currentTaskId);

        if (commentText) {
            task.comments.push(commentText);
            const commentModal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
            commentModal.hide();
            loadTasks();
        }
    }

    function handleDeleteComment(event) {
        const taskId = parseInt(event.target.dataset.taskId);
        const commentText = event.target.dataset.comment;

        const task = tasks.find(t => t.id === taskId);
        task.comments = task.comments.filter(comment => comment !== commentText);
        loadTasks();
    }


    function handleFormSubmit(event) {
        event.preventDefault();

        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;
        const dueDate = document.getElementById('due-date').value;

        if (isEditMode) {
            //todo editar
            const task = tasks.find(t => t.id === edittingId);
            task.title = title;
            task.description = description;
            task.dueDate = dueDate;

        } else {
            const newTask = {
                id: tasks.length + 1,
                title: title,
                description: description,
                dueDate: dueDate,
                comments: []
            };
            tasks.push(newTask);
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks();

        document.getElementById('task-form').reset();
        document.getElementById('taskModalLabel').textContent = "Add Task";

        const taskModal = bootstrap.Modal.getInstance(document.getElementById("taskModal"));
        taskModal.hide();
        loadTasks();
    }

    document.getElementById('task-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('add-comment-btn').addEventListener('click', handleAddComment);
    loadTasks();
});
