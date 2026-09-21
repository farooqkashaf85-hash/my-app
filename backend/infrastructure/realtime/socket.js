const { Server } = require("socket.io");

const createSocketServer = (httpServer, config, logger) => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.corsOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    logger.info("Socket connected", { socketId: socket.id });
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      logger.info("Socket joined room", { socketId: socket.id, roomId });
      socket.to(roomId).emit("user joined", { message: `${socket.id} joined the room` });
    });
    socket.on("send_message", (data) => {
      io.to(data.room).emit("receive_message", {
        text: data.text, sender: data.sender, room: data.room, timeStamp: new Date(),
      });
    });
    socket.on("typing", (room) => socket.to(room).emit("user_typing"));
    socket.on("disconnect", () => logger.info("Socket disconnected", { socketId: socket.id }));
  });

  return io;
};

module.exports = createSocketServer;