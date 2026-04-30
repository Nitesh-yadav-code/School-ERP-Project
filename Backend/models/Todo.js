import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        default: ()=> new mongoose.Types.ObjectId(),
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
    },
    title:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
    },
    isCompleted:{
        type: Boolean,
        default: false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

export default mongoose.model("todo", todoSchema);