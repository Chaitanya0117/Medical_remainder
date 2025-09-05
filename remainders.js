const reminderForm = document.getElementById("reminder-form");
const reminderContainer = document.getElementById("reminder-container");

function loadReminders() {
  const user = getCurrentUser();
  if (!user.reminders) user.reminders = [];
  reminderContainer.innerHTML = "";

  user.reminders.forEach((rem, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <p><strong>${rem.name}</strong> at ${rem.time}</p>
      <button class="btn btn-secondary small" onclick="deleteReminder(${index})">Delete</button>
    `;
    reminderContainer.appendChild(card);
  });
}

reminderForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("medication-name").value.trim();
  const time = document.getElementById("reminder-time").value;

  if (!name || !time) { alert("Please enter all fields!"); return; }

  const user = getCurrentUser();
  user.reminders.push({ name, time });
  updateUser(user);
  loadReminders();
  reminderForm.reset();
});

function deleteReminder(index) {
  const user = getCurrentUser();
  user.reminders.splice(index, 1);
  updateUser(user);
  loadReminders();
}

if (reminderContainer) loadReminders();
