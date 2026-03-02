// helper to build a list item
function createTaskItem(text) {
  const li = document.createElement("li");
  const donebtn = document.createElement("button");
  donebtn.textContent = "Done";
  donebtn.classList.add("done-btn");
  const span = document.createElement("span");
  span.textContent = text;
  const deletebtn = document.createElement("button");
  deletebtn.textContent = "Delete";
  deletebtn.classList.add("delete-btn");

  donebtn.addEventListener("click", () => span.classList.toggle("done"));
  deletebtn.addEventListener("click", () => li.remove());

  li.appendChild(donebtn);
  li.appendChild(span);
  li.appendChild(deletebtn);
  return li;
}

function initSection(inputId, buttonId, listId) {
  const input = document.getElementById(inputId);
  const addBtn = document.getElementById(buttonId);
  const list = document.getElementById(listId);
  addBtn.addEventListener("click", () => {
    const t = input.value.trim();
    if (t === "") return;
    list.appendChild(createTaskItem(t));
    input.value = "";
  });
}

initSection("taskInput1", "addBtn1", "taskList1");
initSection("taskInput2", "addBtn2", "taskList2");
