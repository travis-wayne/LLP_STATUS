const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

const contents = document.querySelectorAll(".content_display");
const dashboard = document.getElementById("dashboard");
const parts = document.getElementById("parts");
const form = document.getElementById("form");
const dashboardLink = document.getElementById("dashboard_link");
const partsLink = document.getElementById("parts_link");
const formLink = document.getElementById("form_link");

function displayContents(ele) {
  contents.forEach((con) => con.classList.add("hidden"));
  ele.classList.remove("hidden");
}

function updateDisplay() {
  const state = window.location.hash.slice(1);
  switch (state) {
    case "dashboard":
      displayContents(dashboard);
      active(dashboardLink);
      break;
    case "parts":
      displayContents(parts);
      active(partsLink);
      break;
    case "log":
      displayContents(form);
      active(formLink);
      break;

    default:
      break;
  }
}
window.addEventListener("hashchange", updateDisplay);
window.addEventListener("load", updateDisplay);

function active(ele) {
  allSideMenu.forEach((i) => {
    i.parentElement.classList.remove("active");
  });
  ele.classList.add("active");
}

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

// Aircraft dropdown menu
const dropdown = document.getElementById("custom_dropdown");
const selectedOption = document.getElementById("selected_option");
const dropdownContent = document.getElementById("custom_dropdown_content");
const planeHeading = document.querySelector(".plane_heading");
const tatElement = document.querySelector("#tat_value");
const tetElement = document.querySelector("#tet_value");
const landingsElement = document.querySelector("#landings_value");
let tetsohElement = document.querySelector("#tetsoh_value");

async function populatePlanesDropdown() {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/planes`);
    const data = await res.json();

    data.forEach((dt) => {
      const option = document.createElement("div");
      option.classList.add("custom-dropdown-option");
      option.textContent = dt.name;

      option.addEventListener("click", () => {
        localStorage.setItem("aircraft", dt.name);
        tableData(dt.name);
        selectedOption.innerHTML =
          dt.name + `<i class='bx bxs-chevron-down'></i>`;
        planeHeading.innerText = dt.name;
        tatElement.innerText = dt.tat;
        tetElement.innerText = dt.tet;
        landingsElement.innerText = dt.landings;
        tetsohElement.innerText = tetElement.innerText;
      });

      dropdownContent.appendChild(option);
    });
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

populatePlanesDropdown();

dropdown.addEventListener("click", () => {
  dropdownContent.classList.toggle("hidden");
  selectedOption.classList.remove("flash");
});

//Bar-chart
function generateRandomData(length) {
  var randomData = [];
  for (var i = 0; i < length; i++) {
    randomData.push(Math.floor(Math.random() * 10));
  }
  return randomData;
}

var analyticsData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Life Limited Parts",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
      data: generateRandomData(12), // Assuming 12 months
    },
  ],
};

// Function to display analytics chart
function displayAnalyticsChart() {
  const chartCanvas = document
    .getElementById("analytics-chart")
    .getContext("2d");
  new Chart(chartCanvas, {
    type: "bar",
    data: analyticsData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
document.addEventListener("DOMContentLoaded", function () {
  displayAnalyticsChart();
});

// table data
const partsTable = document.getElementById("parts_table");
const dashboardTable = document.getElementById("dashboard_table");
let tableTotal = document.querySelectorAll(".head h3 span");

async function tableData(aircraft) {
  try {
    partsTable.innerHTML = ``;
    dashboardTable.innerHTML = ``;

    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/parts/${aircraft}`
    );
    const data = await res.json();

    tableTotal.forEach((total) => (total.innerHTML = `(${data.length})`));
    let serial = 1;
    data.map((dt) => {
      let markup = `<tr>
			<td>${serial++}</td>
			<td>${dt.description}</td>
			<td>${dt.number || "-"}</td>
			<td>${dt.quantity || "-"}</td>
			<td>${dt.ac || "-"}</td>
			<td>${dt.hrsleft || "-"}</td>
			<td>${dt.date || "-"}</td>
			<td><button class="status ${checkFlag(dt.date)}">${checkFlag(
        dt.date
      )}</button></td>
		</tr>`;

      let html = `<tr>
		<td>${dt.description}</td>
		<td>${dt.hrsleft || "-"}</td>

	</tr>`;

      partsTable.insertAdjacentHTML("beforeend", markup);
      dashboardTable.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.log(err);
  }
}

// Check Flag function
function parseCustomDateFormat(dateString) {
  const months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const [day, monthStr, year] = dateString.split("-");
  const month = months[monthStr.toLowerCase()];
  return new Date(parseInt(year, 10) + 2000, month, parseInt(day, 10));
}

function checkFlag(inputDate) {
  if (!inputDate) return "pending";
  const inputDateObject = parseCustomDateFormat(inputDate);

  const currentDate = new Date();

  if (inputDateObject < currentDate || inputDateObject == currentDate) {
    return "unserviceable";
  } else if (inputDateObject > currentDate) {
    return "serviceable";
  }
}

// Overlay and Modal
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal_new");
const addPart = document.getElementById("addPart");

addPart.addEventListener("click", (e) => {
  e.preventDefault();
  if (!planeHeading.innerText) return;
  openModal();
});

function openModal() {
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function closeModal() {
  overlay.classList.add("hidden");
  modal.classList.add("hidden");
}

//Add part
const addPartForm = document.getElementById("addPartForm");
const descriptionInput = document.getElementById("description");
const partNum = document.getElementById("partNum");
const quantity = document.getElementById("quantity");
const acHrs = document.getElementById("acHrs");
const hrsLeft = document.getElementById("hrsLeft");
const date = document.getElementById("date");
const addPartFormMsg = document.getElementById("addPartFormMsg");

function reformatDate(date) {
  if (!date) return null;
  const originalDate = new Date(date);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-UK", options).format(
    originalDate
  );
  return formattedDate.trim().split(" ").join("-");
}

function reformatDate(date) {
  if (!date) return null;
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const [year, month, day] = date.split("-");
  const monthAbbrev = months[parseInt(month, 10) - 1];
  const yearLastTwoDigits = year.slice(-2);

  const formattedDate = `${parseInt(
    day,
    10
  )}-${monthAbbrev}-${yearLastTwoDigits}`;

  return formattedDate;
}

addPartForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newData = {
    aircraft: localStorage.getItem("aircraft"),
    description: descriptionInput.value || null,
    number: partNum.value || null,
    quantity: quantity.value || null,
    ac: acHrs.value || null,
    hrsleft: hrsLeft.value || null,
    date: reformatDate(date.value),
  };
  console.log(newData)

//   addToPart(newData);
});

async function addToPart(data) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/parts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      addPartFormMsg.innerText = "Part Added";
      addPartFormMsg.style.color = "green";

      setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    console.log(err);
  }
}
