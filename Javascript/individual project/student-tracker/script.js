// selecting everything from HTML
const performanceTable = document.getElementById("performanceTable");
const searchBox = document.getElementById("searchBox");
const studentsTableBody = document.getElementById("studentsTableBody");
const studentModal = document.getElementById("studentModal");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const saveBookBtn = document.getElementById("saveBookBtn");
const addStudentBtn = document.getElementById("addStudentBtn");
const studentForm = document.getElementById("studentForm");
const modalTitle = document.getElementById("modalTitle");
const image = document.getElementById("image");
const studentName = document.getElementById("studentName");
const studentAge = document.getElementById("studentAge");
const studentClass = document.getElementById("studentClass");
const studentScore1 = document.getElementById("studentScore1");
const studentScore2 = document.getElementById("studentScore2");
const studentScore3 = document.getElementById("studentScore3");
const emptyState = document.getElementById("emptyState");

// Editing state
const isEdit = { status: false, currentDataPosition: null };

// Load student data
let studentArray = JSON.parse(localStorage.getItem("Student Info")) || [];

// Show modal
addStudentBtn.onclick = () => {
  modalTitle.textContent = "Add Student";
  studentForm.reset();
  isEdit.status = false;
  studentModal.classList.remove("studentModalVisible");
};

// Hide modal
cancelModalBtn.onclick = () => {
  studentModal.classList.add("studentModalVisible");
};

// Handle add/edit
studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // validation
  if (
    !studentName.value.trim() ||
    !studentClass.value.trim() ||
    isNaN(studentScore1.value) ||
    isNaN(studentScore2.value) ||
    isNaN(studentScore3.value)
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  // Calculate average
  const avg =
    (Number(studentScore1.value) +
      Number(studentScore2.value) +
      Number(studentScore3.value)) /
    3;

  const category =
    avg >= 75 ? "Excellent" : avg >= 60 ? "Good" : avg >= 50 ? "Average" : "Poor";

  const studentDetails = {
    image: image.value || "./images/default.png",
    studentName: studentName.value.trim(),
    studentAge: studentAge.value,
    studentClass: studentClass.value.trim(),
    studentScore1: Number(studentScore1.value),
    studentScore2: Number(studentScore2.value),
    studentScore3: Number(studentScore3.value),
    average: avg.toFixed(2),
    performance: category,
  };

  if (isEdit.status) {
    studentArray[isEdit.currentDataPosition] = studentDetails;
    alert("Student details updated successfully!");
  } else {
    studentArray.push(studentDetails);
    alert("Student added successfully!");
  }

  localStorage.setItem("Student Info", JSON.stringify(studentArray));
  getData();
  studentModal.classList.add("studentModalVisible");
});

// Render data
function getData(filter = "") {
  studentsTableBody.innerHTML = "";

  const filtered = studentArray.filter((item) =>
    item.studentName.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td><img src="${item.image}" alt="Student" width="50" height="50" 
          style="border-radius: 8px; border: 2px solid #ddd;" /></td>
      <td>${highlight(item.studentName, filter)}</td>
      <td>${item.studentClass}</td>
      <td>${item.average}</td>
      <td class="perf ${item.performance.toLowerCase()}">${item.performance}</td>
      <td>
        <button class="delete" value="${index}">
          <i class="fa-regular fa-trash-can"></i>
        </button>
        <button class="edit" value="${index}">
          <i class="fa-solid fa-pen"></i>
        </button>
      </td>`;

    studentsTableBody.appendChild(row);
  });

  attachRowEvents();
}

// Highlight matches
function highlight(text, term) {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

// Search box handler
searchBox.addEventListener("input", (e) => {
  const term = e.target.value;
  getData(term);
});

// Delete and edit handlers
function attachRowEvents() {
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.onclick = (e) => {
      const pos = Number(e.currentTarget.value);
      if (confirm("Are you sure you want to delete this student?")) {
        deleteStudent(pos);
      }
    };
  });

  document.querySelectorAll(".edit").forEach((btn) => {
    btn.onclick = (e) => {
      const pos = Number(e.currentTarget.value);
      editStudent(pos);
    };
  });
}

// Delete
function deleteStudent(position) {
  studentArray.splice(position, 1);
  localStorage.setItem("Student Info", JSON.stringify(studentArray));
  getData(searchBox.value);
}

// Edit
function editStudent(position) {
  const data = studentArray[position];
  modalTitle.textContent = "Edit Student";
  studentModal.classList.remove("studentModalVisible");

  image.value = data.image;
  studentName.value = data.studentName;
  studentAge.value = data.studentAge;
  studentClass.value = data.studentClass;
  studentScore1.value = data.studentScore1;
  studentScore2.value = data.studentScore2;
  studentScore3.value = data.studentScore3;

  isEdit.status = true;
  isEdit.currentDataPosition = position;
}

// Load data on startup
getData();