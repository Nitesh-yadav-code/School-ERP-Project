import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },

  classSubjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClassSubject",
    required: true,
  },

  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    index: true,
  },

  academicYear: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

// Prevent duplicate assignments
TeacherAssignmentSchema.index(
  {
    teacherId: 1,
    classSubjectId: 1,
    sectionId: 1,
    academicYear: 1,
    accountId: 1,
  },
  { unique: true }
);


export default mongoose.model('TeacherAssignment', TeacherAssignmentSchema)