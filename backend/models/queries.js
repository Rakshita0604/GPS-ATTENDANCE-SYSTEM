import { db } from "../config/db.js";


// 🔐 AUTH QUERIES

export const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

export const createUser = (user, callback) => {
  const { name, email, password, role } = user;
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
    callback
  );
};


// 👨‍💼 EMPLOYEE QUERIES

export const getAllEmployees = (callback) => {
  db.query("SELECT * FROM employees", callback);
};

export const addEmployee = (employee, callback) => {
  const { name, department, designation } = employee;
  db.query(
    "INSERT INTO employees (name, department, designation) VALUES (?, ?, ?)",
    [name, department, designation],
    callback
  );
};

export const deleteEmployee = (id, callback) => {
  db.query("DELETE FROM employees WHERE id = ?", [id], callback);
};


// 📍 ATTENDANCE QUERIES

export const markAttendance = (data, callback) => {
  const { user_id, latitude, longitude, status } = data;

  db.query(
    "INSERT INTO attendance (user_id, date, check_in, latitude, longitude, status) VALUES (?, CURDATE(), CURTIME(), ?, ?, ?)",
    [user_id, latitude, longitude, status],
    callback
  );
};

export const getAttendanceHistory = (user_id, callback) => {
  db.query(
    "SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC",
    [user_id],
    callback
  );
};

export const getAllAttendance = (callback) => {
  db.query("SELECT * FROM attendance ORDER BY date DESC", callback);
};