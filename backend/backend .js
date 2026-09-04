const { graphqlHTTP } = require("express-graphql");
const schema = require("./grapgql/schema");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const config = require("./config");
const logger = require("./utils/logger");
const requestLogger = require("./middleware/requestLogger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const server = http.createServer(app);  
app.use(requestLogger);
const io = new Server(server, {
    cors: {
        origin: [
        ...config.corsOrigins,
    ],
        methods: ["GET", "POST" , "PUT", "DELETE"],
    },
});
//connect socket.io
app.set("io", io); // Set the io instance in the app locals
io.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id });
 

//join room
socket.on("join_room" , (roomId) => {
    socket.join(roomId);
    logger.info("Socket joined room", { socketId: socket.id, roomId });

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
    logger.info("Socket disconnected", { socketId: socket.id });
});
});
app.use(cors(
    {
        origin: config.corsOrigins,
    methods: ["GET", "POST" , "PUT", "DELETE"]
}
));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

//garphql route
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

//Controllers

const notesApi = require("./controllers/notesapi");
app.use( "/Notes" , notesApi);

const userAuth = require("./controllers/userAuth");
app.use("/users" , userAuth);

const uploadRoute = require("./controllers/uploadroute");
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoute);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app, server };

if (require.main === module) {
    const PORT = config.port;
    const connectDB = require("./config/db");

    connectDB();
    server.listen(PORT, () => {
        logger.info("Server is running", { port: PORT });
    });
}
