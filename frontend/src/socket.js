import {io} from "socket.io-client";
const socket = io("https://my-app-1-1xuw.onrender.com");
socket.on("connect", () => {
    console.log("Connected to server");
  });
socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

export default socket;