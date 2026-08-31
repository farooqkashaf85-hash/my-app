const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);  
const io = new Server(server, {
    cors: {
        origin: [
        "http://localhost:5173",
       // "https://pratice-notes.netlify.app"
    ],
        methods: ["GET", "POST" , "PUT", "DELETE"],
    },
});
//connect socket.io
app.set("io", io); // Set the io instance in the app locals
io.on("connection", (socket) => {
    console.log("A user connected");
 

//join room
socket.on("join_room" , (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);

    socket.to(roomId).emit("user joined", { message: `${socket.id} joined the room` });
});

//send message
socket.on("send_message" , (data)=>{
    io.to(data.room).emit("receive_message" , {
        text : data.text,
        sender : data.sender,
        room : data.room,
        timeStamp : new Date()
    });
    });

//Typing indicator
socket.on("typing" , (room) => {
    socket.to(room).emit("user_typing");
});

//disconnect 
socket.on("disconnect", ()=>{
    console.log(`User disconnected: ${socket.id}`)
});
});
app.use(cors(
    {
    origin: [
        "http://localhost:5173",
      //  "https://pratice-notes.netlify.app"
    ],
    methods: ["GET", "POST" , "PUT", "DELETE"]
}
));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

//port 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
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
const { timeStamp } = require("console");
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoute);

app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });
