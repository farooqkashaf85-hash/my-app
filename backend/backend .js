const express = require("express");
const cors = require("cors");
const config = require("./config");

const app = express();
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

//port 

const PORT = config.port;
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

