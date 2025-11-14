// login.js
(() => {
  const form = document.getElementById("login-form");
  const errorEl = document.getElementById("login-error");

  // If already logged-in in this session, go to dashboard
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "dashboard.html";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Hardcoded credentials
    const ADMIN_USER = "admin";
    const ADMIN_PASS = "library123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("isLoggedIn", "true");
      // redirect
      window.location.href = "dashboard.html";
    } else {
      errorEl.style.display = "block";
      errorEl.textContent = "Invalid username or password.";
      setTimeout(() => (errorEl.style.display = "none"), 4000);
    }
  });
})();


