import bcrypt from "bcrypt";
import db from "../config/db.js";

import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone
} from "../middleware/validation.js";

// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!isValidName(name)) return res.status(400).send("Invalid name");
  if (!isValidEmail(email)) return res.status(400).send("Invalid email");
  if (!isValidPassword(password)) return res.status(400).send("Weak password");
  if (!isValidPhone(phone)) return res.status(400).send("Invalid phone");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (name, email, password, phone)
      VALUES (?, ?, ?, ?)
    `;

    db.query(query, [name, email, hashedPassword, phone], (err) => {
      if (err) return res.status(500).send(err);

      res.send({ message: "Signup successful" });
    });

  } catch (err) {
    res.status(500).send("Signup error");
  }
};

// LOGIN
export const login = (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN TRY:", email, password);

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], async (err, result) => {
    if (err) return res.status(500).send(err);

    console.log("DB RESULT:", result);

    if (result.length === 0) return res.status(400).send("User not found");

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", match);

    if (!match) return res.status(400).send("Invalid password");

    res.send({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
};