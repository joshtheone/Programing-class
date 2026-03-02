const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("list");

let todos = [];

addBtn.addEventListener('click', () => {
    let value = todoInput.value;

    todos.push(createTodo(value));
    createTodoListElement(value);
    todoInput.value = "";
    todoInput.focus();
});

function createTodo(value) {
    const rondomID = Math.floor(Math.random() * 100000);
    return {
        id: rondomID,
        text: value,
        completed: false
    }
}

function showTodos() {
    todos.forEach(todo => {
        createTodoListElement(todo.text);
    });
}

function createTodoListElement(value) {
    const li = document.createElement("li");

    const delBtn = document.createElement("button");
    const doneBtn = document.createElement("button");
    const textSpan = document.createElement("span");
    const div = document.createElement('div')

    textSpan.innerHTML = value;
    delBtn.textContent = "Del";
    doneBtn.textContent = "Done";

    doneBtn.classList.add("done-btn", "bg-green-500", "text-white", "px-3", "py-1", "rounded", "hover:bg-green-600");
    delBtn.classList.add("delete-btn", "bg-red-500", "text-white", "px-3", "py-1", "rounded", "hover:bg-red-600");
    li.classList.add("flex", "justify-between", "items-center");
    div.classList.add("flex", "gap-4")

    doneBtn.addEventListener('click', () => {
        textSpan.style = "text-decoration: line-through"
    });

    delBtn.addEventListener('click', () => {
        li.remove();
    });

    div.appendChild(doneBtn);
    div.appendChild(delBtn);

    li.appendChild(textSpan);
    li.appendChild(div);

    todoList.appendChild(li);
}

