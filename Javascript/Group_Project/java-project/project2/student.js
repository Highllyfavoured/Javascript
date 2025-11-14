// student.js
(() => {
  const LIB_KEY = "libraryBooks";
  const availableGrid = document.getElementById("availableGrid");
  const myBorrowedGrid = document.getElementById("myBorrowedGrid");
  const studentSearch = document.getElementById("studentSearch");
  const darkModeBtn = document.getElementById("darkModeBtn");
  const changeNameBtn = document.getElementById("changeNameBtn");

  // Prompt for student name if not present
  function ensureStudentName() {
    let name = localStorage.getItem("studentName");
    if (!name) {
      name = prompt("Enter your name (this will be used when you borrow books):");
      if (!name) name = "Guest";
      localStorage.setItem("studentName", name);
    }
    return name;
  }

  // dark mode
  function applyDarkModeUI() {
    const isDark = localStorage.getItem("darkMode") === "enabled";
    document.body.classList.toggle("dark", isDark);
    if (darkModeBtn) darkModeBtn.textContent = isDark ? "☀ Light Mode" : "🌙 Dark Mode";
  }
  function toggleDarkMode() {
    const enabled = localStorage.getItem("darkMode") === "enabled";
    localStorage.setItem("darkMode", enabled ? "disabled" : "enabled");
    applyDarkModeUI();
  }
  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", toggleDarkMode);
    applyDarkModeUI();
  }

  // change student name
  if (changeNameBtn) {
    changeNameBtn.addEventListener("click", () => {
      const newName = prompt("Enter your name:");
      if (newName && newName.trim()) {
        localStorage.setItem("studentName", newName.trim());
        renderAll();
      }
    });
  }

  // fetch books
  function loadBooks() {
    return JSON.parse(localStorage.getItem(LIB_KEY)) || [];
  }

  // save books
  function saveBooks(books) {
    localStorage.setItem(LIB_KEY, JSON.stringify(books));
  }

  // Borrow book
  function borrowBook(id) {
    const student = localStorage.getItem("studentName") || ensureStudentName();
    let books = loadBooks();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return alert("Book not found.");
    if (books[idx].status !== "Available") return alert("Sorry, the book is not available.");
    books[idx].status = "Borrowed";
    books[idx].borrowerName = student;
    saveBooks(books);
    renderAll();
  }

  // Return book
  function returnBook(id) {
    const student = localStorage.getItem("studentName") || ensureStudentName();
    let books = loadBooks();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return;
    if (books[idx].borrowerName !== student) return alert("You can only return books you borrowed.");
    books[idx].status = "Available";
    books[idx].borrowerName = null;
    saveBooks(books);
    renderAll();
  }

  // global for inline handlers
  window.borrowBook = borrowBook;
  window.returnBook = returnBook;

  // render available list
  function renderAvailable(filter = "") {
    const books = loadBooks();
    const available = books.filter(b => b.status === "Available");
    const filtered = available.filter(b => {
      if (!filter) return true;
      const s = (b.titleName + " " + b.authorName + " " + (b.yearName || "")).toLowerCase();
      return s.includes(filter);
    });

    availableGrid.innerHTML = "";
    if (filtered.length === 0) {
      availableGrid.innerHTML = <div class="card"><p class="kv">No available books.</p></div>;
      return;
    }

    filtered.forEach(b => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <h3>${escapeHtml(b.titleName)}</h3>
        <p><strong>Author:</strong> ${escapeHtml(b.authorName)}</p>
        <p class="kv"><strong>Year:</strong> ${escapeHtml(b.yearName)}</p>
        <div class="card-actions">
          <button class="btn action-small action-return" onclick="borrowBook(${b.id})">📖 Borrow</button>
        </div>
      `;
      availableGrid.appendChild(el);
    });
  }

  // render my borrowed
  function renderMyBorrowed(filter = "") {
    const student = localStorage.getItem("studentName") || ensureStudentName();
    const books = loadBooks();
    const mine = books.filter(b => b.status === "Borrowed" && b.borrowerName === student);
    const filtered = mine.filter(b => {
      if (!filter) return true;
      const s = (b.titleName + " " + b.authorName + " " + (b.yearName || "")).toLowerCase();
      return s.includes(filter);
    });

    myBorrowedGrid.innerHTML = "";
    if (filtered.length === 0) {
      myBorrowedGrid.innerHTML = <div class="card"><p class="kv">You have not borrowed any books.</p></div>;
      return;
    }

    filtered.forEach(b => {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <h3>${escapeHtml(b.titleName)}</h3>
        <p><strong>Author:</strong> ${escapeHtml(b.authorName)}</p>
        <p class="kv"><strong>Year:</strong> ${escapeHtml(b.yearName)}</p>
        <div class="card-actions">
          <button class="btn action-small action-delete" onclick="returnBook(${b.id})">🔄 Return</button>
        </div>
      `;
      myBorrowedGrid.appendChild(el);
    });
  }

  // search handler
  if (studentSearch) {
    studentSearch.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      renderAvailable(q);
      renderMyBorrowed(q);
    });
  }

  // escape html helper
  function escapeHtml(text) {
    if (!text && text !== 0) return "";
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // render all
  function renderAll() {
    const q = studentSearch ? studentSearch.value.trim().toLowerCase() : "";
    renderAvailable(q);
    renderMyBorrowed(q);
    applyDarkModeUI();
  }

  // initial load
  ensureStudentName();
  renderAll();
})();


