let taskArr = [];
let logArr = [];

function clearData(taskInput) {
  taskInput.value = "";
  App();
}

function resetStorage() {
  localStorage.removeItem("tasks");
  localStorage.setItem("tasks", JSON.stringify(taskArr));
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

function deleteItem(deleteBtn) {
  let deletePromise = new Promise(function (resolve, reject) {
    deleteBtn.addEventListener("click", (event1) => {
      if (confirm("Want to delete")) {
        resolve(event1);
      }
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
    main.append(subinput);

    const event = await inputEventHandler("sub", subinput);
    let taskObj = {
      subtaskId: 0,
      subtaskName: "",
      taskPriority: "HIGH",
      taskStatus: "TODO",
    };

    taskObj.subtaskId = taskId;
    taskObj.subtaskName = event.target.value;
    taskObj.domId = taskArr[taskArr.length - 1].domId + 1;
    taskObj.taskTime = new Date();
    const priority = prompt(
      "Please enter the priority [high,medium,low]",
      "high"
    );
    taskObj.taskPriority = priority.toUpperCase();
    taskArr.push(taskObj);
    logArr.push("Sub Task : " + taskObj.subtaskName + " is added");
    localStorage.setItem("tasks", JSON.stringify(taskArr));
    const maintask = taskArr.find((item) => item.taskId === taskId);
    AddingItemintoDom(taskObj.subtaskName, taskObj.domId, maintask.taskName);
    if (i + 1 === subtaskcount) {
      const inputAll = main.querySelectorAll("input");
      for (let i of inputAll) {
        if (i.className === "input1") {
          main.removeChild(i);
        }
      }
      clearData(taskInput);
    }
  }
}

async function AddingItemintoDom(taskName, domId, maintaskname) {
  const todoData = document.importNode(template.content, "content");
  const deleteBtn = todoData.querySelector("#deletebtn");
  const updateBtn = todoData.querySelector("#updatebtn");

  const itemLi = todoData.querySelector("li");
  const task = taskArr.find((item) => item.domId === domId);

  itemLi.id = domId;
  const date = new Date(task.taskTime)
  if (maintaskname) {
    itemLi.querySelector("h3").textContent =
      "Subtask : " + taskName + "(" + maintaskname + ")";
  } else {
    itemLi.querySelector("h3").textContent = "Task : " + taskName;
    itemLi.querySelector("h5").textContent =
      "Date : " +
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear() +
      ":" +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
  }
  itemLi.querySelector("h5").textContent =
    "Date : " +
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    ":" +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  if (task.taskPriority == "HIGH") {
    itemLi.style.backgroundColor = "red";
  } else if (task.taskPriority == "MEDIUM") {
    itemLi.style.backgroundColor = "orange";
  } else {
    itemLi.style.backgroundColor = "blue";
  }

  if (task.taskStatus === "TODO") {
    todoOl.appendChild(itemLi);
  } else if (task.taskStatus === "INPROGRESS") {
    progressOl.appendChild(itemLi);
  } else if (task.taskStatus === "DONE") {
    itemLi.querySelector("#updatebtn").style.display = "none";
    itemLi.draggable = false;
    doneOl.appendChild(itemLi);
  }

  const deletePromise = deleteItem(deleteBtn);
  deletePromise.then((event1) => {
    const taskIndex = taskArr.findIndex((item) => item.domId == domId);
    if (taskArr[taskIndex].taskName) {
      const newTaskArr = taskArr.filter(
        (item) => item.subtaskId === taskArr[taskIndex].taskId
      );
      for (let item of newTaskArr) {
        const subtaskIndex = taskArr.findIndex(
          (task) => task.domId == item.domId
        );
        const deleteli = document.getElementById(item.domId);
        if (taskArr[subtaskIndex].taskStatus == "TODO") {
          todoOl.removeChild(deleteli);
        } else if (taskArr[subtaskIndex].taskStatus == "INPROGRESS") {
          progressOl.removeChild(deleteli);
        } else {
          doneOl.removeChild(deleteli);
        }
        taskArr.splice(subtaskIndex, 1);
        logArr.push("Task : " + item.subtaskName + " is deleted");
      }
      if (taskArr[taskIndex].taskStatus == "TODO") {
        todoOl.removeChild(itemLi);
      } else if (taskArr[taskIndex].taskStatus == "INPROGRESS") {
        progressOl.removeChild(itemLi);
      } else {
        doneOl.removeChild(itemLi);
      }

      taskArr.splice(taskIndex, 1);
      logArr.push(
        "Task : " + itemLi.querySelector("h3").textContent + " is deleted"
      );
    } else {
      logArr.push("Task : " + taskArr[taskIndex].subtaskName + " is deleted");
      if (taskArr[taskIndex].taskStatus == "TODO") {
        todoOl.removeChild(itemLi);
      } else if (taskArr[taskIndex].taskStatus == "INPROGRESS") {
        progressOl.removeChild(itemLi);
      } else {
        doneOl.removeChild(itemLi);
      }
      taskArr.splice(taskIndex, 1);
    }
    resetStorage();
  });

  updateBtn.addEventListener("click", (event) => {
    const taskIndex = taskArr.findIndex((item) => item.domId == domId);
    let newtaskName;
    if (taskArr[taskIndex].subtaskName) {
      newtaskName = prompt(
        "Enter a new task Name",
        `${taskArr[taskIndex].subtaskName}`
      );
      taskArr[taskIndex].subtaskName = newtaskName;
      itemLi.querySelector("h3").textContent =
        newtaskName + "(" + maintaskname + ")";
    } else {
      newtaskName = prompt(
        "Enter a new subtask Name",
        `${taskArr[taskIndex].taskName}`
      );
      logArr.push(
        "Task : " +
          itemLi.querySelector("h3").textContent +
          " is updated to " +
          newtaskName
      );
      taskArr[taskIndex].taskName = newtaskName;
      itemLi.querySelector("h3").textContent = "Task :" + newtaskName;
    }
    resetStorage();
  });
  let a = 0;
  itemLi.addEventListener("dragstart", (event) => {
    if (task.taskStatus === "TODO") {
      progressOl.addEventListener("dragover", (e) => {
        e.preventDefault();
        progressOl.addEventListener("drop", (event) => {
          //  console.log(event.target);

          if (a == 0) {
            a++;
            progressOl.append(itemLi);
            task.taskStatus = "INPROGRESS";
            logArr.push(
              "Task : " +
                itemLi.querySelector("h3").textContent +
                " is moved into Inprogress"
            );
            resetStorage();
          }
        });
      });
    } else if (task.taskStatus === "INPROGRESS") {
      doneOl.addEventListener("dragover", (e) => {
        e.preventDefault();
        doneOl.addEventListener("drop", (event1) => {
          itemLi.draggable = false;
          doneOl.append(itemLi);
          itemLi.querySelector("#updatebtn").style.display = "none";
          task.taskStatus = "DONE";
          resetStorage();
        });
      });
      logArr.push(
        "Task : " +
          itemLi.querySelector("h3").textContent +
          " is moved into Done"
      );
    }
  });
}

async function App() {
  let event = await inputEventHandler("Main", taskInput);
  let taskObj = {
    taskId: 0,
    taskName: "",
    taskPriority: "HIGH",
    taskStatus: "TODO",
  };
  taskObj.taskId = Math.random();
  taskObj.taskName = event.target.value;
  taskObj.domId = taskObj.taskId;
  taskObj.taskTime = new Date();
  const priority = prompt(
    "Please enter the priority [high,medium,low]",
    "high"
  );
  if (
    priority == null ||
    (priority.toUpperCase() != "HIGH" &&
      priority.toUpperCase() != "LOW" &&
      priority.toUpperCase() != "MEDIUM")
  ) {
    if (priority != null) {
      alert("Please Enter Correctly");
    }
    clearData(taskInput);
  } else {
    taskObj.taskPriority = priority.toUpperCase();
    taskArr.push(taskObj);

    const subtaskPrompt = prompt("How many Subtask You want to add?", "0");
    if (parseInt(subtaskPrompt) > 0 && parseInt(subtaskPrompt) <= 10) {
      localStorage.setItem("tasks", JSON.stringify(taskArr));
      logArr.push("Main Task : " + taskObj.taskName + " is added");
      AddSubtask(taskObj.taskId, parseInt(subtaskPrompt));
      AddingItemintoDom(taskObj.taskName, taskObj.domId);
    } else if (parseInt(subtaskPrompt) === 0 || subtaskPrompt == null) {
      localStorage.setItem("tasks", JSON.stringify(taskArr));
      logArr.push("Main Task : " + taskObj.taskName + " is added");
      AddingItemintoDom(taskObj.taskName, taskObj.domId);
      clearData(taskInput);
    } else {
      alert("Please enter correctly");
      clearData(taskInput);
    }
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

function sortingHandler(priority, task, status) {
  let promise = new Promise(function (resolve, reject) {
    if (
      task.taskPriority == priority &&
      task.subtaskId &&
      task.taskStatus === status
    ) {
      const findMainTask = taskArr.find(
        (item) => item.taskId === task.subtaskId
      );
      AddingItemintoDom(task.subtaskName, task.domId, findMainTask.taskName);
    }
    if (
      task.taskPriority == priority &&
      task.taskId &&
      task.taskStatus === status
    ) {
      AddingItemintoDom(task.taskName, task.domId);
    }
    resolve("Success");
  });
  return promise;
}

async function sortingPriorityHandler(status) {
  for (let task of taskArr) {
    await sortingHandler("HIGH", task, status);
  }
  for (let task of taskArr) {
    await sortingHandler("MEDIUM", task, status);
  }
  for (let task of taskArr) {
    await sortingHandler("LOW", task, status);
  }
}

function sorting() {
  todoSortBtn.addEventListener("click", async () => {
    const allLi = todoOl.querySelectorAll("li");
    for (let li of allLi) {
      todoOl.removeChild(li);
    }
    sortingPriorityHandler("TODO");
  });
  progressSortBtn.addEventListener("click", async () => {
    const allLi = progressOl.querySelectorAll("li");
    for (let li of allLi) {
      progressOl.removeChild(li);
    }
    sortingPriorityHandler("INPROGRESS");
  });
  doneSortBtn.addEventListener("click", async () => {
    const allLi = doneOl.querySelectorAll("li");
    for (let li of allLi) {
      doneOl.removeChild(li);
    }
    sortingPriorityHandler("DONE");
  });
}

function onlog() {
  const allH4 = log.querySelectorAll("h4");
  for (let h4 of allH4) {
    log.removeChild(h4);
  }
  if (log.className === "log") {
    log.className = "log1";
    if (logArr.length <= 10) {
      for (let i = 0; i < logArr.length; i++) {
        const h4 = document.createElement("h4");
        h4.textContent = logArr[i];
        log.append(h4);
      }
    } else {
      let temp = logArr.length - 10;
      for (let i = temp; i < logArr.length; i++) {}
    }
  } else {
    log.className = "log";
  }
}

function searchHandler(event, Ol) {
  const regx = new RegExp(`${event.target.value}`);
  const highregx = "high";
  const mediumregx = "medium";
  const lowregx = "low";
  const all = Ol.querySelectorAll("li");
  if (event.key != "Backspace") {
    for (let task of all) {
      if (!regx.test(task.querySelector("h3").textContent)) {
        task.style.display = "none";
      }
      if (regx.test(highregx)) {
        if (task.style.backgroundColor == "red") {
          task.style.display = "block";
        }
      } else if (regx.test(mediumregx)) {
        if (task.style.backgroundColor == "orange") {
          task.style.display = "block";
        }
      } else if (regx.test(lowregx)) {
        if (task.style.backgroundColor == "blue") {
          task.style.display = "block";
        }
      }
    }
  } else {
    for (let task of all) {
      if (regx.test(task.querySelector("h3").textContent)) {
        task.style.display = "block";
      }
    }
  }
}

search.addEventListener("keyup", (event) => {
  searchHandler(event, todoOl);
  searchHandler(event, progressOl);
  searchHandler(event, doneOl);
});

getDataFromStorage();
App();
sorting();
