const config = require("./config");
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const createApp = require("./presentation/http/createApp");

const { app, server } = createApp();

if (require.main === module) {
    connectDB();
    server.listen(config.port, () => logger.info("Server is running", { port: config.port }));
}

module.exports = { app, server };
