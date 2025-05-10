const express = require("express");
const cors = require("cors");
const fs = require("fs");
const students = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Get all students
app.get('/students', (req, res) => {
  res.send(students);
});

// Add a new student
app.post('/new-student', (req, res) => {
  const newStudent = req.body;

  if (!newStudent || !newStudent.firstName || !newStudent.lastName || !newStudent.email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const studentWithId = { id: newId, ...newStudent };

  students.push(studentWithId);

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(students, null, 2), (err) => {
  if (err) {
    console.error("Error writing to file", err);
    return res.status(500).json({ message: "Failed to save data" });
  }
  res.status(201).json({ message: "Student added" });
});
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
