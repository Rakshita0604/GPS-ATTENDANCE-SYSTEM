import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import db, { initDatabase } from "./config/db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

import adminRoutes from "./routes/adminRoutes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => {
  res.json({ message: "GPS Attendance backend running" });
});

// app.use("/", authRoutes);
// app.use("/", employeeRoutes);

app.use("/", authRoutes);
app.use("/", employeeRoutes);  //n

//app.use("/", attendanceRoutes);

app.use("/attendance", attendanceRoutes); //n 
app.use("/admin", adminRoutes);

// app.use("/api", authRoutes);
// app.use("/api", employeeRoutes);

app.use("/api", authRoutes);
app.use("/api", employeeRoutes); //n

//app.use("/api", attendanceRoutes);

app.use("/api/attendance", attendanceRoutes);  // ✅ changed from "/api"
app.use("/api/admin", adminRoutes);            // ✅ new

// // ✅ ADD THESE
// app.use("/admin", adminRoutes);
// app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

async function startServer() {
  await db.query("SELECT 1");
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
