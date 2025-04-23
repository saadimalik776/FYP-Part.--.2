const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

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

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Saadimalik776@gmail.com", // Replace with your email
    pass: "dqnz gnha twsf mtob", // Replace with your email password or app password
  },
});

// Helper function: Generate a random 6-digit verification code
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000);

// Function to find user by verification token
function findUserByToken(token) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE verification_code = ?";
    db.query(query, [token], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null); // Return user if found, otherwise null
      }
    });
  });
}

// Registration endpoint with email verification
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

      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Insert new user with unverified status
      const insertUserQuery =
        "INSERT INTO users (username, password, email, is_verified, verification_code) VALUES (?, ?, ?, 0, ?)";
      db.query(insertUserQuery, [username, hashedPassword, email, verificationCode], (err, result) => {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ message: "Internal server error." });
        }

        // Send verification email
        const mailOptions = {
          from: "your-email@gmail.com",
          to: email,
          subject: "Email Verification Code",
          text: `Your email verification code is ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.error(error.message);
            return res.status(500).json({ message: "Failed to send verification email." });
          }

          res.status(201).json({ message: "User registered. Verification email sent." });
        });
      });
    });
  });
});

// Verify email endpoint
app.post("/api/verify-email", (req, res) => {
  const { email, verificationCode } = req.body;

  if (!email || !verificationCode) {
    return res.status(400).json({ message: "Email and verification code are required." });
  }

  const checkCodeQuery = "SELECT * FROM users WHERE email = ? AND verification_code = ?";
  db.query(checkCodeQuery, [email, verificationCode], (err, results) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid verification code or email." });
    }

    // Update user status to verified
    const updateUserQuery = "UPDATE users SET is_verified = 1, verification_code = NULL WHERE email = ?";
    db.query(updateUserQuery, [email], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error." });
      }

      res.status(200).json({ message: "Email verified successfully." });
    });
  });
});

app.post('/verify', async (req, res) => {
  const { token } = req.body;

  try {
    // Log the token for debugging
    console.log('Received token:', token);

    const user = await findUserByToken(token);

    // Log the found user for debugging
    console.log('User found:', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Update the user's is_verified status
    const updateUserQuery = "UPDATE users SET is_verified = 1, verification_code = NULL WHERE verification_code = ?";
    db.query(updateUserQuery, [token], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal server error' });
      }

      res.json({ message: 'Email verified successfully' });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
