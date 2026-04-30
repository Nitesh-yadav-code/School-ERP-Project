import mongoose from "mongoose";
const ClassSubjectSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
  },
  academicYear: {
    type: String, // 2024-25
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  }

});

// Prevent duplicates
ClassSubjectSchema.index(
  { classId: 1, subjectId: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.model('ClassSubject', ClassSubjectSchema)