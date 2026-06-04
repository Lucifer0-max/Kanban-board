let taskData = {}

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");
const boxes = [todo,progress,done];
let dragElement = null;

function addTask(title, des, box){ 
    // Implementation for asking task details
    const div = document.createElement("div"); 

    div.classList.add("task");
    div.setAttribute("draggable", "true")
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${des}</p>
        <button>Delete</button>
    `
    box.appendChild(div);

    div.addEventListener("drag", (e) =>{    
        dragElement = div;
    })
    
    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    })
    return div;
}

function updateTaskCount() {
     boxes.forEach(box => {
        const tasks = box.querySelectorAll(".task");
        const count = box.querySelector(".right");

        taskData[box.id] = Array.from(tasks).map(task => {
            return {
                title: task.querySelector("h2").innerText,
                des: task.querySelector("p").innerText
            }
        });

        localStorage.setItem("taskData", JSON.stringify(taskData));
        count.innerHTML=tasks.length;
    })
}

if(localStorage.getItem("taskData")){
    const data = JSON.parse(localStorage.getItem("taskData"));

    for(const key in data){
        const box = document.querySelector(`#${key}`);
        data[key].forEach(task => {
            addTask(task.title, task.des, box);
        })
        updateTaskCount();
    }
}

tasks.forEach(task => {
    task.addEventListener("drag",(e) =>{
        dragElement = task;
    })
});

function addDragEventOnBox(box){
    box.addEventListener("dragenter",(e) =>{
        e.preventDefault();
        box.classList.add("hover-over");
    })

    box.addEventListener("dragleave",(e) =>{
        e.preventDefault();
        box.classList.remove("hover-over");
    })

    box.addEventListener("dragover",(e) =>{
        e.preventDefault();
    })

    box.addEventListener("drop",(e) =>{
        e.preventDefault();
        box.appendChild(dragElement);
        box.classList.remove("hover-over");

        updateTaskCount();
    })
}

addDragEventOnBox(todo);
addDragEventOnBox(progress);
addDragEventOnBox(done);

// modal logic
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click",() => {
    modal.classList.toggle("active")
})

modalBg.addEventListener("click",() => {
    modal.classList.toggle("active")
})

addTaskButton.addEventListener("click",() => {

    const taskTitle = document.querySelector("#task-title-input").value
    const taskDes = document.querySelector("#task-des-input").value

    addTask(taskTitle, taskDes, todo);
    updateTaskCount();
    modal.classList.remove("active")

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-des-input").value = "";
})


