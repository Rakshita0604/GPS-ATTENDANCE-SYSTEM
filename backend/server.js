import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend running");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});