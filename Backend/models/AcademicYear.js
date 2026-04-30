import mongoose from "mongoose";

const AcademicYearSchema = new mongoose.Schema(
  {
    name: {
      type: String, // "2024-25"
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isCurrent: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
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

// Only one academic year can be current per account
AcademicYearSchema.index(
  { accountId: 1, isCurrent: 1 },
  { unique: true, partialFilterExpression: { isCurrent: true } }
);

export default mongoose.model("AcademicYear", AcademicYearSchema);
