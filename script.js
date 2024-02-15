const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

const contents = document.querySelectorAll(".content_display");
const dashboard = document.getElementById("dashboard");
const parts = document.getElementById("parts");
const form = document.getElementById("form");
const reviewlogsPage = document.getElementById("review");
const documentsPage = document.getElementById("documents");
const dashboardLink = document.getElementById("dashboard_link");
const partsLink = document.getElementById("parts_link");
const formLink = document.getElementById("log_link");
const docsLink = document.getElementById("docs_link");

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
    case "review":
      displayContents(reviewlogsPage);
      active(formLink);
      break;
    case "docs":
      displayContents(documentsPage);
      active(docsLink);
      break;

    default:
      break;
  }
}
window.addEventListener("hashchange", updateDisplay);
window.addEventListener("load", () => {
  updateDisplay();
  const aircraft = localStorage.getItem("aircraft");
  const tat = localStorage.getItem("tat");
  const tet = localStorage.getItem("tet");
  const landings = localStorage.getItem("landings");
  const prop = localStorage.getItem("prop");
  tableData(aircraft);
  reviewLogsTable(aircraft);
  docTable(aircraft);
  selectedOption.innerHTML = aircraft
    ? aircraft + `<i class='bx bxs-chevron-down'></i>`
    : `Select Aircraft <i class="bx bxs-chevron-down"></i>`;
  planeHeading.innerText = aircraft;
  tatElement.innerText = tat;
  tetElement.innerText = tet;
  landingsElement.innerText = landings;
  tetsohElement.innerText = tetElement.innerText;
  propElement.innerText = prop;

  // Inspection
  inspectionCheck(tat, tatElement);
  inspectionCheck(tet, tetElement);
  inspectionCheck(prop, propElement);
});

// Inspection Check
function inspectionCheck(num, ele) {
  if (!num) return;
  if (num < 10) {
    return ele.style.color = "var(--dark)";
  }
  const numberStr = num.toString();

  const lastTwoDigits = parseInt(numberStr.slice(-2));
  if (lastTwoDigits === 25 || lastTwoDigits === 50 || lastTwoDigits === 0o0) {
    return ele.style.color = "#8b0000";
  } else if (
    (lastTwoDigits < 25 && lastTwoDigits >= 11) ||
    (lastTwoDigits < 50 && lastTwoDigits >= 36) ||
    (lastTwoDigits < 100 && lastTwoDigits >= 86)
  ) {
   return  ele.style.color = " #ff6700";
  } else {
   return  ele.style.color = "#039203";
  }
}

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

// Current time
const presentDate = document.querySelector(
  "#content main .head-title .left span p"
);
presentDate.innerText = `${new Date().toLocaleString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})}`;

// Aircraft dropdown menu
const dropdown = document.getElementById("custom_dropdown");
const selectedOption = document.getElementById("selected_option");
const dropdownContent = document.getElementById("custom_dropdown_content");
const planeHeading = document.querySelector(".plane_heading");
const tatElement = document.querySelector("#tat_value");
const tetElement = document.querySelector("#tet_value");
const landingsElement = document.querySelector("#landings_value");
let tetsohElement = document.querySelector("#tetsoh_value");
let propElement = document.querySelector("#prop_value");

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
        localStorage.setItem("aircraftID", dt.id);
        localStorage.setItem("tat", dt.tat);
        localStorage.setItem("tet", dt.tet);
        localStorage.setItem("landings", dt.landings);
        localStorage.setItem("prop", dt.prop);
        tableData(dt.name);
        reviewLogsTable(dt.name);
        docTable(dt.name);
        selectedOption.innerHTML =
          dt.name + `<i class='bx bxs-chevron-down'></i>`;
        planeHeading.innerText = dt.name;
        tatElement.innerText = dt.tat;
        tetElement.innerText = dt.tet;
        landingsElement.innerText = dt.landings;
        tetsohElement.innerText = tetElement.innerText;
        propElement.innerText = dt.prop;

        // Inspection
        inspectionCheck(dt.tat, tatElement);
        inspectionCheck(dt.tet, tetElement);
        inspectionCheck(dt.prop, propElement);
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

document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    dropdownContent.classList.add("hidden");
  }
});

//Bar-chart
async function displayAnalyticsChart() {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/planes/parts`);
    const data = await res.json();
    const aircraftArr = data.map((dt) => dt.name);
    const aircraftLength = data.map((dt) => dt.count);

    const analyticsData = {
      labels: aircraftArr,
      datasets: [
        {
          label: "Life Limited Parts",
          backgroundColor: "rgba(60, 145, 230, 0.2)",
          borderColor: "rgba(60, 145, 230, 1)",
          borderWidth: 1,
          data: aircraftLength,
        },
      ],
    };
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
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayAnalyticsChart();
});

// table data
const partsTable = document.getElementById("parts_table");
const dashboardTable = document.getElementById("dashboard_table");
let tableTotal = document.querySelectorAll(".head h3 span");
const removePartModal = document.querySelector("#removePartModal");
const modalStatement = document.querySelector("#removeAircraftModalStatement");
const proceedBtn = document.getElementById("proceedBtn");
const removeAllModals = document.querySelectorAll(".modal");

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
      let value = JSON.stringify(dt);
      let markup = `<tr class="tableTab">
			<td class="table_cell">${serial++}</td>
			<td class="table_cell">${dt.description}</td>
			<td class="table_cell">${dt.number || "-"}</td>
			<td class="table_cell">${dt.quantity || "-"}</td>
			<td class="table_cell">${dt.ac || "-"}</td>
			<td class="table_cell">${dt.hrsleft || "-"}</td>
			<td class="table_cell">${dt.date || "-"}</td>
			<td class="table_cell"><button class="status ${checkFlag(
        dt.date,
        dt.hrsleft
      )}" value='${value}'>${checkFlag(dt.date, dt.hrsleft)}</button></td>
		</tr>`;

      let html = `<tr>
		<td>${dt.description}</td>
		<td><button class="status ${checkFlag(dt.date, dt.hrsleft)}">${checkFlag(
        dt.date,
        dt.hrsleft
      )}</button></td>

	</tr>`;

      partsTable.insertAdjacentHTML("beforeend", markup);
      dashboardTable.insertAdjacentHTML("beforeend", html);
    });
    const tabs = document.querySelectorAll(".tableTab");
    tabs.forEach((tab) => {
      const statusBtn = tab.querySelectorAll(".status");
      let tabData;
      tab.addEventListener("click", () => {
        statusBtn.forEach((btn) => {
          tabData = JSON.parse(btn.value);
          modalStatement.innerText = `Remove ${tabData.description} from ${tabData.aircraft}?`;
          removePartModal.style.display = "block";
          overlay.classList.remove("hidden");
          proceedBtn.addEventListener("click", (e) => {
            e.preventDefault();
            removeFromPart(tabData.id);
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

function closeRemoveModal() {
  removeAllModals.forEach((modal) => (modal.style.display = "none"));
  overlay.classList.add("hidden");
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

function checkFlag(inputDate, hrs) {
  if (!inputDate) {
    if (hrs < 0) {
      return "unserviceable";
    } else if (hrs <= 2 && hrs >= 0) {
      return "due";
    } else {
      return "serviceable";
    }
  }
  const inputDateObject = parseCustomDateFormat(inputDate);

  const currentDate = new Date();
  const daysDifference = Math.floor(
    (inputDateObject - currentDate) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference < 0) {
    return "unserviceable";
  } else if (daysDifference <= 2 && daysDifference >= 0) {
    return "due";
  } else {
    return "serviceable";
  }
}

// Overlay and Modal
const overlay = document.querySelector(".overlay");
const addPartModal = document.querySelector(".modal_new");
const addPart = document.getElementById("addPart");
const modals = document.querySelectorAll("#modal");
const addPlane = document.getElementById("addPlane");
const addPlaneModal = document.querySelector(".addPlaneModal");

addPart.addEventListener("click", (e) => {
  e.preventDefault();
  if (!planeHeading.innerText) return;
  openModal(addPartModal);
});
addPlane.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(addPlaneModal);
});

function openModal(modal) {
  overlay.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function closeModal() {
  overlay.classList.add("hidden");
  modals.forEach((modal) => modal.classList.add("hidden"));
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

function reformatedDate(date) {
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

  renderSpinner(addPartForm);
  addToPart(newData);
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
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
}

// Technical log functionalities
const logForm = document.getElementById("log_form");
const pilotName = document.getElementById("pilotname");
const numOfCrew = document.getElementById("crewmen");
const natureOfFlight = document.getElementById("fnature");
const numOfLandings = document.getElementById("nooflandings");
const flightFrom = document.getElementById("nature-from");
const flightTo = document.getElementById("nature-to");
const takeoffTime = document.getElementById("takeoff");
const landingTime = document.getElementById("landings");
const incident = document.getElementById("incidents");
const actionsTaken = document.getElementById("actions");
const logFormMsg = document.getElementById("logformMsg");
const engineerName = document.getElementById("engineername");
const certDate = document.getElementById("certdate");
const itemMel = document.getElementById("itemmel");
const openDate = document.getElementById("opendate");
const certCategory = document.getElementById("category");
const limitDate = document.getElementById("limitdate");

logForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const logData = {
    aircraft: localStorage.getItem("aircraft"),
    ac: timeDifference(takeoffTime.value, landingTime.value),
    landings: +numOfLandings.value,
  };
  logUpdate(logData);

  const allLogData = {
    aircraft: localStorage.getItem("aircraft"),
    pilot: pilotName.value,
    crew: numOfCrew.value,
    nature: natureOfFlight.value,
    landings: numOfLandings.value,
    starting: flightFrom.value,
    destination: flightTo.value,
    takeoff: takeoffTime.value,
    landingtime: landingTime.value,
    incident: incident.value,
    actiontaken: actionsTaken.value,
    engineer: engineerName.value,
    date: certDate.value,
    itemmel: itemMel.value,
    opendate: openDate.value,
    category: certCategory.value,
    limitdate: limitDate.value,
    created: new Date(),
  };

  renderSpinner(logForm);
  addToLog(allLogData);
});

function timeDifference(takeoff, landing) {
  const startTime = new Date("1970-01-01T" + takeoff);
  const endTime = new Date("1970-01-01T" + landing);

  const timeDifference = endTime - startTime;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  return hours;
}

async function logUpdate(data) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/logUpdate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.log(err);
  }
}

async function addToLog(data) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      logFormMsg.innerText = `Logged Successfully`;
      logFormMsg.style.color = "green";
      const inputs = logForm.querySelectorAll("input");
      inputs.forEach((input) => (input.value = ``));
      actionsTaken.value = ``;
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
}

// Add aircraft
const addPlaneForm = document.getElementById("addPlaneForm");
const aircraftName = document.getElementById("aircraftName");
const totalAircraftTime = document.getElementById("totalAircraftTime");
const totalEngineTime = document.getElementById("totalEngineTime");
const totalProp = document.getElementById("totalProp");
const numberOfLandings = document.getElementById("numberOfLandings");
const addplaneFormMsg = document.getElementById("addplaneFormMsg");

addPlaneForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newData = {
    name: aircraftName.value,
    tat: totalAircraftTime.value,
    tet: totalEngineTime.value,
    landings: numberOfLandings.value,
    prop: totalProp.value,
  };

  renderSpinner(addPlaneForm);
  addToPlane(newData);
});

async function addToPlane(data) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/planes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      addplaneFormMsg.innerText = "Aircraft added";
      addplaneFormMsg.style.color = "green";

      const apiData = await res.json();
      localStorage.setItem("aircraft", apiData[0].name);
      localStorage.setItem("aircraftID", apiData[0].id);
      localStorage.setItem("tat", apiData[0].tat);
      localStorage.setItem("tet", apiData[0].tet);
      localStorage.setItem("landings", apiData[0].landings);
      localStorage.setItem("prop", apiData[0].prop);

      setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    console.log(err);
  }
}

// Remove Planes
const removeAircraftBtn = document.getElementById("removeAircraft");
const removeAircraftModal = document.getElementById("removeAircraftModal");
const removedAircraft = document.getElementById("removedAircraft");
const deleteAircraftBtn = document.getElementById("deleteAircraftBtn");

removeAircraftBtn.addEventListener("click", () => {
  const aircraft = localStorage.getItem("aircraft");
  const id = localStorage.getItem("aircraftID");
  removedAircraft.innerText = `Remove ${aircraft}?`;
  removeAircraftModal.style.display = "block";
  overlay.classList.remove("hidden");
  deleteAircraftBtn.addEventListener("click", (e) => {
    e.preventDefault();
    removeFromPlanes(id, aircraft);
  });
});

async function removeFromPlanes(id, aircraft) {
  try {
    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/planes/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ aircraft }),
      }
    );
    if (res.ok) {
      removedAircraft.style.color = "green";
      removedAircraft.innerText = "Removed successfully";
      localStorage.clear();
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    console.log(err);
  }
}

// Remove parts
async function removeFromPart(id) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/parts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      modalStatement.style.color = "green";
      modalStatement.innerText = "Removed successfully";
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    console.log(err);
  }
}

// Review logs
const reviewLogBtn = document.getElementById("reviewlogs");
reviewLogBtn.addEventListener("click", () => {
  window.location.hash = `#review`;
});
const logTitle = document.getElementById("logTitle");
const reviewTable = document.getElementById("reviewTable");

async function reviewLogsTable(aircraft) {
  try {
    reviewTable.innerHTML = ``;
    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/logs/${aircraft}`
    );
    const data = await res.json();

    const sortedData = data.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    sortedData.map((dt) => {
      let value = JSON.stringify(dt.id);
      let markup = `<tr class="logs_tab">
                    <td>${dt.pilot}</td>
                    <td>${dt.nature}</td>
                    <td>${dt.starting}</td>
                    <td>${dt.destination}</td>
                    <td>${reformatedDate(dt.date)}</td>
                    <td><button class="see_more reviewTab" value='${value}'>Review</td>
                  </tr>`;

      reviewTable.insertAdjacentHTML("beforeend", markup);
    });

    const logTableTab = document.querySelectorAll(".logs_tab");
    logTableTab.forEach((tab) => {
      const reviewBtn = tab.querySelector(".reviewTab");
      tab.addEventListener("click", () => {
        let tabId = JSON.parse(reviewBtn.value);
        reviewMore(tabId);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

const reviewModal = document.querySelector(".review_modal");

async function reviewMore(id) {
  try {
    reviewModal.innerHTML = ``;
    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/logs/id/${id}`
    );
    const data = await res.json();
    const reviewData = data[0];

    const {
      id: logID,
      aircraft,
      pilot,
      crew,
      nature,
      landings,
      starting,
      destination,
      takeoff,
      landingtime,
      incident,
      actiontaken,
      engineer,
      date,
      itemmel,
      opendate,
      category,
      limitdate,
    } = reviewData;

    let markup = `<i class="bx bxs-x-circle" id="closeModal" onclick="closeModal()"></i>
      <div class="review_data">
        <div class="review_row">
          <span>
            <p>Aircraft</p>
            <h4>${aircraft.toUpperCase()}</h4></span
          >
          <span
            ><p>Mission</p>
            <h4>${nature}</h4></span
          >
        </div>
        <hr />
        <div class="review_row">
          <span>
            <p>Pilot</p>
            <h4>${pilot}</h4></span
          >
        </div>
        <hr />
        <div class="review_row">
          <span
            ><p>Landings</p>
            <h4>${landings}</h4></span
          >
          <span
            ><p>Crewmen</p>
            <h4>${crew}</h4></span
          >
        </div>
        <hr />
        <div class="review_row">
          <span>
            <p>From</p>
            <h4>${starting}</h4></span
          >
          <span
            ><p>To</p>
            <h4>${destination}</h4></span
          >
        </div>
        <hr />
        <div class="review_row">
          <span>
            <p>Take-off Time</p>
            <h4>${takeoff}</h4></span
          >
          <span
            ><p>Landing Time</p>
            <h4>${landingtime}</h4></span
          >
        </div>
        <hr />
        <div class="review_column">
          <span>
            <p>Incidents</p>
            <h4>${incident}</h4></span
          >
          <span
            ><p>Actions Taken</p>
            <h4>${actiontaken}</h4></span
          >
        </div>
        <hr />
        <h2>Certificate Of Release To Service</h2>
        <div class="review_column">
          <span>
            <p>Engineer</p>
            <h4>${engineer}</h4>
          </span>
          <span>
            <p>Date</p>
            <h4>${reformatedDate(date)}</h4>
          </span>
        </div>
        <hr>
        <div class="review_row">
          <span>
            <p>Item MEL</p>
            <h4>${itemmel}</h4>
          </span>
          <span>
            <p>Open Date</p>
            <h4>${reformatedDate(opendate)}</h4>
          </span>
        </div>
        <hr>
        <div class="review_row">
          <span>
            <p>Category</p>
            <h4>${category}</h4>
          </span>
          <span>
            <p>Limit Date</p>
            <h4>${reformatedDate(limitdate)}</h4>
          </span>
        </div>
        <hr>
        <button type="button" class="btn btn-primary" id="delete_log">
              Delete
            </button>
      </div>`;

    reviewModal.insertAdjacentHTML("beforeend", markup);
    reviewModal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const deleteLogBtn = document.getElementById("delete_log");
    deleteLogBtn.addEventListener("click", (e) => {
      e.preventDefault();
      removeLog(logID);
    });
  } catch (err) {
    console.log(err);
  }
}

async function removeLog(id) {
  try {
    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/logs/remove/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

// Documents
const addDoc = document.getElementById("addDoc");
const addDocModal = document.querySelector(".add_doc");

addDoc.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(addDocModal);
});

const addDocForm = document.getElementById("addDocForm");
const docTitle = document.getElementById("title");
const docUpload = document.getElementById("upload");
const docIssue = document.getElementById("issue");
const docExpiring = document.getElementById("expiring");
const addDocMsg = document.getElementById("addDocMsg");

function validateFile() {
  const filePath = docUpload.value;
  const allowedExtensions = /(\.pdf)$/i;

  if (!allowedExtensions.test(filePath)) {
    addDocMsg.innerText =
      "Invalid file type. Please select a valid file with .pdf extension.";
    addDocMsg.style.color = "var(--red)";
    docUpload.value = "";
    docUpload.style.border = "1px solid var(--red)";
    return false;
  }
  addDocMsg.innerText = "";
  docUpload.style.border = "1px solid rgba(0,0,0,.15)";
  return true;
}

docUpload.addEventListener("input", validateFile);

addDocForm.addEventListener("submit", (e) => {
  e.preventDefault();
  validateFile();
  if (!validateFile()) return;

  const formData = new FormData();

  formData.append("aircraft", localStorage.getItem("aircraft"));
  formData.append("title", docTitle.value);
  formData.append("image", docUpload.files[0]);
  formData.append("issue", docIssue.value);
  formData.append("expiring", docExpiring.value);

  renderSpinner(addDocForm);
  addToDocs(formData);
});

async function addToDocs(data) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/docs`, {
      method: "POST",
      body: data,
    });
    if (res.ok) {
      addDocMsg.innerText = "Document Added";
      addDocMsg.style.color = "green";

      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
}

const docsTable = document.getElementById("docs_table");

async function docTable(aircraft) {
  try {
    docsTable.innerHTML = ``;
    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/docs/${aircraft}`
    );
    const data = await res.json();
    const sortedData = data.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );

    sortedData.map((dt) => {
      let value = JSON.stringify({
        id: dt.id,
        title: dt.title,
        photo: dt.photo,
      });
      let markup = `<tr class="docs_tab">
                    <td>${dt.title}</td>
                    <td>${reformatedDate(dt.issue)}</td>
                    <td>${reformatedDate(dt.expiring)}</td>
                    <td>
                      <button class="status ${dt.status}" value='${value}'>${
        dt.status
      }</button>
                    </td>
                  </tr>`;
      docsTable.insertAdjacentHTML("beforeend", markup);
    });

    const tableTab = document.querySelectorAll(".docs_tab");
    tableTab.forEach((tab) => {
      const statusBtn = tab.querySelector(".status");
      tab.addEventListener("click", () => {
        let docData = JSON.parse(statusBtn.value);
        docViewer(docData);
      });
    });
  } catch (err) {
    console.log(err);
  }
}

const docModal = document.querySelector(".doc_modal");
function docViewer(data) {
  docModal.innerHTML = ``;
  let markup = `<div>
        <iframe src="https://docs.google.com/gview?url=${data.photo}&embedded=true" style="width:100%; height:600px;" frameborder="0"></iframe>
        <button type="button" class="btn btn-primary" id="delete_doc">
              Delete
            </button>
        <button type="button" class="btn btn-secondary" onclick="closeModal()">
          Close
        </button>
      </div>`;
  docModal.insertAdjacentHTML("beforeend", markup);
  docModal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  const deleteBtn = document.getElementById("delete_doc");
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    removeDoc(data.id);
  });
}

async function removeDoc(id) {
  try {
    const res = await fetch(`https://llp-api.onrender.com/api/v1/docs/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

function renderSpinner(parentEle) {
  const html = `
      <div class="dot-spinner">
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
    <div class="dot-spinner__dot"></div>
</div>
  `;
  parentEle.insertAdjacentHTML("beforeend", html);
}
