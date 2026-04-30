import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDb from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import teacherAssignmentRoutes from "./routes/teacherAssignmentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import classSubjectRoutes from "./routes/classSubjectRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import attendanceReportRoutes from "./routes/attendanceReportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import studentEnrollmentRoutes from "./routes/studentEnrollmentRoutes.js";
import feeStructureRoutes from "./routes/feeStructureRoutes.js";
import feeAssignmentRoutes from "./routes/feeAssignmentRoutes.js";
import feePaymentRoutes from "./routes/feePaymentRoutes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB
connectDb();

// API base
const API_BASE = "/api/v1";

// Routes
app.use(`${API_BASE}/auth`, authRoutes);
app.use(`${API_BASE}/create-account`, accountRoutes);
app.use(`${API_BASE}/todos`, todoRoutes);
app.use(`${API_BASE}/teachers`, teacherRoutes);
app.use(`${API_BASE}/teacher-assignments`, teacherAssignmentRoutes);
app.use(`${API_BASE}/subjects`, subjectRoutes);
app.use(`${API_BASE}/class-subjects`, classSubjectRoutes);
app.use(`${API_BASE}/student`, studentEnrollmentRoutes);
app.use(`${API_BASE}/student`, studentRoutes);
app.use(`${API_BASE}/classes`, classRoutes);
app.use(`${API_BASE}/sections`, sectionRoutes);
app.use(`${API_BASE}/attendance`, attendanceRoutes);
app.use(`${API_BASE}/attendance-report`, attendanceReportRoutes);
app.use(`${API_BASE}/fee-structure`, feeStructureRoutes);
app.use(`${API_BASE}/fee-assignment`, feeAssignmentRoutes);
app.use(`${API_BASE}/fee-payment`, feePaymentRoutes);
app.use(`${API_BASE}/dashboard`, dashboardRoutes);

// Health check
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
