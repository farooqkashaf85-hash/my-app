const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

//routes

const  indexApi = require("./Routes/index");
app.use ("/" , indexApi);

const healthApi = require("./Routes/health");
app.use ("/health" , healthApi);

const sampleApi = require("./Routes/sampleApi");
app.use("/sample" , sampleApi);

