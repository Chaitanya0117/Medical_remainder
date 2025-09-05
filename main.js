// ---------- UTILITY FUNCTIONS ----------
function getUsers(){return JSON.parse(localStorage.getItem("users")||"[]");}
function saveUsers(users){localStorage.setItem("users",JSON.stringify(users));}
function setCurrentUser(username){localStorage.setItem("currentUser",username);}
function getCurrentUser(){const username=localStorage.getItem("currentUser");return getUsers().find(u=>u.username===username);}
function updateUser(user){const users=getUsers();const index=users.findIndex(u=>u.username===user.username);if(index>-1){users[index]=user;saveUsers(users);}}

// Toast
function showToast(msg,type="success"){let c=document.getElementById("toast-container");if(!c){c=document.createElement("div");c.id="toast-container";c.style.position="fixed";c.style.top="20px";c.style.right="20px";c.style.zIndex="9999";document.body.appendChild(c);}const t=document.createElement("div");t.classList.add("toast");t.style.background=type==="error"?"#f44336":"#333";t.style.color="white";t.style.padding="10px 20px";t.style.borderRadius="6px";t.style.marginBottom="10px";t.style.boxShadow="0 2px 6px rgba(0,0,0,0.2)";t.textContent=msg;c.appendChild(t);setTimeout(()=>t.remove(),4000);}

// ---------- LOGOUT ----------
document.getElementById("logout-btn")?.addEventListener("click",()=>{
    localStorage.removeItem("currentUser");
    window.location.href="login.html";
});

// ---------- TAB SWITCHING ----------
document.querySelectorAll(".tab-btn")?.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
});

// ---------- DASHBOARD DATA ----------
const profileAvatar=document.getElementById("profile-avatar");
const profileUpload=document.getElementById("profile-upload");

function loadDashboard(){
    const user=getCurrentUser();
    if(!user)return window.location.href="login.html";

    // Quick summary
    document.getElementById("summary-blood-type").textContent=user.bloodType||"Not set";
    document.getElementById("summary-allergies").textContent=user.allergies||"None";
    document.getElementById("summary-abha-id").textContent=user.abhaId||"Not set";
    document.getElementById("summary-emergency-contact").textContent=user.emergencyContact||"Not set";

    // Profile
    document.getElementById("username-display").textContent=user.username;
    document.getElementById("email-display").textContent=user.email;
    if(user.avatar){profileAvatar.style.backgroundImage=`url(${user.avatar})`;profileAvatar.textContent="";}

    // Fill forms
    document.getElementById("edit-phone").value=user.phone||"";
    document.getElementById("edit-address").value=user.address||"";
    document.getElementById("blood-type").value=user.bloodType||"";
    document.getElementById("allergies").value=user.allergies||"";
    document.getElementById("abha-id").value=user.abhaId||"";
    document.getElementById("emergency-contact").value=user.emergencyContact||"";
    document.getElementById("insurance").value=user.insurance||"";
    document.getElementById("conditions").value=user.conditions||"";
}

// ---------- PROFILE UPLOAD ----------
document.getElementById("upload-btn")?.addEventListener("click",()=>{
    const file=profileUpload.files[0];
    if(!file)return showToast("Please select a profile picture","error");
    const reader=new FileReader();
    reader.onload=()=>{
        const user=getCurrentUser();
        user.avatar=reader.result;
        updateUser(user);
        profileAvatar.style.backgroundImage=`url(${reader.result})`;
        profileAvatar.textContent="";
        showToast("Profile picture updated!");
    };
    reader.readAsDataURL(file);
});

// ---------- SAVE PERSONAL & MEDICAL DETAILS ----------
document.getElementById("all-details-form")?.addEventListener("submit",e=>{
    e.preventDefault();
    const user=getCurrentUser();
    user.phone=document.getElementById("edit-phone").value;
    user.address=document.getElementById("edit-address").value;
    user.bloodType=document.getElementById("blood-type").value;
    user.allergies=document.getElementById("allergies").value;
    user.abhaId=document.getElementById("abha-id").value;
    user.emergencyContact=document.getElementById("emergency-contact").value;
    user.insurance=document.getElementById("insurance").value;
    user.conditions=document.getElementById("conditions").value;
    updateUser(user);
    showToast("All details saved!");
    loadDashboard();
});

// ---------- HEALTH RECORDS ----------
const recordForm=document.getElementById("record-form");
const recordContainer=document.getElementById("record-container");

function loadRecords(){
    const user=getCurrentUser();
    if(!user.records)user.records=[];
    recordContainer.innerHTML="";
    if(user.records.length===0){recordContainer.innerHTML="<p>No health records added yet.</p>";return;}
    user.records.forEach((rec,index)=>{
        const card=document.createElement("div");
        card.className="item-card";
        card.innerHTML=`
            <span><strong>${rec.description}</strong></span>
            ${rec.file?`<a href="${rec.file}" target="_blank" download="${rec.fileName||'record'}" class="btn btn-primary small">Open File</a>`:""}
            <button class="btn btn-secondary small" onclick="deleteRecord(${index})">Delete</button>
        `;
        recordContainer.appendChild(card);
    });
}

recordForm?.addEventListener("submit",e=>{
    e.preventDefault();
    const desc=document.getElementById("record-description").value.trim();
    const fileInput=document.getElementById("record-file");
    const file=fileInput.files[0];
    if(!desc||!file)return showToast("Please provide description and select file","error");
    const reader=new FileReader();
    reader.onload=()=>{
        const user=getCurrentUser();
        user.records.push({description:desc,file:reader.result,fileName:file.name});
        updateUser(user);
        loadRecords();
        showToast("Health record added!");
        recordForm.reset();
    };
    reader.readAsDataURL(file);
});

window.deleteRecord=function(index){
    const user=getCurrentUser();
    user.records.splice(index,1);
    updateUser(user);
    loadRecords();
    showToast("Health record deleted!");
};

// ---------- MEDICATION REMINDERS ----------
const reminderForm=document.getElementById("reminder-form");
const reminderContainer=document.getElementById("reminder-container");

function loadReminders(){
    const user=getCurrentUser();
    if(!user.reminders)user.reminders=[];
    reminderContainer.innerHTML="";
    user.reminders.forEach((rem,index)=>{
        const card=document.createElement("div");
        card.className="item-card";
        card.innerHTML=`<span>${rem.name} at ${rem.time}</span>
        <button class="btn btn-secondary small" onclick="deleteReminder(${index})">Delete</button>`;
        reminderContainer.appendChild(card);
    });
}

reminderForm?.addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.getElementById("medication-name").value;
    const time=document.getElementById("reminder-time").value;
    const user=getCurrentUser();
    user.reminders.push({name,time});
    updateUser(user);
    loadReminders();
    showToast("Reminder added!");
    reminderForm.reset();
});

window.deleteReminder=function(index){
    const user=getCurrentUser();
    user.reminders.splice(index,1);
    updateUser(user);
    loadReminders();
    showToast("Reminder deleted!");
};

// ---------- DOCTOR APPOINTMENTS ----------
const appointmentForm=document.getElementById("appointment-form");
const appointmentContainer=document.getElementById("appointment-container");

function loadAppointments(){
    const user=getCurrentUser();
    if(!user.appointments)user.appointments=[];
    appointmentContainer.innerHTML="";
    user.appointments.forEach((app,index)=>{
        const card=document.createElement("div");
        card.className="item-card";
        card.innerHTML=`<span>${app.doctor} on ${app.date} at ${app.time}</span>
        <button class="btn btn-secondary small" onclick="deleteAppointment(${index})">Delete</button>`;
        appointmentContainer.appendChild(card);
    });
}

appointmentForm?.addEventListener("submit",e=>{
    e.preventDefault();
    const doctor=document.getElementById("appointment-doctor").value;
    const date=document.getElementById("appointment-date").value;
    const time=document.getElementById("appointment-time").value;
    const user=getCurrentUser();
    user.appointments.push({doctor,date,time});
    updateUser(user);
    loadAppointments();
    showToast("Appointment added!");
    appointmentForm.reset();
});

window.deleteAppointment=function(index){
    const user=getCurrentUser();
    user.appointments.splice(index,1);
    updateUser(user);
    loadAppointments();
    showToast("Appointment deleted!");
};

// ---------- INITIALIZE DASHBOARD ----------
loadDashboard();
loadRecords();
loadReminders();
loadAppointments();