import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    // =========================
    // 1️⃣ BASIC SCHOOL INFO
    // =========================
    name: {
      type: String,
      required: true,
      trim: true
    },

    code: {
      type: String,
      unique: true,
      uppercase: true,
      index: true // e.g. ABCSCHOOL
    },

    // =========================
    // 2️⃣ ACCOUNT STATUS & TYPE
    // =========================
    status: {
      type: String,
      enum: ["active", "suspended", "inactive"],
      default: "active"
    },

    type: {
      type: String,
      enum: ["school", "college", "institute"],
      default: "school"
    },

    // =========================
    // 3️⃣ CONTACT INFORMATION
    // =========================
    contact: {
      email: { type: String },
      phone: { type: String },
      alternatePhone: { type: String }
    },

    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String, default: "India" },
      pincode: { type: String }
    },

    // =========================
    // 4️⃣ SCHOOL IDENTIFIERS
    // =========================
    registrationNumber: { type: String },
    board: {
      type: String,
      enum: ["CBSE", "ICSE", "STATE", "IB", "OTHER"]
    },
    academicYearStart: { type: Date },

    // =========================
    // 5️⃣ SUBSCRIPTION & LIMITS
    // =========================
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free"
      },
      startDate: { type: Date },
      endDate: { type: Date },
      isTrial: { type: Boolean, default: true }
    },

    limits: {
      maxUsers: { type: Number, default: 10 },
      maxStudents: { type: Number, default: 100 },
      maxTeachers: { type: Number, default: 10 }
    },

    // =========================
    // 6️⃣ MODULE / FEATURE FLAGS
    // =========================
    modules: {
      students: { type: Boolean, default: true },
      teachers: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      exams: { type: Boolean, default: false },
      fees: { type: Boolean, default: false },
      transport: { type: Boolean, default: false },
      hostel: { type: Boolean, default: false },
      reports: { type: Boolean, default: true }
    },

    // =========================
    // 7️⃣ BRANDING
    // =========================
    branding: {
      logoUrl: { type: String },
      themeColor: { type: String, default: "#1976d2" }
    },

    // =========================
    // 8️⃣ AUDIT & OWNERSHIP
    // =========================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // SuperAdmin
    },

    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Account", AccountSchema);
