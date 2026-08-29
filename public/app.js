console.log("app.js loaded");

// SECTION CONTROL
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        section.classList.add("hidden");
    });
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) selectedSection.classList.remove("hidden");
}

// PET REGISTRATION
const petForm = document.getElementById("petForm");

if (petForm) {
    petForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const pet = {
            Pet_Name: document.getElementById("petName").value,
            Species: document.getElementById("species").value,
            Owner_id: document.getElementById("ownerId").value,
            Adoption_pet_info: document.getElementById("adoptionPetInfo").value,
            Gender: document.getElementById("gender").value,
            Date_of_birth: document.getElementById("dateOfBirth").value,
            Adoption_status: document.getElementById("adoptionStatus").value,
            Color: document.getElementById("color").value,
            Vaccine_name: document.getElementById("vaccineName").value,
            Due_date: document.getElementById("dueDate").value,
            Disease: document.getElementById("disease").value,
            Report_id: document.getElementById("reportId").value,
            Breed_Name: document.getElementById("breedName").value
        };

        try {
            const response = await fetch("/pet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pet)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to register pet");
            }

            document.getElementById("petMessage").textContent =
                "Pet registered successfully!";
            petForm.reset();
            loadPets();
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("petMessage").textContent = error.message;
        }
    });
}

// LOAD PETS
async function loadPets() {
    try {
        const response = await fetch("/pet");
        if (!response.ok) throw new Error("Failed to load pets");

        const pets = await response.json();
        const petList = document.getElementById("petList");
        if (!petList) return;

        petList.innerHTML = "";

        pets.forEach((pet) => {
            const div = document.createElement("div");
            div.classList.add("pet-card");
            div.innerHTML = `
                <h4>${pet.Pet_Name}</h4>
                <p><strong>Pet ID:</strong> ${pet.Pet_id}</p>
                <p><strong>Species:</strong> ${pet.Species || ""}</p>
                <p><strong>Owner ID:</strong> ${pet.Owner_id || ""}</p>
                <p><strong>Gender:</strong> ${pet.Gender || ""}</p>
                <p><strong>Date of Birth:</strong> ${pet.Date_of_birth || ""}</p>
                <p><strong>Color:</strong> ${pet.Color || ""}</p>
                <p><strong>Breed:</strong> ${pet.Breed_Name || ""}</p>
                <p><strong>Adoption Status:</strong> ${pet.Adoption_status || ""}</p>
            `;
            petList.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// USER REGISTRATION 
const userForm = document.getElementById("userForm");

if (userForm) {
    userForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const user = {
            Name: document.getElementById("userName").value,
            Phone: document.getElementById("userPhone").value,
            Address: document.getElementById("userAddress").value,
            Email: document.getElementById("userEmail").value,
            Password: document.getElementById("userPassword").value
        };

        try {
            const response = await fetch("/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to register user");
            }

            document.getElementById("userMessage").textContent =
                `User registered successfully! User ID: ${result.User_id}`;

            userForm.reset();
            loadUsers();
        } catch (error) {
            console.error("User registration error:", error);
            document.getElementById("userMessage").textContent = error.message;
        }
    });
}

async function loadUsers(){
    try {
        const response = await fetch("/user");

        if (!response.ok) {
            throw new Error("Failed to load users");
        }

        const users = await response.json();
        const userList = document.getElementById("userList");

        if (!userList) return;

        userList.innerHTML = "";

        users.forEach((user) => {
            const div = document.createElement("div");
            div.classList.add("user-card");

            div.innerHTML = `
                <h4>${user.Name}</h4>
                <p><strong>User ID:</strong> ${user.User_id}</p>
                <p><strong>Phone:</strong> ${user.Phone || ""}</p>
                <p><strong>Address:</strong> ${user.Address || ""}</p>
                <p><strong>Email:</strong> ${user.Email || ""}</p>
            `;

            userList.appendChild(div);
        });
    } catch (error) {
        console.error("User loading error:", error);

        const userList = document.getElementById("userList");

        if (userList) {
            userList.textContent = error.message;
        }
    }
}

// ADOPTION
async function loadAvailablePets() {
    try {
        console.log("Loading available pets...");

        const response = await fetch("/adoption/pets");

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error("Failed to load available pets");
        }

        const pets = await response.json();

        console.log("Pets received:", pets);

        const container = document.getElementById("availablePets");

        console.log("Container:", container);

        if (!container) {
            throw new Error("availablePets element not found");
        }

        container.innerHTML = "";

        pets.forEach((pet) => {
            const div = document.createElement("div");

            div.classList.add("pet-card");

            div.innerHTML = `
                <h4>${pet.Pet_Name || "Unnamed Pet"}</h4>
                <p><strong>Pet ID:</strong> ${pet.Pet_id}</p>
                <p><strong>Species:</strong> ${pet.Species || ""}</p>
                <p><strong>Breed:</strong> ${pet.Breed_Name || ""}</p>
                <p><strong>Gender:</strong> ${pet.Gender || ""}</p>
                <p><strong>Color:</strong> ${pet.Color || ""}</p>
                <p><strong>Status:</strong> ${pet.Adoption_status || ""}</p>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Adoption error:", error);

        const container = document.getElementById("availablePets");

        if (container) {
            container.textContent = error.message;
        }
    }
}

const adoptionForm = document.getElementById("adoptionForm");

if (adoptionForm) {
    adoptionForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const application = {
            Pet_id: document.getElementById("adoptionPetId").value,
            User_id: document.getElementById("applicantId").value,
            Occupation: document.getElementById("occupation").value,
            Monthly_income: document.getElementById("monthlyIncome").value,
            Housing_type: document.getElementById("housingType").value,
            Pet_experience: document.getElementById("petExperience").value,
            Reason_for_adoption: document.getElementById("reasonForAdoption").value,
            Application_date: document.getElementById("applicationDate").value,
            Admin_id: document.getElementById("adminId").value
        };

        try {
            const response = await fetch("/adoption", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(application)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to submit application");
            }

            document.getElementById("adoptionMessage").textContent =
                "Adoption application submitted successfully.";
            adoptionForm.reset();
            loadApplications();
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("adoptionMessage").textContent = error.message;
        }
    });
}

async function loadApplications() {
    try {
        const response = await fetch("/adoption/applications");
        if (!response.ok) throw new Error("Failed to load applications");

        const applications = await response.json();
        const container = document.getElementById("applicationList");
        if (!container) return;

        container.innerHTML = "";

        applications.forEach((application) => {
            const div = document.createElement("div");
            div.classList.add("application-card");
            div.innerHTML = `
                <h4>Application #${application.Application_id}</h4>
                <p><strong>Pet ID:</strong> ${application.Pet_id || ""}</p>
                <p><strong>User ID:</strong> ${application.Applicant_ID || ""}</p>
                <p><strong>Occupation:</strong> ${application.Occupation || ""}</p>
                <p><strong>Monthly Income:</strong> ${application.Monthly_income || ""}</p>
                <p><strong>Housing Type:</strong> ${application.Housing_type || ""}</p>
                <p><strong>Pet Experience:</strong> ${application.Pet_experience || ""}</p>
                <p><strong>Reason:</strong> ${application.Reason_for_adoption || ""}</p>
                <p><strong>Application Date:</strong> ${application.Application_date || ""}</p>
                <p><strong>Admin ID:</strong> ${application.Admin_id || ""}</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
        const container = document.getElementById("applicationList");
        if (container) container.textContent = error.message;
    }
}

// ABUSE / FRAUD REPORT
const abuseForm = document.getElementById("abuseForm");

if (abuseForm) {
    abuseForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const report = {
            Pet_id: document.getElementById("reportPetId").value,
            Reporter_id: document.getElementById("reporterId").value,
            Report_type: document.getElementById("reportType").value,
            Evidence: document.getElementById("evidence").value,
            Description: document.getElementById("reportDescription").value,
            Report_date: document.getElementById("reportDate").value,
            Admin_id: document.getElementById("reportAdminId").value
        };

        try {
            const response = await fetch("/abuse-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(report)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to submit report");
            }

            document.getElementById("abuseMessage").textContent =
                "Abuse/Fraud report submitted successfully.";
            abuseForm.reset();
            loadAbuseReports();
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("abuseMessage").textContent = error.message;
        }
    });
}

async function loadAbuseReports() {
    try {
        const response = await fetch("/abuse-reports");
        if (!response.ok) throw new Error("Failed to load reports");

        const reports = await response.json();
        const container = document.getElementById("abuseList");
        if (!container) return;

        container.innerHTML = "";

        reports.forEach((report) => {
            const div = document.createElement("div");
            div.classList.add("report-card");
            div.innerHTML = `
                <h4>Report #${report.Report_id}</h4>
                <p><strong>Pet ID:</strong> ${report.Pet_id || ""}</p>
                <p><strong>Reporter ID:</strong> ${report.Reporter_ID|| ""}</p>
                <p><strong>Report Type:</strong> ${report.Report_type || ""}</p>
                <p><strong>Status:</strong> ${report.Status || ""}</p>
                <p><strong>Report Date:</strong> ${report.Report_date || ""}</p>
                <p><strong>Evidence:</strong> ${report.Evidence || ""}</p>
                <p><strong>Description:</strong> ${report.Description || ""}</p>
                <p><strong>Admin ID:</strong> ${report.Admin_id || ""}</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error:", error);
        const container = document.getElementById("abuseList");
        if (container) container.textContent = error.message;
    }
}



//Musarrat--------------------------------------------------------------------------------------------




// FEATURE 1 - VACCINATION + MEDICAL RECORDS


// Load health records
async function loadHealthRecords() {
    const petId = document.getElementById("health-pet-id").value.trim();

    if (!petId) {
        alert("Please enter a Pet ID.");
        return;
    }

    try {
        const response = await fetch(`/pets/${petId}/health`);
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to load health records.");
            return;
        }

        // Pet information
        const petInfo = document.getElementById("pet-health-info");

        petInfo.innerHTML = `
            <div class="pet-info-card">
                <div>
                    <span class="pet-label">PET</span>
                    <h3>${escapeHTML(data.pet.Name)}</h3>
                </div>
                <div class="pet-details">
                    <span>Species: ${escapeHTML(data.pet.Species || "N/A")}</span>
                    <span>Gender: ${escapeHTML(data.pet.Gender || "N/A")}</span>
                    <span>Breed: ${escapeHTML(data.pet.Breed_Name || "N/A")}</span>
                    <span>Color: ${escapeHTML(data.pet.Color || "N/A")}</span>
                </div>
            </div>
        `;

        displayVaccinations(data.vaccinations);
        displayMedicalRecords(data.medical_records);
    } catch (error) {
        console.error("Health records error:", error);
        alert("Could not connect to the server.");
    }
}

// Display vaccination records
function displayVaccinations(vaccinations) {
    const container = document.getElementById("vaccination-list");
    container.innerHTML = "";

    if (!vaccinations || vaccinations.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                No vaccination records found.
            </div>
        `;
        return;
    }

    vaccinations.forEach(vaccine => {
        const card = document.createElement("div");
        card.className = "vaccination-card";

        card.innerHTML = `
            <div class="record-icon">💉</div>
            <div class="record-content">
                <h4>${escapeHTML(vaccine.Vaccination_name)}</h4>
                <p>Initial date: ${formatDate(vaccine.Initial_date)}</p>
                <p>Next due: ${formatDate(vaccine.Next_due_date)}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

// Display medical records
function displayMedicalRecords(records) {
    const container = document.getElementById("medical-list");
    container.innerHTML = "";

    if (!records || records.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                No medical records found.
            </div>
        `;
        return;
    }

    records.forEach(record => {
        const card = document.createElement("div");
        card.className = "medical-card";

        card.innerHTML = `
            <div class="record-icon">🩺</div>
            <div class="record-content">
                <h4>${escapeHTML(record.Diagnosis || "No diagnosis")}</h4>
                <p>Checkup: ${formatDate(record.Checkup_date)}</p>
                <span class="status">
                    ${escapeHTML(record.Treatment_status || "Not specified")}
                </span>
            </div>
        `;

        container.appendChild(card);
    });
}

// Add vaccination
async function addVaccinationFromPage() {
    const petId = document.getElementById("health-pet-id").value.trim();
    const name = document.getElementById("vaccination-name").value.trim();
    const initialDate = document.getElementById("initial-date").value;
    const nextDueDate = document.getElementById("next-due-date").value;

    if (!petId) {
        alert("Please enter a Pet ID first.");
        return;
    }

    if (!name) {
        alert("Please enter the vaccination name.");
        return;
    }

    try {
        const response = await fetch(`/pets/${petId}/vaccinations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Vaccination_name: name,
                Initial_date: initialDate || null,
                Next_due_date: nextDueDate || null
            })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to add vaccination.");
            return;
        }

        alert("Vaccination added successfully!");

        document.getElementById("vaccination-name").value = "";
        document.getElementById("initial-date").value = "";
        document.getElementById("next-due-date").value = "";

        loadHealthRecords();
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Add medical record
async function addMedicalRecordFromPage() {
    const petId = document.getElementById("health-pet-id").value.trim();
    const checkupDate = document.getElementById("checkup-date").value;
    const diagnosis = document.getElementById("diagnosis").value.trim();
    const treatmentStatus = document.getElementById("treatment-status").value.trim();

    if (!petId) {
        alert("Please enter a Pet ID first.");
        return;
    }

    if (!diagnosis) {
        alert("Please enter a diagnosis.");
        return;
    }

    try {
        const response = await fetch(`/pets/${petId}/medical`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Checkup_date: checkupDate || null,
                Diagnosis: diagnosis,
                Treatment_status: treatmentStatus || null
            })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to add medical record.");
            return;
        }

        alert("Medical record added successfully!");

        document.getElementById("checkup-date").value = "";
        document.getElementById("diagnosis").value = "";
        document.getElementById("treatment-status").value = "";

        loadHealthRecords();
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}


// FEATURE 2 - FIND VETERINARIANS


// Load all veterinarians
async function loadVeterinarians() {
    try {
        const response = await fetch("/veterinarians");
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to load veterinarians.");
            return;
        }

        displayVeterinarians(data);
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Search by city
async function searchVeterinariansByCity() {
    const city = document.getElementById("vet-city").value.trim();

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    try {
        const response = await fetch(
            `/veterinarians/city/${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Search failed.");
            return;
        }

        displayVeterinarians(data);
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Search by area
async function searchVeterinariansByArea() {
    const area = document.getElementById("vet-area").value.trim();

    if (!area) {
        alert("Please enter an area.");
        return;
    }

    try {
        const response = await fetch(
            `/veterinarians/area/${encodeURIComponent(area)}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Search failed.");
            return;
        }

        displayVeterinarians(data);
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Display veterinarians
function displayVeterinarians(veterinarians) {
    const container = document.getElementById("veterinarian-list");
    container.innerHTML = "";

    if (!veterinarians || veterinarians.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                No veterinarians found.
            </div>
        `;
        return;
    }

    veterinarians.forEach(vet => {
        const card = document.createElement("div");
        card.className = "veterinarian-card";

        card.innerHTML = `
            <div class="vet-top">
                <div class="vet-icon">🩺</div>
                <div>
                    <h3>${escapeHTML(vet.Clinic_Name)}</h3>
                    <p class="doctor">${escapeHTML(vet.Doctor_Name)}</p>
                </div>
            </div>

            <div class="vet-details">
                <p>
                    <strong>Specialization:</strong>
                    ${escapeHTML(vet.Specialization || "General Veterinary Medicine")}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${escapeHTML(vet.Street_Address || "N/A")}
                </p>

                <p>
                    <strong>City:</strong>
                    ${escapeHTML(vet.City || "N/A")}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(vet.Phone_Number || "N/A")}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(vet.Email || "N/A")}
                </p>
            </div>

            ${
                vet.Website
                    ? `
                        <a
                            href="${escapeAttribute(vet.Website)}"
                            target="_blank"
                            class="website-button"
                        >
                            Visit Website
                        </a>
                    `
                    : ""
            }
        `;

        container.appendChild(card);
    });
}


// FEATURE 3 - LOST AND FOUND PETS


// Load all reports
async function loadPetReports() {
    try {
        const response = await fetch("/pet-reports");
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to load reports.");
            return;
        }

        displayPetReports(data);
        setActiveFilter("all");
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Load lost pets
async function loadLostPets() {
    try {
        const response = await fetch("/pet-reports/lost");
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to load lost pets.");
            return;
        }

        displayPetReports(data);
        setActiveFilter("lost");
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Load found pets
async function loadFoundPets() {
    try {
        const response = await fetch("/pet-reports/found");
        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Failed to load found pets.");
            return;
        }

        displayPetReports(data);
        setActiveFilter("found");
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}

// Display reports
function displayPetReports(reports) {
    const container = document.getElementById("pet-report-list");
    container.innerHTML = "";

    if (!reports || reports.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                No reports found.
            </div>
        `;
        return;
    }

    reports.forEach(report => {
        const card = document.createElement("div");
        card.className = "pet-report-card";

        const type = String(report.Report_Type || "").toLowerCase();
        const typeClass = type === "lost" ? "lost" : "found";

        const image = report.Pet_pic_url
            ? `
                <img
                    src="${escapeAttribute(report.Pet_pic_url)}"
                    alt="Pet"
                    class="pet-report-image"
                    onerror="this.style.display='none'"
                >
            `
            : "";

        const locationLink = report.Share_location_url
            ? `
                <a
                    href="${escapeAttribute(report.Share_location_url)}"
                    target="_blank"
                    class="location-link"
                >
                    📍 View Location
                </a>
            `
            : "";

        card.innerHTML = `
            ${image}

            <div class="report-body">
                <div class="report-heading">
                    <span class="report-type ${typeClass}">
                        ${escapeHTML(report.Report_Type || "Report")}
                    </span>

                    <span class="report-status">
                        ${escapeHTML(report.Status || "Open")}
                    </span>
                </div>

                <h3>
                    ${escapeHTML(report.Pet_name || "Unknown Pet")}
                </h3>

                 <p>
                    <strong>Pet_Id:</strong>
                    ${escapeHTML(report.Pet_ID || "N/A")}
                </p>

                <p>
                    <strong>Species:</strong>
                    ${escapeHTML(report.Species || "N/A")}
                </p>

                <p>
                    <strong>Breed:</strong>
                    ${escapeHTML(report.Breed_Name || "N/A")}
                </p>

                <p>
                    <strong>Color:</strong>
                    ${escapeHTML(report.Color || "N/A")}
                </p>

                <p class="description">
                    ${escapeHTML(report.Description || "No description")}
                </p>

                <div class="report-location">
                    <p>
                        📍
                        ${escapeHTML(report.AreaName || "Unknown area")},
                        ${escapeHTML(report.City || "Unknown city")}
                    </p>

                    ${locationLink}
                </div>

                <p class="report-date">
                    Reported:
                    ${formatDate(report.Report_Date)}
                </p>
            </div>
        `;

        container.appendChild(card);
    });
}

// Submit report
async function submitPetReport() {
    const data = {
        Last_seen_Date: document.getElementById("last-seen-date").value || null,
        Description: document.getElementById("report-description").value.trim(),
        User_ID: document.getElementById("report-user-id").value || null,
        Pet_ID: document.getElementById("report-pet-id").value || null,
        Report_Type: document.getElementById("report-type").value,
        Status: "Open",
        Report_Date: new Date().toISOString().split("T")[0],
        Pet_pic_url: document.getElementById("pet-picture").value.trim() || null,
        Identifying_mark: document.getElementById("identifying-mark").value.trim() || null,
        Zip_code: document.getElementById("zip-code").value.trim() || null,
        City: document.getElementById("report-city").value.trim(),
        AreaName: document.getElementById("report-area").value.trim(),
        Share_location_url: document.getElementById("location-url").value.trim() || null
    };

    if (!data.Description) {
        alert("Please enter a description.");
        return;
    }

    if (!data.City) {
        alert("Please enter the city.");
        return;
    }

    if (!data.AreaName) {
        alert("Please enter the area.");
        return;
    }

    try {
        const response = await fetch("/pet-reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to submit report.");
            return;
        }

        alert("Pet report submitted successfully!");

        document.getElementById("report-form").reset();
        loadPetReports();
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}


// UPDATE REPORT STATUS


async function updatePetReportStatus(reportId, status) {
    try {
        const response = await fetch(
            `/pet-reports/${reportId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Status: status
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to update status.");
            return;
        }

        loadPetReports();
    } catch (error) {
        console.error(error);
        alert("Could not connect to the server.");
    }
}


// FILTER BUTTON


function setActiveFilter(filter) {
    document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(
        `.filter[data-filter="${filter}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }
}


// HELPER FUNCTIONS


function formatDate(date) {
    if (!date) {
        return "N/A";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
        return date;
    }

    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function escapeHTML(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHTML(value);
}


//Efaz---------------------------------------------------------------------------------------

function loadAdoptionAnalytics() {
    fetch("/analytics/adoption-breed")
        .then((res) => res.json())
        .then((data) => {
            const container = document.getElementById("adoptionAnalytics");

            container.innerHTML = data.map((breed) => `
                <div class="analytics">
                    <h3>${breed.Breed_Name}</h3>
                    <p>Adoption Applications: ${breed.Applications}</p>
                </div>
            `).join("");
        })
        .catch(error => {
            console.log("Adoption analytics error:", error);
        });
}

function loadMedicalAnalytics() {
    fetch("/analytics/medical")
        .then((res) => res.json())
        .then((data) => {
            const container = document.getElementById("medicalAnalytics");

            container.innerHTML = data.map((pet) => `
                <div class="analytics">
                    <h3>${pet.Name}</h3>
                    <p>Diagnosis: ${pet.Diagnosis}</p>
                    <p>Medical Status: ${pet.Treatment_status}</p>
                    <p>Pets with Same Status: ${pet.Pets_with_same_status}</p>
                    <p>Total Medical Records: ${pet.Total_medical_records}</p>
                </div>
            `).join("");
        })
        .catch(error => {
            console.log("Medical analytics error:", error);
        });
}

function loadExpenseAnalytics() {
    fetch("/analytics/expenses")
        .then((res) => res.json())
        .then((data) => {
            const container = document.getElementById("expenseAnalytics");

            container.innerHTML = data.map((expense) => `
                <div class="analytics">
                    <h3>${expense.Category_name}</h3>
                    <p>Total Spending: ${expense.Total_spending}</p>
                </div>
            `).join("");
        })
        .catch(error => {
            console.log("Expense analytics error:", error);
        });
}



// INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
    loadPets();
    loadAvailablePets();
    loadApplications();
    loadAbuseReports();
    loadUsers()

      loadVeterinarians();
      loadPetReports();
});
