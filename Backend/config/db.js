import mongoose from "mongoose";

const connectDb = async ()=>{

    try {
        
        const MONGO_URI = process.env.MONGO_URI;
        if(!MONGO_URI){
            throw new Error("MongoDB connection request URI not found")
        }

        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
}

export default connectDb;