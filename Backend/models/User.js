import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String, required: true,
    },
    password:{
        type:String, required: true,
    },
    accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    index: true,
    default: null // SuperAdmin has no account
  },
    role:{
        type:String,
        enum:["Admin", "Teacher"],
        default: "Teacher"
    },
    permissions:{
        type: [String],
        default: [],
    },

  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema)