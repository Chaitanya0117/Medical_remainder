const appointmentForm = document.getElementById("appointment-form");
const appointmentContainer = document.getElementById("appointment-container");

function loadAppointments() {
  const user = getCurrentUser();
  if (!user.appointments) user.appointments = [];
  appointmentContainer.innerHTML = "";

  user.appointments.forEach((app, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <p><strong>${app.doctor}</strong> on ${app.date} at ${app.time}</p>
      <button class="btn btn-secondary small" onclick="deleteAppointment(${index})">Delete</button>
    `;
    appointmentContainer.appendChild(card);
  });
}

appointmentForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const doctor = document.getElementById("appointment-doctor").value.trim();
  const date = document.getElementById("appointment-date").value;
  const time = document.getElementById("appointment-time").value;

  if (!doctor || !date || !time) { alert("Please enter all fields!"); return; }

  const user = getCurrentUser();
  user.appointments.push({ doctor, date, time });
  updateUser(user);
  loadAppointments();
  appointmentForm.reset();
});

function deleteAppointment(index) {
  const user = getCurrentUser();
  user.appointments.splice(index, 1);
  updateUser(user);
  loadAppointments();
}

if (appointmentContainer) loadAppointments();
