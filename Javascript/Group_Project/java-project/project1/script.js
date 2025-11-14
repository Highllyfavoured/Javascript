/* ===========================
   GLOBAL STORAGE HANDLERS
=========================== */
let menuItems = JSON.parse(localStorage.getItem("menuItems")) || [
  { name: "Cappuccino", price: 3500, description: "Rich espresso with steamed milk", category: "Drinks" },
  { name: "Milkshake", price: 7000, description: "Milky drink", category: "Drinks" },
  { name: "Rice and Chicken", price: 9000, description: "Delicious basmati rice with Chicken", category: "Food" },
  { name: "Pasta", price: 12000, description: "Creamy Alfredo pasta", category: "Food" },
  { name: "Velvet Cake", price: 2500, description: "Classic velvet cake", category: "Desserts" },
  { name: "Brownie", price: 2850, description: "Chocolate fudge brownie", category: "Desserts" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "All";
let searchQuery = "";

/* ===========================
   CUSTOMER PAGE FUNCTIONS
=========================== */
function displayMenu() {
  let menuDiv = document.getElementById("menu");
  if (!menuDiv) return;

  menuDiv.innerHTML = "";

  let filteredItems = menuItems.filter(item =>
    (currentCategory === "All" || item.category === currentCategory) &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredItems.length === 0) {
    menuDiv.innerHTML = `<p class="fade-in">No items match your search.</p>`;
    return;
  }

  filteredItems.forEach((item, index) => {
    let card = document.createElement("div");
    card.className = "menu-item fade-in";
    card.innerHTML = `
      <b>${item.name}</b> - ₦${item.price.toLocaleString()} <br>
      <small>${item.description}</small><br>
      <button onclick="addToCart(${menuItems.indexOf(item)})">Add to Cart</button>
    `;
    menuDiv.appendChild(card);
  });
}

function filterMenu(category) {
  currentCategory = category;
  document.querySelectorAll("#filters button").forEach(btn => btn.classList.remove("active"));
  [...document.querySelectorAll("#filters button")].find(b => b.textContent === category).classList.add("active");
  displayMenu();
}

function searchMenu() {
  searchQuery = document.getElementById("searchBar").value;
  displayMenu();
}

function addToCart(index) {
  let item = menuItems[index];
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();

  // Animate cart icon
  let cartIcon = document.getElementById("cartIcon");
  if (cartIcon) {
    cartIcon.classList.add("pulse");
    setTimeout(() => cartIcon.classList.remove("pulse"), 600);
  }
}

function updateCart() {
  let cartDiv = document.getElementById("cart");
  if (!cartDiv) return;

  cartDiv.innerHTML = "<h3>Your Cart</h3>";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;
    cartDiv.innerHTML += `
      <p class="fade-in">
        ${item.name} - ₦${item.price.toLocaleString()}
        <button class="myBtn" onclick="removeFromCart(${i})">Remove</button>
      </p>
    `;
  });

  cartDiv.innerHTML += `<p><b>Total: ₦${total.toLocaleString()}</b></p>`;
  document.getElementById("cartCount").textContent = cart.length;
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function checkout() {
  let name = document.getElementById("custName").value.trim();
  let table = document.getElementById("tableNo").value.trim();
  if (!name || !table) {
    toast("⚠️ Please fill in all checkout details.", "error");
    return;
  }

  toast(`✅ Thank you ${name}! Your order has been placed for Table ${table}.`, "success");
  cart = [];
  localStorage.removeItem("cart");
  updateCart();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("menu")) {
    displayMenu();
    updateCart();
  }
  let logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isStaffLoggedIn");
      toast("👋 Thank you for visiting FreshBite Café!", "info");
      setTimeout(() => window.location.href = "index.html", 1500);
    });
  }
});

/* ===========================
   STAFF DASHBOARD
=========================== */
function saveMenu() {
  localStorage.setItem("menuItems", JSON.stringify(menuItems));
}

function displayStaffMenu() {
  let theMenu = document.getElementById("menuList");
  if (!theMenu) return;
  theMenu.innerHTML = "";

  menuItems.forEach((item, index) => {
    theMenu.innerHTML += `
      <div class="menu-item fade-in">
        <b>${item.name}</b> - ₦${item.price.toLocaleString()} <br>
        <small>${item.description}</small><br>
        Category: ${item.category} <br>
        <button onclick="editPrice(${index})">Edit Price</button>
        <button onclick="removeMenuItem(${index})">Remove</button>
      </div>
    `;
  });
}

function addMenuItem() {
  let name = document.getElementById("itemName").value.trim();
  let price = parseFloat(document.getElementById("itemPrice").value);
  let description = document.getElementById("itemDesc").value.trim();
  let category = document.getElementById("itemCategory").value;

  if (!name || !price || !description || !category) {
    toast("⚠️ Please fill all fields", "error");
    return;
  }

  menuItems.push({ name, price, description, category });
  saveMenu();
  displayStaffMenu();
  toast(`🍴 ${name} added successfully!`, "success");

  // Clear form
  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemDesc").value = "";
}

function removeMenuItem(index) {
  toast(`❌ ${menuItems[index].name} removed`, "error");
  menuItems.splice(index, 1);
  saveMenu();
  displayStaffMenu();
}

function editPrice(index) {
  let newPrice = prompt("Enter new price:", menuItems[index].price);
  if (newPrice && !isNaN(newPrice)) {
    menuItems[index].price = parseFloat(newPrice);
    saveMenu();
    displayStaffMenu();
    toast("💲 Price updated!", "success");
  }
}

if (document.getElementById("menuList")) {
  displayStaffMenu();
}

const dark = document.getElementById("dark")
dark.onclick = function() {
  document.body.classList.toggle("dark-mode");
}


/* ===========================
   STAFF LOGIN
=========================== */
function staffLogin() {
  let userName = document.getElementById("username").value.trim();
  let passWord = document.getElementById("password").value.trim();

  if (!userName || !passWord) {
    toast("⚠️ Please fill in both fields", "error");
    return;
  }

  if (userName === "admin" && passWord === "cafe123") {
    localStorage.setItem("isStaffLoggedIn", "true");
    toast("✅ Login successful! Redirecting...", "success");
    setTimeout(() => window.location.href = "staff-dashboard.html", 1500);
  } else {
    toast("❌ Invalid credentials. Try again.", "error");
  }
}

/* ===========================
   TOAST NOTIFICATION SYSTEM
=========================== */
function toast(message, type = "info") {
  let toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
