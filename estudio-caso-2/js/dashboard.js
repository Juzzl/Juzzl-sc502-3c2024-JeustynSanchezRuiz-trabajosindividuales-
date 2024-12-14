document.addEventListener('DOMContentLoaded', function () {

    let isEditMode = false;
    let edittingId;
    let tasks = [];
    const API_URL = 'backend/tasks.php';
    const COMMENTS_URL = 'backend/comments.php'; 

    // Cargar tareas
    async function loadTasks() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                tasks = await response.json();
                
                for (let task of tasks) {
                    await loadComments(task);
                }
                renderTasks(tasks);  
            } else {
                if (response.status == 401) {
                    window.location.href = 'index.html';
                }
                console.error("Error al obtener tareas");
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function loadComments(task) {
        try {
            const response = await fetch(`${COMMENTS_URL}?task_id=${task.id}`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const comments = await response.json();
                task.comments = comments;  // Asignamos los comentarios a la tarea
            } else {
                console.error("Error al obtener los comentarios");
            }
        } catch (err) {
            console.error("Error al cargar los comentarios:", err);
        }
    }

 
    function renderTasks(tasks) {
        const taskList = document.getElementById('task-list');
        taskList.innerHTML = '';
        tasks.forEach(function (task) {
        
            let commentsList = '';
            if (task.comments && task.comments.length > 0) {
                commentsList = '<ul class="list-group list-group-flush">';
                task.comments.forEach(comment => {
                    commentsList += `<li class="list-group-item">${comment.comment} 
                    <button type="button" class="btn btn-sm btn-link remove-comment" data-taskid="${task.id}" data-commentid="${comment.id}">Remove</button>
                    <button type="button" class="btn btn-sm btn-link edit-comment" data-commentid="${comment.id}" data-taskid="${task.id}" data-comment="${comment.comment}">Edit</button>
                    </li>`;
                });
                commentsList += '</ul>';
            }

            const taskCard = document.createElement('div');
            taskCard.className = 'col-md-4 mb-3';
            taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.title}</h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text"><small class="text-muted">Due: ${task.due_date}</small> </p>
                    ${commentsList}
                    <button type="button" class="btn btn-sm btn-link add-comment" data-id="${task.id}">Add Comment</button>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-secondary btn-sm edit-task" data-id="${task.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">Delete</button>
                </div>
            </div>
            `;
            taskList.appendChild(taskCard);
        });


        document.querySelectorAll('.edit-task').forEach(function (button) {
            button.addEventListener('click', handleEditTask);
        });

        document.querySelectorAll('.delete-task').forEach(function (button) {
            button.addEventListener('click', handleDeleteTask);
        });

        // Agregar comentario
        document.querySelectorAll('.add-comment').forEach(function (button) {
            button.addEventListener('click', function (e) {
                document.getElementById("comment-task-id").value = e.target.dataset.id;  
                const modal = new bootstrap.Modal(document.getElementById("commentModal"));
                modal.show();  
            });
        });

  
        document.querySelectorAll('.remove-comment').forEach(function (button) {
            button.addEventListener('click', async function (e) {
                const commentId = parseInt(e.target.dataset.commentid); 
                const taskId = parseInt(e.target.dataset.taskid);  
                const response = await fetch(COMMENTS_URL, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: commentId }),
                    credentials: 'include'
                });

                if (response.ok) {
                    loadTasks();  
                } else {
                    console.error("Error eliminando el comentario");
                }
            });
        });

        document.querySelectorAll('.edit-comment').forEach(function (button) {
            button.addEventListener('click', function (e) {
                const commentId = parseInt(e.target.dataset.commentid);
                const taskId = parseInt(e.target.dataset.taskid);
                const commentText = e.target.dataset.comment;

               
                document.getElementById('edit-comment-id').value = commentId; 
                document.getElementById('edit-task-id').value = taskId; 
                document.getElementById('edit-comment-text').value = commentText;  

                
                const commentModal = new bootstrap.Modal(document.getElementById('editCommentModal'));
                commentModal.show(); 
            });
        });
    }

    // editar una tarea
    function handleEditTask(event) {
        const taskId = parseInt(event.target.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-desc').value = task.description;
        document.getElementById('due-date').value = task.due_date;
        isEditMode = true;
        edittingId = taskId;
        const modal = new bootstrap.Modal(document.getElementById("taskModal"));
        modal.show();
    }

    // eliminar tarea
    async function handleDeleteTask(event) {
        const id = parseInt(event.target.dataset.id);
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            loadTasks();  
        } else {
            console.error("Error eliminando las tareas");
        }
    }

    // agregar comentario
    document.getElementById('comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const comment = document.getElementById('task-comment').value;  // Obtenemos el comentario del formulario
        const taskId = parseInt(document.getElementById('comment-task-id').value);  // Obtenemos el id de la tarea seleccionada

    
        const response = await fetch(COMMENTS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_id: taskId, comment: comment }),
            credentials: 'include'
        });

        if (response.ok) {
            loadTasks(); 
            const modal = bootstrap.Modal.getInstance(document.getElementById('commentModal'));
            modal.hide(); 
        } else {
            console.error("Error guardando el comentario");
        }
    });

    // editar comentario
    document.getElementById('edit-comment-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const commentId = document.getElementById('edit-comment-id').value;
        const taskId = document.getElementById('edit-task-id').value;
        const newCommentText = document.getElementById('edit-comment-text').value;

        const response = await fetch(COMMENTS_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: commentId,
                task_id: taskId,
                comment: newCommentText
            }),
            credentials: 'include'
        });

        if (response.ok) {
            loadTasks();
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCommentModal'));
            modal.hide();  
        } else {
            console.error("Error editando el comentario");
        }
    });

    document.getElementById('task-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-desc").value;
        const dueDate = document.getElementById("due-date").value;

        if (isEditMode) {
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, description: description, due_date: dueDate }),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedió un error");
            }
        } else {
            const newTask = {
                title: title,
                description: description,
                due_date: dueDate
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask),
                credentials: "include"
            });
            if (!response.ok) {
                console.error("Sucedió un error");
            }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        loadTasks(); 
    });

    loadTasks();  
});
