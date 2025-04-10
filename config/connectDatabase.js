import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

if(!process.env.MONGODB_URL) {
    throw new Error("Please provide MONGODB_URL in the .env file"); 
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connect DB success");
    } catch (error) {
        console.log("Connect DB error");
        process.exit(1);
    }
}

export default connectDB;