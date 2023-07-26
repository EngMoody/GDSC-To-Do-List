// => DOM Selector .
const taskInput = document.querySelector(".form .todo-input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box"),
  addingButton = document.querySelector(".add-item"),
  all = document.querySelector("#all");
// => Common Variable.
let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list")),
  emptyPopUp = ` You Can't Create an Empty To Do   <br> Please Write any Thing To Create Your To Do`,
  onlyNumbersPopUP = "Do not enter only Numbers, Please enter a valid Task!",
  emptyList = "To Do List is Empty !!!";

//=> All Event Listeners
/***************************************/
//Add Event Enter To Adding Btn 
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" ) {
    checkToAdd(userTask);
  }
});
//Add Event on Click To Adding Btn 
addingButton.addEventListener("click", () => {
  let userTask = taskInput.value.trim();
  checkToAdd(userTask);
});
// Add Event To Clear Btn
clearAll.addEventListener("click", () => {
  if (todos.length > 0) {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
  } else {
    show_popUp(emptyList);
    document.querySelector("#popUp-btn").addEventListener("click", hide_popUp);
  }
});
// To Remove active filter
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});
/***************************************/
// => Initialization Task Box To Show All Tasks ( in all filter )
showTodo("all");
/***************************************************/
// => Exchange between filters
function updateFilters() {
  document.querySelector("span.active").classList.remove("active");
  all.classList.add("active");
}
/***************************************/
// => Update Task Status 
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  let todo = selectedTask.parentElement.parentElement;
  let compBtn = todo.children[1].firstElementChild;
  if (selectedTask.checked ) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
    compBtn.classList.add("blue-btn");
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
    compBtn.classList.remove("blue-btn");
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
/***************************************/
// => Create To Do List
function showTodo(filter) {
  let liTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <h2 class="${completed}">${todo.name}</h2>
                            </label>
                            <div class="todo-check">
                            <span class="complete-btn">Completed</span>
                            <span>
                            <i onclick="showMenu(this)" class="fa-solid fa-gear"></i>  
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="fa-solid fa-pen-to-square"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="fa-solid fa-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
      }
    });
  }
  taskBox.innerHTML =liTag || `<span class="empty">You don't have any task here<br> 
  <i class="fa-regular fa-face-meh"></i></span> 
  `;
  let checkTask = taskBox.querySelectorAll(".task");
  !checkTask.length
    ? clearAll.classList.remove("active") 
    : clearAll.classList.add("active");
}
/***************************************/
// => Add To Do List
function addTodo(val) {
  if (!isEditTask) {
    todos = !todos ? [] : todos;
    let taskInfo = { name: val, status: "pending" };
    todos.push(taskInfo);
  } else {
    isEditTask = false;
    todos[editId].name = val;
  }
  taskInput.value = "";
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(document.querySelector("span.active").id);
}
/***************************************/
// => function to check input value
function checkToAdd(x) {
  if (!x) {
    // popUP => ("Fill the box");
    show_popUp(emptyPopUp);
    document.querySelector("#popUp-btn").addEventListener("click", hide_popUp);
    return;
  }
  // popUP => ("Only Number is Type");
  else if (!/\D/.test(x) == true) {
    show_popUp(onlyNumbersPopUP);
    document.querySelector("#popUp-btn").addEventListener("click", hide_popUp);
    return;
  }
  //  popUP => ("Duplicate task");
  // else if (!id(x)){
    // console.log(isDuplicate(taskInput.value.trim()));
  //   // ==============>  unkown code !!!!!!!!!!
  //   // show_popUp("cc");
  //   // document.querySelector("#popUp-btn").addEventListener("click", hide_popUp);
  // }
  else if (x) {
    let userTask = taskInput.value.trim();
    addTodo(userTask);
  }
}
/***************************************/
// => function to Show Menu Of  To Do Check  (Edit ,Delete)
function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}
/***************************************/
// => function to Edit Task
function editTask(taskId, textName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}
/***************************************/
// => function to Delete Task
function deleteTask(deleteId, filter) {
  isEditTask = false;
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}
/***************************************/
// => function to Hide PoP Up Massage
function hide_popUp() {
  document.querySelector(".popUp").style.display = "none";
  taskInput.focus();
}
/***************************************/
// => function to Show PoP Up Massage
function show_popUp(text) {
  document.querySelector(".popUp-text").innerHTML = text;
  document.querySelector(".popUp").style.display = "block";
}
/***************************************/