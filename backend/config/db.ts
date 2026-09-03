import mongoose from "mongoose";
import config = require("./index");

const connectDB = async (): Promise<void> => {
  await mongoose.connect(config.mongoUri);
  console.log("MongoDb Connected Successfully");
};

export default connectDB;