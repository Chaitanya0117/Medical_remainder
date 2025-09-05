const recordForm = document.getElementById("record-form");
const recordContainer = document.getElementById("record-container");

function getCurrentUser() {
  const username = localStorage.getItem("currentUser");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  return users.find(u => u.username === username);
}

function updateUser(user) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const index = users.findIndex(u => u.username === user.username);
  if (index > -1) {
    users[index] = user;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function displayRecords() {
  const user = getCurrentUser();
  if (!user || !user.records || user.records.length === 0) {
    recordContainer.innerHTML = "<p>No health records added yet.</p>";
    return;
  }

  recordContainer.innerHTML = "";
  user.records.forEach((rec, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <p><strong>${rec.description}</strong></p>
      ${rec.fileData ? `<a href="${rec.fileData}" target="_blank" download="${rec.fileName}" class="btn btn-primary small">Open File</a>` : ""}
      <button class="btn btn-secondary small" data-index="${index}">Delete</button>
    `;
    recordContainer.appendChild(card);
  });

  document.querySelectorAll(".item-card .btn-secondary").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      user.records.splice(index, 1);
      updateUser(user);
      displayRecords();
    });
  });
}

recordForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("record-description").value.trim();
  const fileInput = document.getElementById("record-file");
  const file = fileInput.files[0];

  if (!description || !file) {
    alert("Please enter description and select a file!");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const user = getCurrentUser();
    if (!user.records) user.records = [];
    user.records.push({
      description,
      fileData: reader.result,
      fileName: file.name
    });
    updateUser(user);
    recordForm.reset();
    displayRecords();
  };
  reader.readAsDataURL(file);
});

if (recordContainer) displayRecords();