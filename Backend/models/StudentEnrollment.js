import mongoose from "mongoose";

const StudentEnrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
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
      type: String, // e.g. 2024-25
      required: true,
      index: true,
    },

    rollNumber: {
      type: String,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// One active enrollment per student per year
StudentEnrollmentSchema.index(
  { studentId: 1, academicYear: 1,classId:1, sectionId:1, accountId: 1, isActive: 1 },
  { unique: true }
);

export default mongoose.model("StudentEnrollment", StudentEnrollmentSchema);
