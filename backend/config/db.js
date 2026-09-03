const mongoose = require("mongoose");
const config = require("./index");

const connectDB = async () => {
    try
    {
    await mongoose.connect(config.mongoUri);
        console.log("MongoDb Connected Successfully");
    }
    catch(error)
    {
        console.log("MongoDb Connection Failed!" , error.message);
        process.exit(1);
    }
};
module.exports = connectDB;