import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },

    // Login link (optional)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate teachers per school
TeacherSchema.index(
  { email: 1, accountId: 1 },
  { unique: true }
);

export default mongoose.model("Teacher", TeacherSchema);
