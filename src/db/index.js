import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(
      `\n MongoDB connected & Connection info. ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Database Giving Error :", error);
    process.exit(1);
  }
};

export default connectDB;
