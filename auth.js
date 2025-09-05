// ---------- UTILITY FUNCTIONS ----------
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function setCurrentUser(username) {
  localStorage.setItem("currentUser", username);
}
function getCurrentUser() {
  const username = localStorage.getItem("currentUser");
  const users = getUsers();
  return users.find(u => u.username === username);
}
function updateUser(user) {
  const users = getUsers();
  const index = users.findIndex(u => u.username === user.username);
  if (index > -1) {
    users[index] = user;
    saveUsers(users);
  }
}
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---------- SIGNUP ----------
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!username || !email || !password) {
    alert("All fields are required!");
    return;
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    alert("Username already exists!");
    return;
  }

  const hashedPassword = await hashPassword(password);
  users.push({
    username,
    email,
    password: hashedPassword,
    bloodType: "",
    allergies: "",
    conditions: "",
    abhaID: "",
    vaccinationStatus: "",
    insurance: "",
    emergencyContact: "",
    preferredHospital: "",
    records: [],
    reminders: [],
    appointments: [],
    profilePic: ""
  });
  saveUsers(users);

  setCurrentUser(username);
  console.log("✅ Signup successful, redirecting to dashboard...");
  window.location.href = "dashboard.html"; // adjust path if needed
});

// ---------- LOGIN ----------
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const hashedPassword = await hashPassword(password);

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === hashedPassword);

  if (user) {
    setCurrentUser(username);
    console.log("✅ Login successful, redirecting to dashboard...");
    window.location.href = "dashboard.html"; // adjust path if dashboard is in a folder
  } else {
    console.error("❌ Invalid login: user not found or wrong password");
    alert("Invalid username or password!");
  }
});

// ---------- DASHBOARD PROTECTION ----------
if (window.location.pathname.includes("dashboard.html")) {
  const user = getCurrentUser();
  if (!user) {
    console.warn("⚠️ No user logged in, redirecting to login...");
    window.location.href = "login.html";
  } else {
    // Fill profile
    document.getElementById("username-display").textContent = user.username;
    document.getElementById("email-display").textContent = user.email;
    document.getElementById("avatar-circle").textContent = user.username.charAt(0).toUpperCase();

    if (user.profilePic) {
      document.getElementById("profile-avatar").style.backgroundImage = `url('${user.profilePic}')`;
      document.getElementById("profile-avatar").style.backgroundSize = "cover";
    }

    // Fill quick summary
    document.getElementById("summary-blood-type").textContent = user.bloodType || "Not set";
    document.getElementById("summary-allergies").textContent = user.allergies || "None";
    document.getElementById("summary-abha-id").textContent = user.abhaID || "Not set";
    document.getElementById("summary-emergency-contact").textContent = user.emergencyContact || "Not set";
  }
}

// ---------- LOGOUT ----------
document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  console.log("👋 User logged out, redirecting to login...");
  window.location.href = "login.html";
});
