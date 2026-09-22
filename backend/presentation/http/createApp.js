const { graphqlHTTP } = require("express-graphql");
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const config = require("../../config");
const schema = require("../../grapgql/schema");
const logger = require("../../utils/logger");
const requestLogger = require("../../middleware/requestLogger");
const { errorHandler, notFoundHandler } = require("../../middleware/errorHandler");
const paymentRoute = require("../../controllers/paymentroute");
const uploadRoute = require("../../controllers/uploadroute");
const notesApi = require("../../controllers/notesapi");
const userAuth = require("../../controllers/userAuth");
const sanitizeValue = require("../../shared/sanitizeValue");
const createSocketServer = require("../../infrastructure/realtime/socket");
const compression = require("compression");

const createApp = () => {
  const app = express();
  const server = http.createServer(app);
  const io = createSocketServer(server, config, logger);

  app.set("io", io);
  app.use(requestLogger);
  app.use(compression());
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
  app.use(cors({ origin: config.corsOrigins, methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false,
    message: { success: false, error: "Too many requests from this IP, please try again later." },
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use((req, _res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
  });

  app.get("/", (_req, res) => res.send("Server is running"));
  app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));
  app.use("/Notes", notesApi);
  app.use("/users", userAuth);
  app.use("/payment", paymentRoute);
  app.use("/uploads", express.static("uploads"));
  app.use("/upload", uploadRoute);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return { app, server };
};

module.exports = createApp;