const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Add JWT for token-based authentication

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "mysql", // Replace with your MySQL password
  database: "diebito", // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
  } else {
    console.log("MySQL connected");
  }
});

// JWT Secret key
const JWT_SECRET = "your_jwt_secret"; // Change this to a secure secret key

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

// Registration endpoint (directly log in after registration)
app.post("/api/register", (req, res) => {
  const { username, password, email } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash password before storing in database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error." });
      }

      // Insert new user without 'is_verified' column
      const insertUserQuery =
        "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [username, hashedPassword, email], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: "Internal server error." });
        }

        // Generate JWT token for the logged-in user
        const token = generateToken(result.insertId); // Pass the user ID to generate token

        // Respond with the token
        res.status(201).json({ message: "User registered successfully.", token });
      });
    });
  });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "ID and password are required." });
  }

  const checkUserQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserQuery, [email], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "User not found." });
    }

    // Compare password with stored hash
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error." });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }

      // Generate JWT token for successful login
      const token = generateToken(results[0].id); // Pass the user ID to generate token

      res.status(200).json({ message: "Login successful.", token });
    });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
