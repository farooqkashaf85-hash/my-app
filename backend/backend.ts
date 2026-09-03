import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import config = require("./config/index");
import connectDB from "./config/db";
const notesApi = require("./controllers/notesapi");
const userAuth = require("./controllers/userAuth");

dotenv.config();

const app = express();
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.use("/Notes", notesApi);
app.use("/users", userAuth);

const port = config.port;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });
});

export default app;