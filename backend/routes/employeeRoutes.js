// import express from "express";
// import {
//   createEmployee,
//   deleteEmployee,
//   getEmployees,
//   updateEmployee,
// } from "../controllers/employeeController.js";
// import { authenticateToken, requireAdmin } from "../middleware/auth.js";

// const router = express.Router();

// router.use(authenticateToken, requireAdmin);
// router.get("/employees", getEmployees);
// router.post("/employees", createEmployee);
// router.put("/employees/:id", updateEmployee);
// router.delete("/employees/:id", deleteEmployee);

// export default router;


import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// ✅ middleware only on the routes that need it, not globally
router.get("/employees", authenticateToken, requireAdmin, getEmployees);
router.post("/employees", authenticateToken, requireAdmin, createEmployee);
router.put("/employees/:id", authenticateToken, requireAdmin, updateEmployee);
router.delete("/employees/:id", authenticateToken, requireAdmin, deleteEmployee);

export default router;