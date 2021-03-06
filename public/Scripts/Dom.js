const main = document.getElementById("addtasks");
const taskInput = main.querySelector('input');
const template = document.getElementById("template");
const todoOl = document.getElementById("todo");
const progressOl = document.getElementById("progress");
const doneOl = document.getElementById("done");
const todoSortBtn = document.getElementById("todosort");
const progressSortBtn = document.getElementById("progresssort");
const doneSortBtn = document.getElementById("donesort");
const logBtn = document.getElementById("logbtn");
const log = document.getElementById("logid")
const search = document.getElementById("search")
/* 
function drop(ev){
    ev.preventDefault();
    console.log(ev.target)
}
function allowdrop(ev){
    ev.preventDefault()
}

progressOl.ondrop = "drop(event)";
progressOl.ondragover = "allowdrop(event)";
todoOl.ondrop = "drop(event)";
todoOl.ondragover = "allowdrop(event)";
doneOl.ondrop = "drop(event)";
doneOl.ondragover = "allowdrop(event)";
 */