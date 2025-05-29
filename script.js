document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const roleSelect = document.getElementById("role-select");
  const views = document.querySelectorAll(".view");
  document.getElementById("back-to-dashboard").addEventListener("click", () => {
    document.getElementById("booking-page").classList.remove("active");
    document.getElementById("user-dashboard").classList.add("active");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const role = roleSelect.value;
    views.forEach((view) => view.classList.remove("active"));
    document.getElementById(`${role}-dashboard`).classList.add("active");
  });

  const swiper = new Swiper(".swiper-container", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  const services = [
    { name: "Haircut", price: "$30", image: "images/hair.jpg" },
    { name: "Facial", price: "$50", image: "images/face.jpg" },
    { name: "Massage", price: "$70", image: "images/massage.jpg" },
    { name: "Nails", price: "$30", image: "images/nails.jpg" },
  ];

  const serviceCardsContainer = document.getElementById("service-cards");
  services.forEach((service) => {
    const card = document.createElement("div");
    card.className = "swiper-slide";
    card.innerHTML = `
        <img src="${service.image}" alt="${service.name}" style="width:100%; border-radius:10px;">
        <h3>${service.name}   ${service.price}</h3>
      `;
    card.addEventListener("click", () => {
      const detailsContainer = document.getElementById("service-details");

      // Clear previous details
      detailsContainer.innerHTML = "";

      // Create details content dynamically
      const detailCard = document.createElement("div");
      detailCard.style.background = "rgba(255, 255, 255, 0.15)";
      detailCard.style.backdropFilter = "blur(8px)";
      detailCard.style.borderRadius = "10px";
      detailCard.style.padding = "1rem";
      detailCard.style.color = "white";
      detailCard.style.textAlign = "center";
      detailCard.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
      detailCard.innerHTML = `
    <h2>${service.name} Services</h2>
    <p>Price: ${service.price}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Details about ${service.name} services go here.</p>
  `;

      detailsContainer.appendChild(detailCard);

      // Scroll to the service details
      detailCard.scrollIntoView({ behavior: "smooth" });
    });
  });

  const bookingForm = document.getElementById("booking-form");
  const bookingSuccess = document.getElementById("booking-success");
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    bookingSuccess.classList.remove("hidden");
    setTimeout(() => bookingSuccess.classList.add("hidden"), 3000);
  });
});

// Dummy appointments (normally fetched from backend)
const staffAppointments = [
  {
    id: 1,
    client: "Alice",
    time: "10:00 AM",
    service: "Hair",
    status: "Pending",
  },
  {
    id: 2,
    client: "Bob",
    time: "11:30 AM",
    service: "Massage",
    status: "Pending",
  },
];
function showView(viewId) {
  // Hide all views
  const views = document.querySelectorAll(".view");
  views.forEach((view) => (view.style.display = "none"));

  // Show the selected view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.style.display = "block";

    // If showing the profile, render appointments
    if (viewId === "user-profile") {
      renderAppointments(upcoming, "upcomingAppointments");
      renderAppointments(past, "pastAppointments");
    }
  }
}

// Show the selected panel only
function showStaffPanel(panelId) {
  document.querySelectorAll(".staff-panel").forEach((p) => {
    p.style.display = p.id === panelId ? "block" : "none";
  });
}

// Render the appointments list
function renderAppointments() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";

  staffAppointments.forEach((appt) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${appt.client}</strong> - ${appt.service} at ${appt.time} 
      [<em>${appt.status}</em>]
      ${
        appt.status === "Pending"
          ? `<button onclick="markCompleted(${appt.id})">Mark as Done</button>`
          : ""
      }
    `;
    list.appendChild(li);
  });
}
function goBackToDashboard() {
  document.getElementById("user-profile").style.display = "none";

  document.getElementById("user-dashboard").style.display = "block";
}
// Mark appointment as completed
function markCompleted(id) {
  const appt = staffAppointments.find((a) => a.id === id);
  if (appt) appt.status = "Completed";
  renderAppointments();
}

// Handle info update
function updateStaffInfo(e) {
  e.preventDefault();
  const name = document.getElementById("staffName").value;
  const phone = document.getElementById("staffPhone").value;
  const specialties = Array.from(
    document.querySelectorAll('#updateInfoPanel input[type="checkbox"]:checked')
  ).map((cb) => cb.value);

  alert(
    `Info updated!\nName: ${name}\nPhone: ${phone}\nSpecialties: ${specialties.join(
      ", "
    )}`
  );
}

let selectedService = "";
function getSubcategories(category) {
  const subcategories = {
    Hair: ["Haircut", "Coloring", "Styling"],
    Nails: ["Manicure", "Pedicure", "Nail Art"],
    Massage: ["Swedish", "Deep Tissue", "Aromatherapy"],
    Facial: ["Exfoliation", "Hydration", "Anti-aging"],
  };

  return (
    `<option disabled selected>Select a service type</option>` +
    (subcategories[category] || [])
      .map((sub) => `<option value="${sub}">${sub}</option>`)
      .join("")
  );
}

function selectService(category) {
  document.getElementById(
    "calendarTitle"
  ).textContent = `Book a ${category} service`;
  document.getElementById("subcategorySelect").innerHTML =
    getSubcategories(category);
  document.getElementById("calendarModal").style.display = "block";
  fillTimeSlots();
}

function confirmAppointment() {
  const category = document.getElementById("calendarTitle").textContent;
  const subcategory = document.getElementById("subcategorySelect").value;
  const date = document.getElementById("appointmentDate").value;
  const time = document.getElementById("timeSlotSelect").value;

  if (!subcategory || !date || !time) {
    alert("Please select all fields.");
    return;
  }

  const newAppointment = {
    id: Date.now(), // unique ID
    date,
    hour: time,
    service: `${category} - ${subcategory}`,
  };

  upcoming.push(newAppointment);
  renderAppointments(upcoming, "upcomingAppointments");

  alert("Appointment booked!");
  document.getElementById("calendarModal").style.display = "none";
}
// Dummy upcoming list
document.addEventListener("DOMContentLoaded", () => {
  const subcategories = {
    Hair: ["Haircut", "Coloring", "Styling"],
    Nails: ["Manicure", "Pedicure", "Nail Art"],
    Massage: ["Swedish", "Deep Tissue", "Aromatherapy"],
    Facial: ["Exfoliation", "Hydration", "Anti-aging"],
  };

  function openCalendar(category) {
    const modal = document.getElementById("calendarModal");
    const title = document.getElementById("calendarTitle");
    const select = document.getElementById("subcategorySelect");
    const dateInput = document.getElementById("appointmentDate");
    const timeSelect = document.getElementById("timeSlotSelect");

    title.textContent = `Book a ${
      category.charAt(0).toUpperCase() + category.slice(1)
    } service`;

    // Clear and populate dropdown
    select.innerHTML =
      '<option value="" disabled selected>Select a type</option>';
    const options = subcategories[category];

    if (options && options.length) {
      options.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        select.appendChild(option);
      });
    } else {
      console.error(`No subcategories found for category: ${category}`);
    }
    timeSelect.innerHTML =
      '<option value="" disabled selected>Select a time</option>';
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const intervalMinutes = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += intervalMinutes) {
        const timeStr = formatTime(hour, min);
        const option = document.createElement("option");
        option.value = timeStr;
        option.textContent = timeStr;
        timeSelect.appendChild(option);
      }
    }
    dateInput.value = "";
    timeSelect.value = "";
    modal.dataset.category = category;
    modal.style.display = "block";
  }

  function formatTime(hour24, minute) {
    const period = hour24 >= 12 ? "PM" : "AM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    const minStr = minute < 10 ? `0${minute}` : minute;
    return `${hour12}:${minStr} ${period}`;
  }

  function confirmAppointment() {
    const modal = document.getElementById("calendarModal");
    const subcategory = document.getElementById("subcategorySelect").value;
    const date = document.getElementById("appointmentDate").value;
    const time = document.getElementById("timeSlotSelect").value;

    if (!subcategory) return alert("Please choose a service type.");
    if (!date) return alert("Please choose a date.");
    if (!time) return alert("Please choose a time slot.");

    upcoming.push({ id: Date.now(), service: subcategory, date, time });

    alert(`Appointment booked:\n${subcategory} on ${date} at ${time}`);
    closeModal();
  }

  function closeModal() {
    document.getElementById("calendarModal").style.display = "none";
  }

  // Attach card click listeners AFTER DOM is loaded
  document.querySelectorAll(".swiper-slide").forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.getAttribute("data-category");
      openCalendar(category);
    });
  });

  // Expose functions to global scope if needed by buttons
  window.confirmAppointment = confirmAppointment;
  window.closeModal = closeModal;
});

let isRegistering = false;

function toggleAuthMode() {
  isRegistering = !isRegistering;

  document.getElementById("formTitle").textContent = isRegistering
    ? "Register"
    : "Login";
  document.getElementById("submitBtn").textContent = isRegistering
    ? "Register"
    : "Login";
  document.getElementById("toggleModeBtn").textContent = isRegistering
    ? "Login"
    : "Register";

  const adminOption = document.querySelector(
    '#role-select option[value="admin"]'
  );
  adminOption.disabled = isRegistering;

  document.getElementById("login-form").reset();
}

function handleAuth(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role-select").value;

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  if (isRegistering) {
    if (role === "admin") {
      //alert("You cannot register as an admin.");
      return;
    }

    //alert(`Registered ${username} as ${role}.`);

    // Redirect after register
    if (role === "staff") {
      switchToView("staff-dashboard");
    } else {
      switchToView("user-dashboard");
    }

    isRegistering = false;
    toggleAuthMode();
  } else {
    //alert(`Logged in as ${username} (${role})`);

    // Redirect after login
    if (role === "staff") {
      switchToView("staff-dashboard");
    } else if (role === "admin") {
      switchToView("admin-dashboard");
    } else {
      switchToView("user-dashboard");
    }
  }

  document.getElementById("login-form").reset();
}

function switchToView(viewId) {
  document.querySelectorAll(".view").forEach((section) => {
    section.classList.remove("active");
    section.style.display = "none";
  });
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.add("active");
    view.style.display = "block";
  } else {
    console.warn(`No view found with id: ${viewId}`);
  }
}

const dropdown = document.getElementById("role-dropdown");
const btn = dropdown.querySelector(".dropdown-btn");
const menu = dropdown.querySelector(".dropdown-menu");
const hiddenInput = dropdown.querySelector("#role-select");

// Set initial button text to default hidden input value label
const defaultValue = hiddenInput.value;
const defaultLabel = menu.querySelector(
  `li[data-value="${defaultValue}"]`
).textContent;
btn.textContent = defaultLabel;

btn.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

menu.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    btn.textContent = item.textContent;
    hiddenInput.value = item.getAttribute("data-value");
    dropdown.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
  }
});
function showPanel(panelId) {
  document.querySelectorAll(".admin-panel").forEach((p) => {
    p.style.display = p.id === panelId ? "block" : "none";
  });
}

function logout() {
  // Hide all views by setting display:none
  document.querySelectorAll(".view").forEach((view) => {
    view.style.display = "none";
  });

  // Show login-section by setting display:block (or flex/grid as needed)
  const login = document.getElementById("login-section");
  if (login) {
    login.style.display = "block";
  } else {
    console.error("login-section not found");
  }
}

// Render on load
renderAppointments();
showStaffPanel("schedulePanel");

let services = [
  { id: 1, name: "Haircut", price: 30 },
  { id: 2, name: "Massage", price: 60 },
];

let users = [
  { id: 1, name: "Alice", role: "customer" },
  { id: 2, name: "Bob", role: "staff" },
  { id: 3, name: "Carol", role: "customer" },
];

// Show selected panel only
function showPanel(panelId) {
  document.querySelectorAll(".admin-panel").forEach((p) => {
    p.style.display = p.id === panelId ? "block" : "none";
  });
}

// Render services list
function renderServices() {
  const list = document.getElementById("serviceList");
  list.innerHTML = "";
  services.forEach((service) => {
    const li = document.createElement("li");
    li.textContent = `${service.name} - $${service.price.toFixed(2)}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "1rem";
    removeBtn.onclick = () => {
      services = services.filter((s) => s.id !== service.id);
      renderServices();
    };
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Add new service
function addService() {
  const nameInput = document.getElementById("newServiceName");
  const priceInput = document.getElementById("newServicePrice");
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price) || price < 0) {
    alert("Please enter a valid name and price.");
    return;
  }
  const newId = services.length
    ? Math.max(...services.map((s) => s.id)) + 1
    : 1;
  services.push({ id: newId, name, price });
  nameInput.value = "";
  priceInput.value = "";
  renderServices();
}

// Render users list for role assignment
function renderUsers() {
  const list = document.getElementById("userList");
  list.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.name} - Role: ${user.role}`;

    // Toggle role button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent =
      user.role === "customer" ? "Make Staff" : "Make Customer";
    toggleBtn.style.marginLeft = "1rem";
    toggleBtn.onclick = () => {
      user.role = user.role === "customer" ? "staff" : "customer";
      renderUsers();
    };

    // Remove user button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "1rem";
    removeBtn.onclick = () => {
      if (confirm(`Remove user ${user.name}?`)) {
        users = users.filter((u) => u.id !== user.id);
        renderUsers();
      }
    };

    li.appendChild(toggleBtn);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Placeholder report generation functions
function generateReport(type) {
  alert(`Generating ${type} report... (functionality coming soon)`);
}

// Placeholder export functions
function exportReport(format) {
  alert(
    `Exporting report as ${format.toUpperCase()}... (functionality coming soon)`
  );
}
let upcoming = [
  { id: 1, date: "2025-06-01", hour: "2:00 PM", service: "Haircut" },
  { id: 2, date: "2025-06-05", hour: "12:00 PM", service: "Facial" },
];

let past = [{ id: 3, date: "2025-05-01", hour: "3:00 PM", service: "Massage" }];

// Panel switching function
function showUserPanel(panelId) {
  // Hide all panels
  const panels = document.querySelectorAll(".user-panel");
  panels.forEach((panel) => (panel.style.display = "none"));

  // Show selected panel
  document.getElementById(panelId).style.display = "block";

  // If showing appointments panel, render the appointments
  if (panelId === "appointmentsPanel") {
    renderAppointments(upcoming, "upcomingAppointments");
    renderAppointments(past, "pastAppointments");
  }
}

function renderAppointments(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  if (list.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = '<em style="color: #bbaaa0;">No appointments</em>';
    li.style.cssText =
      "padding: 0.5rem 0; border-bottom: 1px solid rgba(186, 170, 160, 0.3);";
    container.appendChild(li);
    return;
  }

  list.forEach((app) => {
    let li = document.createElement("li");
    li.style.cssText =
      "padding: 0.5rem 0; border-bottom: 1px solid rgba(186, 170, 160, 0.3); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;";

    const appointmentInfo = `<div><strong>${app.date}</strong> - ${app.hour} - ${app.service}</div>`;
    const buttons =
      containerId === "upcomingAppointments"
        ? `<div style="display: flex; gap: 0.25rem;">
        <button onclick="cancelAppointment(${app.id})" style="background:rgb(139, 122, 149); color: white; border: none; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Cancel</button>
        <button onclick="rescheduleAppointment(${app.id})" style="background:rgb(112, 88, 119); color: white; border: none; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer;">Reschedule</button>
      </div>`
        : "";

    li.innerHTML = appointmentInfo + buttons;
    container.appendChild(li);
  });
}

function cancelAppointment(id) {
  const confirmBox = confirm(
    "Are you sure you want to cancel this appointment?"
  );
  if (confirmBox) {
    upcoming = upcoming.filter((app) => app.id !== id);
    renderAppointments(upcoming, "upcomingAppointments");
    alert("Appointment cancelled.");
  }
}

function rescheduleAppointment(id) {
  let newDate = prompt("Enter a new date (YYYY-MM-DD):");
  if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
    let app = upcoming.find((app) => app.id === id);
    if (app) {
      app.date = newDate;
      renderAppointments(upcoming, "upcomingAppointments");
      alert("Appointment rescheduled to " + newDate);
    }
  } else if (newDate) {
    alert("Invalid date format. Use YYYY-MM-DD.");
  }
}
function fillTimeSlots() {
  const timeSelect = document.getElementById("timeSlotSelect");
  timeSelect.innerHTML =
    '<option value="" disabled selected>Select a time</option>'; // reset options

  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM
  const intervalMinutes = 30;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const timeStr = formatTime(hour, min);
      const option = document.createElement("option");
      option.value = timeStr;
      option.textContent = timeStr;
      timeSelect.appendChild(option);
    }
  }
}

function changePassword() {
  let current = document.getElementById("currentPassword").value;
  let newPass = document.getElementById("newPassword").value;

  if (!current || !newPass) {
    alert("Please fill in both password fields.");
    return;
  }

  // Clear the fields
  document.getElementById("currentPassword").value = "";
  document.getElementById("newPassword").value = "";

  alert("Password updated successfully!");
}

// Star rating functionality
let selectedRating = 0;

// Initialize star rating when the page loads
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".star").forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.star);
      document.querySelectorAll(".star").forEach((s) => {
        if (parseInt(s.dataset.star) <= selectedRating) {
          s.style.color = "#e0a96d";
        } else {
          s.style.color = "#bbaaa0";
        }
      });
    });
  });
});

function submitFeedback() {
  const description = document.getElementById("feedbackDescription").value;

  if (selectedRating === 0) {
    alert("Please select a star rating.");
    return;
  }

  if (!description.trim()) {
    alert("Please enter your feedback.");
    return;
  }

  alert(
    `Feedback submitted successfully!\nRating: ${selectedRating} stars\nFeedback: ${description}`
  );

  // Clear the form
  selectedRating = 0;
  document.getElementById("feedbackDescription").value = "";
  document.querySelectorAll(".star").forEach((s) => {
    s.style.color = "#bbaaa0";
  });
}

function logout() {
  // You can modify this to match your navigation system
  window.location.href = "index.html";
}

// Show the first panel by default
document.addEventListener("DOMContentLoaded", function () {
  showUserPanel("passwordPanel");
});
