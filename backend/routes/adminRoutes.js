import express from "express";
const router = express.Router();

import {
  getAdminConfig,
  updateAdminConfig,
  getAllUsers,
  getAttendanceReport,
} from "../controllers/adminController.js";
//import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

import { authenticateToken, requireAdmin } from "../middleware/auth.js";

// router.get("/config", authMiddleware, adminMiddleware, getAdminConfig);
// router.put("/config", authMiddleware, adminMiddleware, updateAdminConfig);
// router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
// router.get("/report", authMiddleware, adminMiddleware, getAttendanceReport);

router.get("/config", authenticateToken, requireAdmin, getAdminConfig);
router.put("/config", authenticateToken, requireAdmin, updateAdminConfig);
router.get("/users", authenticateToken, requireAdmin, getAllUsers);
router.get("/report", authenticateToken, requireAdmin, getAttendanceReport);

export default router;
