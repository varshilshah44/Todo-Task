let taskArr = [];

function clearData(taskInput) {
  taskInput.value = "";
  App();
}

function inputEventHandler(tasktype, input) {
  let inputPromise = new Promise(function (resolve, reject) {
    input.addEventListener("keyup", (event) => {
      if (event.key == "Enter" && event.target.value !== "") {
        resolve(event);
      }
    });
  });
  return inputPromise;
}

function allowDropFromTodo(li, domId) {
  let dropPromise = new Promise(function (resolve, reject) {
    li.addEventListener("dragstart", (event) => {
      li.addEventListener("dragleave", (event1) => {
        progressOl.append(li);
        const task = taskArr.find((item) => item.domId === domId);
        task.taskStatus = "INPROGRESS";
        resolve(event1);
      });
    });
  });
  return dropPromise;
}

function allowDropFromInprogress(li, domId) {
  let dropPromise = new Promise(function (resolve, reject) {
    li.addEventListener("dragstart", (event) => {
      doneOl.addEventListener("dragleave", (event1) => {
        doneOl.append(li);
        const task = taskArr.find((item) => item.domId === domId);
        task.taskStatus = "DONE";
        li.draggable = !li.draggable;
        resolve(event1);
      });
    });
  });
  return dropPromise;
}

async function AddSubtask(taskId, subtaskcount) {
  for (let i = 0; i < subtaskcount; i++) {
    const subinput = document.createElement("input");
    subinput.type = "text";
    subinput.className = "input1";
    subinput.placeholder = "Enter a Sub Task" + (i + 1);
    main.insertAdjacentElement("afterend", subinput);

    const event = await inputEventHandler("sub", subinput);
    let taskObj = {
      subtaskId: 0,
      subtaskName: "",
      taskStatus: "TODO",
    };
    taskObj.subtaskId = taskId;
    taskObj.subtaskName = event.target.value;
    taskObj.domId = taskArr[taskArr.length - 1].domId + 1;
    taskArr.push(taskObj);
  //localStorage.setItem("task", JSON.stringify(taskArr));
    const maintask = taskArr.find((item) => item.taskId === taskId);
    AddingItemintoDom(taskObj.subtaskName, taskObj.domId, maintask.taskName);
  }
}

async function AddingItemintoDom(taskName, domId, maintaskname) {
  console.log(domId);
  const todoData = document.importNode(template.content, "content");
  const itemLi = todoData.querySelector("li");
  itemLi.id = domId;
  itemLi.style.backgroundColor = "red";
  if (maintaskname) {
    itemLi.querySelector("h3").textContent =
      taskName + "(" + maintaskname + ")";
  } else {
    itemLi.querySelector("h3").textContent = taskName;
  }
  todoOl.appendChild(itemLi);
  let event = await allowDropFromTodo(itemLi, domId);
  let event3 = await allowDropFromInprogress(itemLi, domId);
}

async function App() {
  let event = await inputEventHandler("Main", taskInput);
  let taskObj = {
    taskId: 0,
    taskName: "",
    taskPriority: "High",
    taskStatus: "TODO",
    domId: 0,
  };
  taskObj.taskId = taskObj.taskId + 1;
  taskObj.taskName = event.target.value;
  taskObj.domId = taskObj.domId + 1;
  taskArr.push(taskObj);
  // localStorage.setItem("task", JSON.stringify(taskArr));

  const subtaskPrompt = prompt("How many Subtask You want to add?", "0");
  if (parseInt(subtaskPrompt) > 0 && parseInt(subtaskPrompt) <= 10) {
    AddSubtask(taskObj.taskId, parseInt(subtaskPrompt));
    AddingItemintoDom(taskObj.taskName, taskObj.domId);
  } else if (parseInt(subtaskPrompt) === 0) {
    AddingItemintoDom(taskObj.taskName, taskObj.domId);
    clearData(taskInput);
  } else {
    alert("Please enter correctly");
    clearData(taskInput);
  }
}
/* function getFromStorage() {
  const tasks = JSON.parse(localStorage.getItem("task"));
  if (tasks) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].subtaskName) {
        const maintask = tasks.find(
          (item) => item.taskId === tasks[i].subtaskId
        );
        AddingItemintoDom(tasks[i].subtaskName, maintask.taskName);
      } else {
        AddingItemintoDom(tasks[i].taskName);
      }
    }
  }
}
getFromStorage(); */
App();
