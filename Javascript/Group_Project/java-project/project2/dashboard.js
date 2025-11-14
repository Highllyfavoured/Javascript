// dashboard.js
(() => {
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
    return;
  }

  const LIB_KEY = "libraryBooks";
  const openAddBtn = document.getElementById("openAddBtn");
  const bookModal = document.getElementById("bookModal");
  const bookForm = document.getElementById("bookForm");
  const modalTitle = document.getElementById("modalTitle");
  const cancelModalBtn = document.getElementById("cancelModalBtn");
  const searchBox = document.getElementById("searchBox");
  const booksTableBody = document.getElementById("booksTableBody");
  const librarianBorrowed = document.getElementById("librarianBorrowed");
  const logoutBtn = document.getElementById("logoutBtn");
  const darkModeBtn = document.getElementById("darkModeBtn");

  const titleInput = document.getElementById("bookTitle");
  const authorInput = document.getElementById("bookAuthor");
  const yearInput = document.getElementById("bookYear");
  const descInput = document.getElementById("bookDesc");

  const errTitle = document.getElementById("errTitle");
  const errAuthor = document.getElementById("errAuthor");
  const errYear = document.getElementById("errYear");
  const errDesc = document.getElementById("errDesc");

  const deleteModal = document.getElementById("deleteModal");
  const yesDeleteBtn = document.getElementById("yesDeleteBtn");
  const noDeleteBtn = document.getElementById("noDeleteBtn");

  let books = JSON.parse(localStorage.getItem(LIB_KEY)) || [];
  let editingId = null;
  let pendingDeleteId = null;

  window.editBook = editBook;
  window.confirmDelete = confirmDelete;
  window.forceReturn = forceReturn;

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

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }

  function openModal(mode = "add", book = null) {
    clearErrors();
    if (mode === "add") {
      modalTitle.textContent = "Add New Book";
      editingId = null;
      bookForm.reset();
    } else {
      modalTitle.textContent = "Edit Book";
      editingId = book.id;
      titleInput.value = book.titleName;
      authorInput.value = book.authorName;
      yearInput.value = book.yearName;
      descInput.value = book.descrName;
    }
    bookModal.classList.add("show");
    bookModal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    bookModal.classList.remove("show");
    bookModal.setAttribute("aria-hidden", "true");
    editingId = null;
    bookForm.reset();
  }
  openAddBtn.addEventListener("click", () => openModal("add"));
  cancelModalBtn.addEventListener("click", closeModal);

  function clearErrors() {
    [errTitle, errAuthor, errYear, errDesc].forEach(n => {
      if (n) { n.style.display = "none"; n.textContent = ""; }
    });
  }
  function validateBookInput(title, author, year, desc) {
    let ok = true;
    clearErrors();
    if (!title) { errTitle.style.display = "block"; errTitle.textContent = "Title required"; ok = false; }
    if (!author) { errAuthor.style.display = "block"; errAuthor.textContent = "Author required"; ok = false; }
    if (!year) { errYear.style.display = "block"; errYear.textContent = "Year required"; ok = false; }
    if (!desc) { errDesc.style.display = "block"; errDesc.textContent = "Description required"; ok = false; }
    return ok;
  }

  bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = yearInput.value.trim();
    const desc = descInput.value.trim();
    if (!validateBookInput(title, author, year, desc)) return;

    if (editingId) {
      books = books.map(b => b.id === editingId
        ? { ...b, titleName: title, authorName: author, yearName: year, descrName: desc }
        : b
      );
    } else {
      const newBook = {
        id: Date.now(),
        titleName: title,
        authorName: author,
        yearName: year,
        descrName: desc,
        status: "Available",
        borrowerName: null
      };
      books.push(newBook);
    }

    localStorage.setItem(LIB_KEY, JSON.stringify(books));
    closeModal();
    renderBooks(searchBox.value.trim().toLowerCase());
    renderBorrowedHistory();
  });

  function renderBooks(filter = "") {
    booksTableBody.innerHTML = "";
    const list = books.filter(b => {
      if (!filter) return true;
      const s = (b.titleName + " " + b.authorName + " " + (b.yearName || "")).toLowerCase();
      return s.includes(filter);
    });

    if (list.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="6" style="text-align:center; padding:20px; color:var(--muted)">No books found</td>`;
      booksTableBody.appendChild(tr);
      return;
    }

    list.forEach(b => {
      const tr = document.createElement("tr");
      const statusPill = `<span class="pill ${b.status === "Available" ? "available" : "borrowed"}">${b.status}</span>`;
      const borrowerText = b.borrowerName ? `<span>${escapeHtml(b.borrowerName)}</span>` : "";
      tr.innerHTML = `
        <td><strong>${escapeHtml(b.titleName)}</strong></td>
        <td>${escapeHtml(b.authorName)}</td>
        <td>${escapeHtml(b.yearName)}</td>
        <td>${statusPill}</td>
        <td>${borrowerText}</td>
        <td>
          <button class="action-small action-edit" onclick="editBook(${b.id})">Edit</button>
          <button class="action-small action-delete" onclick="confirmDelete(${b.id})">Delete</button>
          ${b.status === "Borrowed" ? `<button class="action-small action-return" onclick="forceReturn(${b.id})">Mark Returned</button>` : ``}
        </td>
      `;
      booksTableBody.appendChild(tr);
    });
  }

  function renderBorrowedHistory() {
    librarianBorrowed.innerHTML = "";
    const borrowed = books.filter(b => b.status === "Borrowed");
    if (borrowed.length === 0) {
      librarianBorrowed.innerHTML = `<p class="kv">No borrowed books currently.</p>`;
      return;
    }
    borrowed.forEach(b => {
      const d = document.createElement("div");
      d.className = "card";
      d.innerHTML = `
        <h3>${escapeHtml(b.titleName)}</h3>
        <p><strong>Author:</strong> ${escapeHtml(b.authorName)}</p>
        <p><strong>Borrower:</strong> ${escapeHtml(b.borrowerName || "—")}</p>
        <div class="card-actions">
          <button class="btn action-return" onclick="forceReturn(${b.id})">Mark Returned</button>
        </div>
      `;
      librarianBorrowed.appendChild(d);
    });
  }

  function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;
    openModal("edit", book);
  }

  function confirmDelete(id) {
    pendingDeleteId = id;
    deleteModal.classList.add("show");
    deleteModal.setAttribute("aria-hidden", "false");
  }

  noDeleteBtn.addEventListener("click", () => {
    pendingDeleteId = null;
    deleteModal.classList.remove("show");
    deleteModal.setAttribute("aria-hidden", "true");
  });

  yesDeleteBtn.addEventListener("click", () => {
    if (pendingDeleteId == null) return;
    books = books.filter(b => b.id !== pendingDeleteId);
    localStorage.setItem(LIB_KEY, JSON.stringify(books));
    pendingDeleteId = null;
    deleteModal.classList.remove("show");
    deleteModal.setAttribute("aria-hidden", "true");
    renderBooks(searchBox.value.trim().toLowerCase());
    renderBorrowedHistory();
  });

  function forceReturn(id) {
    books = books.map(b => b.id === id
      ? { ...b, status: "Available", borrowerName: null }
      : b
    );
    localStorage.setItem(LIB_KEY, JSON.stringify(books));
    renderBooks(searchBox.value.trim().toLowerCase());
    renderBorrowedHistory();
  }

  function escapeHtml(text) {
    if (!text && text !== 0) return "";
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  searchBox.addEventListener("input", (e) => {
    renderBooks(e.target.value.trim().toLowerCase());
  });

  function init() {
    books = JSON.parse(localStorage.getItem(LIB_KEY)) || [];
    renderBooks();
    renderBorrowedHistory();
    applyDarkModeUI();
  }

  init();
})();