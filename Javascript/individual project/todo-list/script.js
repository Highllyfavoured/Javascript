const taskName = document.getElementById("taskName");
const priority = document.getElementById("priority");
const dueDate = document.getElementById("dueDate");
const fieldForm = document.getElementById("fieldForm");

const orderList = document.getElementById("orderList");

let taskArray = JSON.parse(localStorage.getItem(`tasks`)) || [];

fieldForm.addEventListener(`submit`, function (e) {
  e.preventDefault();

  const taskObject = {
    taskName: taskName.value,
    priority: priority.value,
    dueDate: dueDate.value,
    completed: false,
    
  };
  taskArray.push(taskObject);

  console.log(taskArray);

  localStorage.setItem(`tasks`, JSON.stringify(taskArray));
  renderData();
  fieldForm.reset();
});

function renderData() {
  let renderedData = JSON.parse(localStorage.getItem(`tasks`));
  orderList.innerHTML = "";
  renderedData.map(function (render, index) {
    orderList.innerHTML += `
        <li style ="background: ${
          render.priority === "high"
            ? `red`
            : render.priority === "medium"
            ? `orange`
            : `green`
        };margin: 20px">Task Name: ${render.taskName}, Priority: ${
      render.priority
    }, Due Date: ${render.dueDate} <input type="checkbox" id= ${index} class="checkBoxes" ${render.completed ? checked : ""}/></li> 
        `;
  });
  const checkBoxes = document.querySelectorAll(`.checkBoxes`);
  checkBoxes.forEach(function(checkbox) {
    checkbox.addEventListener(`change`, function(e) {
        if (e.target.checked) {
            let
        }
    })
  })
}
renderData();
