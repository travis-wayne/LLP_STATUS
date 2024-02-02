const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

// allSideMenu.forEach(item=> {
// 	const li = item.parentElement;

// 	item.addEventListener('click', function () {
// 		allSideMenu.forEach(i=> {
// 			i.parentElement.classList.remove('active');
// 		})
// 		li.classList.add('active');
// 	})
// });

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
// const searchForm = document.querySelector('#content nav form');

// searchButton.addEventListener('click', function (e) {
// 	if(window.innerWidth < 576) {
// 		e.preventDefault();
// 		searchForm.classList.toggle('show');
// 		if(searchForm.classList.contains('show')) {
// 			searchButtonIcon.classList.replace('bx-search', 'bx-x');
// 		} else {
// 			searchButtonIcon.classList.replace('bx-x', 'bx-search');
// 		}
// 	}
// })

// if(window.innerWidth < 768) {
// 	sidebar.classList.add('hide');
// } else if(window.innerWidth > 576) {
// 	sidebar.classList.add('hide');
// }

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

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
        // displayAnalyticsChart();
        localStorage.setItem("aircraft", dt.name);
        tableData(dt.name);
        selectedOption.innerHTML =
          dt.name + `<i class='bx bxs-chevron-down'></i>`;
        planeHeading.innerText = dt.name;
        tatElement.innerText = dt.tat;
        tetElement.innerText = dt.tet;
        landingsElement.innerText = dt.landings;
        tetsohElement.innerText = tetElement.innerText;
        dropdownContent.style.display = "none";
      });

      dropdownContent.appendChild(option);
    });

    dropdown.addEventListener("mouseover", () => {
      dropdownContent.style.display = "block";
    });

    dropdown.addEventListener("mouseout", () => {
      dropdownContent.style.display = "none";
    });
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

populatePlanesDropdown();

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

async function tableData(aircraft) {
  try {
    partsTable.innerHTML = ``;
    dashboardTable.innerHTML = ``;

    const res = await fetch(
      `https://llp-api.onrender.com/api/v1/parts/${aircraft}`
    );
    const data = await res.json();

    data.map((dt) => {
      let markup = `<tr>
			<td>${dt.id}</td>
			<td>${dt.description}</td>
			<td>${dt.number || "-"}</td>
			<td>${dt.quantity || "-"}</td>
			<td>${dt.ac || "-"}</td>
			<td>${dt.hrsleft || "-"}</td>
			<td>${dt.date || "-"}</td>
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
