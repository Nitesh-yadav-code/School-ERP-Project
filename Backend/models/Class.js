import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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

    isActive: {
      type: Boolean,
      default: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate class names per school per year
ClassSchema.index(
  { name: 1, academicYear: 1, accountId: 1 },
  { unique: true }
);

export default mongoose.model("Class", ClassSchema);
