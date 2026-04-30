import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    academicYear: {
      type: String, // e.g. "2024-25"
      required: true,
      index: true,
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

// Prevent duplicate sections per class per year per school
SectionSchema.index(
  { name: 1, classId: 1, academicYear: 1, accountId: 1 },
  { unique: true }
);

export default mongoose.model("Section", SectionSchema);
