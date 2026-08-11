const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

//port 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

//database connection

const connectDB = require("./config/db");
connectDB();

//Controllers

const notesApi = require("./controllers/notesapi");
app.use( "/Notes" , notesApi);

const userAuth = require("./controllers/userAuth");
app.use("/users" , userAuth);

const uploadRoute = require("./controllers/uploadroute");
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoute);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });
