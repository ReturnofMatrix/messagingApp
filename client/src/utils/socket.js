// utils/socket.js
import { io } from "socket.io-client";

const PROD_URL = "https://messagingapp-ej7a.onrender.com";
const DEV_URL = "http://localhost:4000";

const socket = io(
  process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL,
  {
    withCredentials: true,
    transports: ["polling", "websocket"]
  }
);

export default socket;
