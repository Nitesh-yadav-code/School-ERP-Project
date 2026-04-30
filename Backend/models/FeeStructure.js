import mongoose from "mongoose";

const FeeStructureSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Tuition, Transport, Exam
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    // academicYearId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "AcademicYear",
    //   required: true,
    // },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },

    isMandatory: {
      type: Boolean,
      default: true,
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

FeeStructureSchema.index(
  { classId: 1, academicYear: 1, name: 1, accountId: 1 },
  { unique: true }
);

export default mongoose.model("FeeStructure", FeeStructureSchema);
