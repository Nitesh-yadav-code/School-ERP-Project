import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({

  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    index: true,
    required: true
  },
    firstName:{
        type: String,
        required: true,
        trim: true,
    },
    lastName:{
        type: String,
        required: true,
        trim:true,
    },
    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    
     // Guardian / Parent Info
    guardianName: {
      type: String,
      required: true,
    },
    guardianPhone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
}, { timestamps: true })


export default mongoose.model("Student", studentSchema)