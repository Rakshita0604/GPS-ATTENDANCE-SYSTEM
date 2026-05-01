import express from "express";
import {
  getAttendance,
  getDashboardData,
  getOfficeLocation,
  markAttendance,
  saveOfficeLocation,
} from "../controllers/attendanceController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// router.post("/mark-attendance", authenticateToken, upload.single("image"), markAttendance);
// router.get("/attendance", authenticateToken, getAttendance);
// router.get("/dashboard", authenticateToken, getDashboardData);
// router.get("/settings/location", authenticateToken, getOfficeLocation);
// router.put("/settings/location", authenticateToken, requireAdmin, saveOfficeLocation);

router.post("/mark", authenticateToken, upload.single("image"), markAttendance);  // was /mark-attendance
router.get("/history", authenticateToken, getAttendance);                          // was /attendance
router.get("/dashboard", authenticateToken, getDashboardData);                     // unchanged
router.get("/settings/location", authenticateToken, getOfficeLocation);            // unchanged
router.put("/settings/location", authenticateToken, requireAdmin, saveOfficeLocation); // unchanged


export default router;
