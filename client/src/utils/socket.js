// utils/socket.js
import { io } from "socket.io-client";

const PROD_URL = "https://messagingapp-fzs6.onrender.com";
const DEV_URL = "http://localhost:4000";

const socket = io(
  process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL,
  {
    withCredentials: true,
    transports: [ "websocket"]
  }
);

export default socket;
