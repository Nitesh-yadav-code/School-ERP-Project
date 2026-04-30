import mongoose from "mongoose";

const feeSetupSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
    unique: true,
  },
  monthlyFee:{
    type: Number,
    required:true,
  },

  admissionFee:{
    type:Number,
    required:true,
  },
  extraFees:[
    {
        title: {type: String},
        amount:{type:  Number}
    }
  ]
}, {timestamps: true});

export default mongoose.model("FeeSetup", feeSetupSchema)
