import bcrypt from "bcrypt";
import db from "../config/db.js";
import { generateToken } from "../middleware/auth.js";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidPhone,
} from "../middleware/validation.js";

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}

export async function signup(req, res, next) {
  try {
    const { name, email, password, phone = "", role = "employee" } = req.body;
    const cleanRole = role === "admin" ? "admin" : "employee";

    // Validate name
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!isValidName(name)) {
      return res.status(400).json({ message: "Name must contain only letters and spaces" });
    }

    // Validate email
    if (!email || email.trim().length === 0) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Validate password
    if (!password || password.length === 0) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters with: 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*)",
      });
    }

    // Validate phone if provided
    if (phone && phone.length > 0 && !isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits starting with 6-9" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hashedPassword, phone, cleanRole]
    );

    const user = {
      id: result.insertId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone,
      role: cleanRole,
    };

    if (cleanRole === "employee") {
      await db.query(
        `INSERT INTO employees (user_id, employee_code, name, email, phone, status)
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [user.id, `EMP-${String(user.id).padStart(3, "0")}`, user.name, user.email, phone]
      );
    }

    return res.status(201).json({
      message: "Signup successful",
      token: generateToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }

    console.error("[AUTH] Signup error:", error);
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!email || email.trim().length === 0) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // Validate password
    if (!password || password.length === 0) {
      return res.status(400).json({ message: "Password is required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      token: generateToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("[AUTH] Login error:", error);
    next(error);
  }
}

export function me(req, res) {
  return res.json({ user: req.user });
}
