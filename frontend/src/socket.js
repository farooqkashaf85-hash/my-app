import {io} from "socket.io-client";
import { API_URL } from "./config";
const socket = io(API_URL);
socket.on("connect", () => {
    console.log("Connected to server");
  });
socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

export default socket;