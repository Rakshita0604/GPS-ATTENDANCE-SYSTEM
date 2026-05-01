import bcrypt from "bcrypt";
import db from "../config/db.js";

export async function getEmployees(_req, res, next) {
  try {
    const [employees] = await db.query(
      `SELECT id, user_id, employee_code, name, email, phone, department, designation, status, created_at
       FROM employees
       ORDER BY id DESC`
    );

    res.json(employees);
  } catch (error) {
    next(error);
  }
}

export async function createEmployee(req, res, next) {
  const connection = await db.getConnection();

  try {
    const {
      employee_code,
      name,
      email,
      phone = "",
      department = "",
      designation = "",
      password = "Employee@123",
      status = "active",
    } = req.body;

    if (!employee_code || !name || !email) {
      return res.status(400).json({ message: "Employee ID, name, and email are required" });
    }

    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'employee')",
      [name.trim(), email.trim().toLowerCase(), hashedPassword, phone]
    );

    const [employeeResult] = await connection.query(
      `INSERT INTO employees
       (user_id, employee_code, name, email, phone, department, designation, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.insertId,
        employee_code.trim(),
        name.trim(),
        email.trim().toLowerCase(),
        phone,
        department,
        designation,
        status === "inactive" ? "inactive" : "active",
      ]
    );

    await connection.commit();

    res.status(201).json({
      id: employeeResult.insertId,
      user_id: userResult.insertId,
      employee_code,
      name,
      email,
      phone,
      department,
      designation,
      status: status === "inactive" ? "inactive" : "active",
    });
  } catch (error) {
    await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Employee ID or email already exists" });
    }

    next(error);
  } finally {
    connection.release();
  }
}

export async function updateEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const {
      employee_code,
      name,
      email,
      phone = "",
      department = "",
      designation = "",
      status = "active",
    } = req.body;

    if (!employee_code || !name || !email) {
      return res.status(400).json({ message: "Employee ID, name, and email are required" });
    }

    const [currentRows] = await db.query("SELECT user_id FROM employees WHERE id = ?", [id]);

    if (currentRows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await db.query(
      `UPDATE employees
       SET employee_code = ?, name = ?, email = ?, phone = ?, department = ?, designation = ?, status = ?
       WHERE id = ?`,
      [
        employee_code.trim(),
        name.trim(),
        email.trim().toLowerCase(),
        phone,
        department,
        designation,
        status === "inactive" ? "inactive" : "active",
        id,
      ]
    );

    if (currentRows[0].user_id) {
      await db.query("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?", [
        name.trim(),
        email.trim().toLowerCase(),
        phone,
        currentRows[0].user_id,
      ]);
    }

    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Employee ID or email already exists" });
    }

    next(error);
  }
}

export async function deleteEmployee(req, res, next) {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const [rows] = await connection.query("SELECT user_id FROM employees WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await connection.beginTransaction();
    await connection.query("DELETE FROM employees WHERE id = ?", [id]);

    if (rows[0].user_id) {
      await connection.query("DELETE FROM users WHERE id = ?", [rows[0].user_id]);
    }

    await connection.commit();
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}
