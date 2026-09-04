const mongoose = require("mongoose");
const config = require("./index");
const logger = require("../utils/logger");

const connectDB = async () => {
    try
    {
    await mongoose.connect(config.mongoUri);
        logger.info("MongoDB connected successfully");
    }
    catch(error)
    {
        logger.error("MongoDB connection failed", {
            error: { name: error.name, message: error.message, stack: error.stack },
        });
        process.exit(1);
    }
};
module.exports = connectDB;