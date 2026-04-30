import mongoose from "mongoose";

const FeeAssignmentSchema = new mongoose.Schema(
  {
    studentEnrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentEnrollment",
      required: true,
      index: true,
    },

    feeStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "partial"],
      default: "pending",
    },

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
  },
  { timestamps: true }
);

FeeAssignmentSchema.index(
  { studentEnrollmentId: 1, feeStructureId: 1, accountId: 1 },
  { unique: true }
);

export default mongoose.model("FeeAssignment", FeeAssignmentSchema);
