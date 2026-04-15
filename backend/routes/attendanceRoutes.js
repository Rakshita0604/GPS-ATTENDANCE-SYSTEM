import express from "express";
const router = express.Router();

import { markAttendance, getAttendance, getDashboardData } from "../controllers/attendanceController.js";

import upload from "../middleware/upload.js";

router.post("/mark", upload.single("image"), markAttendance);
router.get("/dashboard/:userId", getDashboardData);

export default router;