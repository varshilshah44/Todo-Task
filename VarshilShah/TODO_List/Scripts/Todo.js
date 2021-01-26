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
        localStorage.removeItem("tasks");
        localStorage.setItem("tasks",JSON.stringify(taskArr));
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
        li.querySelector("#deletebtn").style.display = "none";
        li.querySelector("#updatebtn").style.display = "none";
        
        localStorage.removeItem("tasks");
        localStorage.setItem("tasks",JSON.stringify(taskArr));
        resolve(event1);
      });
    });
  });
  return dropPromise;
}

function deleteItem(deleteBtn) {
  let deletePromise = new Promise(function (resolve, reject) {
    deleteBtn.addEventListener("click", (event) => {
      resolve(event);
    });
  });
  return deletePromise;
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
      subtaskPriority: "High",
      taskStatus: "TODO",
    };
    taskObj.subtaskId = taskId;
    taskObj.subtaskName = event.target.value;
    taskObj.domId = taskArr[taskArr.length - 1].domId + 1;
    taskArr.push(taskObj);
    localStorage.setItem("tasks", JSON.stringify(taskArr));
    const maintask = taskArr.find((item) => item.taskId === taskId);
    AddingItemintoDom(taskObj.subtaskName, taskObj.domId, maintask.taskName);
    console.log(taskArr);
  }
}

async function AddingItemintoDom(taskName, domId, maintaskname) {
  const todoData = document.importNode(template.content, "content");
  const deleteBtn = todoData.querySelector("#deletebtn");
  const itemLi = todoData.querySelector("li");
  itemLi.id = domId;
  itemLi.style.backgroundColor = "red";
  if (maintaskname) {
    itemLi.querySelector("h3").textContent =
      taskName + "(" + maintaskname + ")";
  } else {
    itemLi.querySelector("h3").textContent = taskName;
  }
  const task = taskArr.find((item) => item.domId === domId);
  if (task.taskStatus === "TODO") {
    todoOl.appendChild(itemLi);
  }
  if (task.taskStatus === "INPROGRESS") {
    progressOl.appendChild(itemLi);
  }
  if (task.taskStatus === "DONE") {
    doneOl.appendChild(itemLi);
    itemLi.querySelector("#deletebtn").style.display = "none";
    itemLi.querySelector("#updatebtn").style.display = "none";
    
  }

  const deletePromise = deleteItem(deleteBtn);
  deletePromise.then((event) => {
    const taskIndex = taskArr.findIndex((item) => item.domId == domId);
    taskArr.splice(taskIndex, 1);
    todoOl.removeChild(itemLi);
  });
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
  };
  taskObj.taskId = Math.random();
  taskObj.taskName = event.target.value;
  taskObj.domId = taskObj.taskId;
  taskArr.push(taskObj);
  localStorage.setItem("tasks", JSON.stringify(taskArr));

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
function getDataFromStorage() {
  const storageArr = JSON.parse(localStorage.getItem("tasks"));
  if (storageArr) {
    taskArr = storageArr;
    for (let i = 0; i < storageArr.length; i++) {
      if (storageArr[i].subtaskId) {
        const findMainTask = storageArr.find(
          (item) => item.taskId === storageArr[i].subtaskId
        );
        AddingItemintoDom(
          storageArr[i].subtaskName,
          storageArr[i].domId,
          findMainTask.taskName
        );
      } else {
        AddingItemintoDom(storageArr[i].taskName, storageArr[i].domId);
      }
    }
  }
}

getDataFromStorage();
App();
