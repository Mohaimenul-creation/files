const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
 
const app = express();
const PORT = 3000;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
 
// Database connection pool
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",             
    database: "pet_platform"     
});
 


app.post("/pet", async (req, res) => {
    try {
        const {
            Name,
            Species,
            Owner_id,
            Adoption_pet_info,
            Gender,
            Date_of_birth,
            Adoption_status,
            Color,
            Vaccine_name,
            Due_date,
            Disease,
            Report_id,
            Breed_Name
        } = req.body;

        console.log("Pet data received:", req.body);

        const [result] = await db.query(`
            INSERT INTO pet
            (
                Name,
                Species,
                Owner_id,
                Adoption_pet_info,
                Gender,
                Date_of_birth,
                Adoption_status,
                Color,
                Vaccine_name,
                Due_date,
                Disease,
                Report_id,
                Breed_Name
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            Name,
            Species,
            Owner_id,
            Adoption_pet_info,
            Gender,
            Date_of_birth,
            Adoption_status,
            Color,
            Vaccine_name,
            Due_date,
            Disease,
            Report_id,
            Breed_Name
        ]);

        res.status(201).json({
            message: "Pet registered successfully",
            Pet_id: result.insertId
        });

    } catch (error) {
        console.error("Pet registration error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

//all pet
app.get("/pet", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.Pet_id,
                p.Name AS Pet_Name,
                p.Species,
                p.Owner_id,
                p.Gender,
                p.Date_of_birth,
                p.Color,
                p.Adoption_status,
                p.Adoption_pet_info,
                p.Vaccine_name,
                p.Due_date,
                p.Disease,
                b.Breed_Name,
                b.Life_Expectancy,
                b.Active_level,
                b.Size,
                b.Weight,
                b.Grooming_Need,
                b.Shedding_Level,
                b.Coat_type,
                b.Origin_Country,
                u.Name AS Owner_Name,
                u.Phone AS Owner_Phone,
                u.Email AS Owner_Email
            FROM pet p
            LEFT JOIN breed b
                ON p.Breed_Name = b.Breed_Name
            LEFT JOIN \`user\` u
                ON p.Owner_id = u.User_id
            ORDER BY p.Pet_id DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Pet retrieval error:", error);
        res.status(500).json({ error: "Failed to retrieve pets" });
    }
});

//single pet
app.get("/pet/:id", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.Pet_id,
                p.Name AS Pet_Name,
                p.Species,
                p.Owner_id,
                p.Gender,
                p.Date_of_birth,
                p.Color,
                p.Adoption_status,
                b.Breed_Name,
                b.Life_Expectancy,
                b.Active_level,
                b.Size,
                b.Weight,
                b.Grooming_Need,
                b.Shedding_Level,
                b.Coat_type,
                b.Origin_Country,
                m.Medical_id,
                m.Checkup_date,
                m.Diagnosis,
                m.Treatment_status,
                v.Vaccination_name,
                v.Initial_date,
                v.Next_due_date
            FROM pet p
            LEFT JOIN breed b
                ON p.Breed_Name = b.Breed_Name
            LEFT JOIN medical_record m
                ON p.Pet_id = m.Pet_id
            LEFT JOIN vaccination v
                ON p.Pet_id = v.Pet_id
            WHERE p.Pet_id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Pet not found" });
        }

        res.json(rows);
    } catch (error) {
        console.error("Pet details error:", error);
        res.status(500).json({ error: "Failed to retrieve pet details" });
    }
});


app.put("/pet/:id", async (req, res) => {
    try {
        const {
            Name, Species, Owner_id, Adoption_pet_info,
            Gender, Date_of_birth, Adoption_status, Color,
            Vaccine_name, Due_date, Disease, Report_id, Breed_Name
        } = req.body;

        const [result] = await db.query(`
            UPDATE pet SET
                Name = ?,
                Species = ?,
                Owner_id = ?,
                Adoption_pet_info = ?,
                Gender = ?,
                Date_of_birth = ?,
                Adoption_status = ?,
                Color = ?,
                Vaccine_name = ?,
                Due_date = ?,
                Disease = ?,
                Report_id = ?,
                Breed_Name = ?
            WHERE Pet_id = ?
        `, [
            Name, Species, Owner_id, Adoption_pet_info,
            Gender, Date_of_birth, Adoption_status, Color,
            Vaccine_name, Due_date, Disease, Report_id,
            Breed_Name, req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Pet not found" });
        }

        res.json({ message: "Pet updated successfully" });
    } catch (error) {
        console.error("Pet update error:", error);
        res.status(500).json({ error: "Failed to update pet" });
    }
});

// ================= USER REGISTRATION =================
app.post("/user", async (req, res) => {
    try {
        const { Name, Phone, Address, Email, Password } = req.body;

        const [result] = await db.query(`
            INSERT INTO \`user\` (Name, Phone, Address, Email, Password)
            VALUES (?, ?, ?, ?, ?)
        `, [Name, Phone, Address, Email, Password]);

        res.status(201).json({
            message: "User registered successfully",
            User_id: result.insertId
        });
    } catch (error) {
        console.error("User registration error:", error);
        res.status(500).json({ error: error.message });
    }
});

//GET ALL USERS 
app.get("/user", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT User_id, Name, Phone, Address, Email
            FROM \`user\`
            ORDER BY User_id DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("User retrieval error:", error);
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});


// ================= PET ADOPTION MANAGEMENT =================

app.get("/adoption/pets", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.Pet_id,
                p.Name AS Pet_Name,
                p.Species,
                p.Gender,
                p.Date_of_birth,
                p.Color,
                p.Adoption_status,
                b.Breed_Name,
                b.Size,
                b.Weight,
                b.Active_level
            FROM pet p
            LEFT JOIN breed b
                ON p.Breed_Name = b.Breed_Name
            WHERE p.Adoption_status = 'Available'
            ORDER BY p.Name
        `);

        res.json(rows);
    } catch (error) {
        console.error("Available pets error:", error);
        res.status(500).json({ error: "Failed to load available pets" });
    }
});


app.post("/adoption", async (req, res) => {
    try {
        const {
            Pet_id, User_id, Occupation, Monthly_income,
            Housing_type, Pet_experience, Reason_for_adoption,
            Application_date, Admin_id
        } = req.body;

        const [result] = await db.query(`
            INSERT INTO adoption_application
            (Pet_id, User_id, Occupation, Monthly_income,
             Housing_type, Pet_experience, Reason_for_adoption,
             Application_date, Admin_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            Pet_id, User_id, Occupation, Monthly_income,
            Housing_type, Pet_experience, Reason_for_adoption,
            Application_date, Admin_id
        ]);

        res.status(201).json({
            message: "Adoption application submitted successfully",
            Application_id: result.insertId
        });
    } catch (error) {
        console.error("Adoption application error:", error);
        res.status(500).json({
            error: "Failed to submit adoption application"
        });
    }
});


app.get("/adoption/applications", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                a.Application_id,
                p.Pet_id,
                p.Name AS Pet_Name,
                p.Species,
                b.Breed_Name,
                u.User_id AS Applicant_ID,
                u.Name AS Applicant_Name,
                u.Phone AS Applicant_Phone,
                u.Email AS Applicant_Email,
                a.Occupation,
                a.Monthly_income,
                a.Housing_type,
                a.Pet_experience,
                a.Reason_for_adoption,
                a.Application_date,
                a.Admin_id
            FROM adoption_application a
            INNER JOIN pet p
                ON a.Pet_id = p.Pet_id
            INNER JOIN \`user\` u
                ON a.User_id = u.User_id
            LEFT JOIN breed b
                ON p.Breed_Name = b.Breed_Name
            ORDER BY a.Application_date DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Adoption applications error:", error);
        res.status(500).json({
            error: "Failed to load adoption applications"
        });
    }
});


app.get("/adoption/statistics", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                p.Pet_id,
                p.Name AS Pet_Name,
                p.Species,
                b.Breed_Name,
                COUNT(a.Application_id) AS Total_Applications
            FROM pet p
            LEFT JOIN adoption_application a
                ON p.Pet_id = a.Pet_id
            LEFT JOIN breed b
                ON p.Breed_Name = b.Breed_Name
            GROUP BY
                p.Pet_id,
                p.Name,
                p.Species,
                b.Breed_Name
            ORDER BY Total_Applications DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Adoption statistics error:", error);
        res.status(500).json({
            error: "Failed to load adoption statistics"
        });
    }
});


// ================= ABUSE / FRAUD REPORTING =================

app.post("/abuse-report", async (req, res) => {
    try {
        const {
            Pet_id, Reporter_id, Status, Report_date,
            Evidence, Description, Report_type, Admin_id
        } = req.body;

        const finalStatus = Status || "Pending";

        const [result] = await db.query(`
            INSERT INTO abuse_report
            (Pet_id, Reporter_id, Status, Report_date,
             Evidence, Description, Report_type, Admin_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            Pet_id, Reporter_id, finalStatus, Report_date,
            Evidence, Description, Report_type, Admin_id
        ]);

        res.status(201).json({
            message: "Abuse/Fraud report submitted successfully",
            Report_id: result.insertId
        });
    } catch (error) {
        console.error("Abuse report error:", error);
        res.status(500).json({
            error: "Failed to submit abuse/fraud report"
        });
    }
});


app.get("/abuse-reports", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ar.Report_id,
                ar.Pet_id,
                p.Name AS Pet_Name,
                p.Species,
                reporter.User_id AS Reporter_ID,
                reporter.Name AS Reporter_Name,
                reporter.Phone AS Reporter_Phone,
                reporter.Email AS Reporter_Email,
                ar.Status,
                ar.Report_date,
                ar.Evidence,
                ar.Description,
                ar.Report_type,
                ar.Admin_id
            FROM abuse_report ar
            LEFT JOIN pet p
                ON ar.Pet_id = p.Pet_id
            LEFT JOIN \`user\` reporter
                ON ar.Reporter_id = reporter.User_id
            ORDER BY ar.Report_date DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Abuse reports error:", error);
        res.status(500).json({
            error: "Failed to load abuse/fraud reports"
        });
    }
});


app.get("/abuse-reports/type/:type", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                ar.Report_id,
                p.Name AS Pet_Name,
                reporter.Name AS Reporter_Name,
                ar.Report_type,
                ar.Status,
                ar.Report_date,
                ar.Evidence,
                ar.Description
            FROM abuse_report ar
            LEFT JOIN pet p
                ON ar.Pet_id = p.Pet_id
            LEFT JOIN \`user\` reporter
                ON ar.Reporter_id = reporter.User_id
            WHERE ar.Report_type = ?
            ORDER BY ar.Report_date DESC
        `, [req.params.type]);

        res.json(rows);
    } catch (error) {
        console.error("Report filtering error:", error);
        res.status(500).json({
            error: "Failed to filter reports"
        });
    }
});


app.put("/abuse-report/:id/status", async (req, res) => {
    try {
        const { Status } = req.body;

        const [result] = await db.query(`
            UPDATE abuse_report
            SET Status = ?
            WHERE Report_id = ?
        `, [Status, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        res.json({
            message: "Report status updated successfully"
        });
    } catch (error) {
        console.error("Status update error:", error);
        res.status(500).json({
            error: "Failed to update report status"
        });
    }
});



// Musarrat---------------------------------------------------------------------------------


// FEATURE 1 - KEEP VACCINATION AND MEDICAL RECORDS


// Get one pet + vaccination + medical records
app.get("/pets/:id/health", async (req, res) => {
    const petId = Number(req.params.id);

    if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({ error: "Invalid Pet ID" });
    }

    try {
        const [pet] = await db.query(`
            SELECT Pet_id, Name, Species, Gender, Breed_Name, Color,
                   Date_of_birth, Adoption_status
            FROM pet
            WHERE Pet_id = ?
        `, [petId]);

        if (pet.length === 0) {
            return res.status(404).json({ error: "Pet not found" });
        }

        const [vaccinations] = await db.query(`
            SELECT Vaccination_name, Pet_id, Initial_date, Next_due_date
            FROM vaccination
            WHERE Pet_id = ?
            ORDER BY Next_due_date ASC
        `, [petId]);

        const [medical_records] = await db.query(`
            SELECT Medical_id, Checkup_date, Pet_id, Diagnosis, Treatment_status
            FROM medical_record
            WHERE Pet_id = ?
            ORDER BY Checkup_date DESC
        `, [petId]);

        res.json({
            pet: pet[0],
            vaccinations: vaccinations,
            medical_records: medical_records
        });
    } catch (error) {
        console.error("Health records error:", error);
        res.status(500).json({ error: "Failed to load health records" });
    }
});

// Add vaccination
app.post("/pets/:id/vaccinations", async (req, res) => {
    const petId = Number(req.params.id);
    const { Vaccination_name, Initial_date, Next_due_date } = req.body;

    if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({ error: "Invalid Pet ID" });
    }

    if (!Vaccination_name) {
        return res.status(400).json({ error: "Vaccination name is required" });
    }

    try {
        const [pet] = await db.query(
            "SELECT Pet_id FROM pet WHERE Pet_id = ?",
            [petId]
        );

        if (pet.length === 0) {
            return res.status(404).json({ error: "Pet not found" });
        }

        await db.query(`
            INSERT INTO vaccination
            (Vaccination_name, Pet_id, Initial_date, Next_due_date)
            VALUES (?, ?, ?, ?)
        `, [
            Vaccination_name,
            petId,
            Initial_date || null,
            Next_due_date || null
        ]);

        res.status(201).json({
            success: true,
            message: "Vaccination record added successfully"
        });
    } catch (error) {
        console.error("Add vaccination error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "This vaccination already exists for this pet."
            });
        }

        res.status(500).json({
            error: "Failed to add vaccination record"
        });
    }
});

// Add medical record
app.post("/pets/:id/medical", async (req, res) => {
    const petId = Number(req.params.id);
    const { Checkup_date, Diagnosis, Treatment_status } = req.body;

    if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({ error: "Invalid Pet ID" });
    }

    if (!Diagnosis) {
        return res.status(400).json({ error: "Diagnosis is required" });
    }

    try {
        const [pet] = await db.query(
            "SELECT Pet_id FROM pet WHERE Pet_id = ?",
            [petId]
        );

        if (pet.length === 0) {
            return res.status(404).json({ error: "Pet not found" });
        }

        await db.query(`
            INSERT INTO medical_record
            (Checkup_date, Pet_id, Diagnosis, Treatment_status)
            VALUES (?, ?, ?, ?)
        `, [
            Checkup_date || null,
            petId,
            Diagnosis,
            Treatment_status || null
        ]);

        res.status(201).json({
            success: true,
            message: "Medical record added successfully"
        });
    } catch (error) {
        console.error("Add medical record error:", error);

        res.status(500).json({
            error: "Failed to add medical record"
        });
    }
});


// FEATURE 2 - FIND NEARBY VETERINARIANS


// Get all veterinarians
app.get("/veterinarians", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT Vet_ID, Clinic_Name, Doctor_Name, Website,
                   Specialization, Email, Phone_Number,
                   Street_Address, City, Zip_Code
            FROM veterinarian
            ORDER BY City, Clinic_Name
        `);

        res.json(rows);
    } catch (error) {
        console.error("Veterinarian error:", error);

        res.status(500).json({
            error: "Failed to load veterinarians"
        });
    }
});

// Search veterinarian by city
app.get("/veterinarians/city/:city", async (req, res) => {
    const city = req.params.city;

    try {
        const [rows] = await db.query(`
            SELECT Vet_ID, Clinic_Name, Doctor_Name, Website,
                   Specialization, Email, Phone_Number,
                   Street_Address, City, Zip_Code
            FROM veterinarian
            WHERE LOWER(City) = LOWER(?)
            ORDER BY Clinic_Name
        `, [city]);

        res.json(rows);
    } catch (error) {
        console.error("Veterinarian city search error:", error);

        res.status(500).json({
            error: "Failed to search veterinarians"
        });
    }
});

// Search veterinarian by area
app.get("/veterinarians/area/:area", async (req, res) => {
    const area = req.params.area;

    try {
        const [rows] = await db.query(`
            SELECT Vet_ID, Clinic_Name, Doctor_Name, Website,
                   Specialization, Email, Phone_Number,
                   Street_Address, City, Zip_Code
            FROM veterinarian
            WHERE LOWER(Street_Address) LIKE LOWER(?)
               OR LOWER(City) LIKE LOWER(?)
            ORDER BY Clinic_Name
        `, [`%${area}%`, `%${area}%`]);

        res.json(rows);
    } catch (error) {
        console.error("Veterinarian area search error:", error);

        res.status(500).json({
            error: "Failed to search veterinarians"
        });
    }
});


// FEATURE 3 - REPORT LOST AND FOUND PETS


// Get all reports
app.get("/pet-reports", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                pr.Report_ID,
                pr.Last_seen_Date,
                pr.Description,
                pr.User_ID,
                pr.Pet_ID,
                pr.Report_Type,
                pr.Status,
                pr.Report_Date,
                pr.Pet_pic_url,
                pr.Identifying_mark,
                pr.Zip_code,
                pr.City,
                pr.AreaName,
                pr.Share_location_url,
                p.Name AS Pet_name,
                p.Species,
                p.Gender,
                p.Breed_Name,
                p.Color
            FROM pet_report pr
            LEFT JOIN pet p ON pr.Pet_ID = p.Pet_id
            ORDER BY pr.Report_Date DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Pet reports error:", error);

        res.status(500).json({
            error: "Failed to load pet reports"
        });
    }
});

// Get LOST pets
app.get("/pet-reports/lost", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                pr.Report_ID,
                pr.Last_seen_Date,
                pr.Description,
                pr.User_ID,
                pr.Pet_ID,
                pr.Report_Type,
                pr.Status,
                pr.Report_Date,
                pr.Pet_pic_url,
                pr.Identifying_mark,
                pr.Zip_code,
                pr.City,
                pr.AreaName,
                pr.Share_location_url,
                p.Name AS Pet_name,
                p.Species,
                p.Gender,
                p.Breed_Name,
                p.Color
            FROM pet_report pr
            LEFT JOIN pet p ON pr.Pet_ID = p.Pet_id
            WHERE LOWER(pr.Report_Type) = 'lost'
            ORDER BY pr.Report_Date DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Lost pets error:", error);

        res.status(500).json({
            error: "Failed to load lost pets"
        });
    }
});

// Get FOUND pets
app.get("/pet-reports/found", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                pr.Report_ID,
                pr.Last_seen_Date,
                pr.Description,
                pr.User_ID,
                pr.Pet_ID,
                pr.Report_Type,
                pr.Status,
                pr.Report_Date,
                pr.Pet_pic_url,
                pr.Identifying_mark,
                pr.Zip_code,
                pr.City,
                pr.AreaName,
                pr.Share_location_url,
                p.Name AS Pet_name,
                p.Species,
                p.Gender,
                p.Breed_Name,
                p.Color
            FROM pet_report pr
            LEFT JOIN pet p ON pr.Pet_ID = p.Pet_id
            WHERE LOWER(pr.Report_Type) = 'found'
            ORDER BY pr.Report_Date DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Found pets error:", error);

        res.status(500).json({
            error: "Failed to load found pets"
        });
    }
});

// Submit lost/found report
app.post("/pet-reports", async (req, res) => {
    const {
        Last_seen_Date,
        Description,
        User_ID,
        Pet_ID,
        Report_Type,
        Status,
        Report_Date,
        Pet_pic_url,
        Identifying_mark,
        Zip_code,
        City,
        AreaName,
        Share_location_url
    } = req.body;

    if (!Report_Type) {
        return res.status(400).json({
            error: "Report type is required"
        });
    }

    if (!Description) {
        return res.status(400).json({
            error: "Description is required"
        });
    }

    if (!City) {
        return res.status(400).json({
            error: "City is required"
        });
    }

    if (!AreaName) {
        return res.status(400).json({
            error: "Area is required"
        });
    }

    try {
        await db.query(`
            INSERT INTO pet_report
            (
                Last_seen_Date,
                Description,
                User_ID,
                Pet_ID,
                Report_Type,
                Status,
                Report_Date,
                Pet_pic_url,
                Identifying_mark,
                Zip_code,
                City,
                AreaName,
                Share_location_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            Last_seen_Date || null,
            Description,
            User_ID || null,
            Pet_ID || null,
            Report_Type,
            Status || "Open",
            Report_Date || new Date().toISOString().split("T")[0],
            Pet_pic_url || null,
            Identifying_mark || null,
            Zip_code || null,
            City,
            AreaName,
            Share_location_url || null
        ]);

        res.status(201).json({
            success: true,
            message: "Pet report submitted successfully"
        });
    } catch (error) {
        console.error("Submit pet report error:", error);

        res.status(500).json({
            error: "Failed to submit pet report"
        });
    }
});

// Update report status
app.put("/pet-reports/:id/status", async (req, res) => {
    const reportId = Number(req.params.id);
    const { Status } = req.body;

    if (!Number.isInteger(reportId) || reportId <= 0) {
        return res.status(400).json({
            error: "Invalid Report ID"
        });
    }

    if (!Status) {
        return res.status(400).json({
            error: "Status is required"
        });
    }

    try {
        const [result] = await db.query(`
            UPDATE pet_report
            SET Status = ?
            WHERE Report_ID = ?
        `, [Status, reportId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Report not found"
            });
        }

        res.json({
            success: true,
            message: "Report status updated"
        });
    } catch (error) {
        console.error("Update report status error:", error);

        res.status(500).json({
            error: "Failed to update report status"
        });
    }
});




//Efaz----------------------------------------------------------------------



// FEATURE 1
// ADOPTION ANALYTICS BASED ON BREED


app.get("/analytics/adoption-breed", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                pet.Breed_Name,
                COUNT(adoption_application.Application_id) AS Applications
            FROM pet
            JOIN adoption_application
                ON pet.Pet_id = adoption_application.Pet_id
            GROUP BY pet.Breed_Name
            ORDER BY Applications DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error("Adoption analytics error:", error);

        res.status(500).json({
            error: "Failed to load adoption analytics"
        });
    }
});



// FEATURE 2
// COMPARE EACH PET'S MEDICAL STATUS WITH OTHER PETS


app.get("/analytics/medical", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                pet.Pet_id,
                pet.Name,
                medical_record.Diagnosis,
                medical_record.Treatment_status,

                (
                    SELECT COUNT(*)
                    FROM medical_record mr
                    WHERE mr.Treatment_status =
                          medical_record.Treatment_status
                ) AS Pets_with_same_status,

                (
                    SELECT COUNT(*)
                    FROM medical_record
                ) AS Total_medical_records

            FROM pet
            JOIN medical_record
                ON pet.Pet_id = medical_record.Pet_id

            ORDER BY pet.Pet_id
        `);

        res.json(rows);

    } catch (error) {
        console.error("Medical analytics error:", error);

        res.status(500).json({
            error: "Failed to load medical analytics"
        });
    }
});



// FEATURE 3
// CATEGORIES WITH ABOVE-AVERAGE SPENDING


app.get("/analytics/expenses", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                Category_name,
                SUM(Amount) AS Total_spending

            FROM expense

            GROUP BY Category_name

            HAVING SUM(Amount) > (
                SELECT AVG(category_total)
                FROM (
                    SELECT
                        SUM(Amount) AS category_total
                    FROM expense
                    GROUP BY Category_name
                ) AS category_spending
            )

            ORDER BY Total_spending DESC
        `);

        res.json(rows);

    } catch (error) {
        console.error("Expense analytics error:", error);

        res.status(500).json({
            error: "Failed to load expense analytics"
        });
    }
});
  




 
app.listen(PORT, () => {
    console.log("Server running on http://localhost:"+PORT);
});
 
