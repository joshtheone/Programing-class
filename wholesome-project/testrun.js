const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", function () {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");
  li.className = "flex justify-between items-center bg-gray-100 p-3 rounded";

  const span = document.createElement("span");
  span.textContent = taskText;

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "space-x-2";

  // Done Button
  const doneBtn = document.createElement("button");
  doneBtn.textContent = "Done";
  doneBtn.className = "bg-green-500 text-white px-3 py-1 rounded";

  doneBtn.addEventListener("click", function () {
    span.classList.toggle("line-through");
    span.classList.toggle("text-gray-400");
  });

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "bg-red-500 text-white px-3 py-1 rounded";

  deleteBtn.addEventListener("click", function () {
    li.remove();
  });

  buttonDiv.appendChild(doneBtn);
  buttonDiv.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(buttonDiv);

  taskList.appendChild(li);

  taskInput.value = "";
});