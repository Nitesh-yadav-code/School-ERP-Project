import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    studentEnrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentEnrollment",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Teacher / Admin
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },

    

  academicYear: {
      type: String,
      required: true,
      index: true,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * Prevent duplicate attendance
 * One student can have only one attendance per day
 */
AttendanceSchema.index(
  {
    studentEnrollmentId: 1,
    date: 1,
    accountId: 1,
  },
  { unique: true }
);

export default mongoose.model("Attendance", AttendanceSchema);

