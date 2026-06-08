import { io } from "socket.io-client";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://code-editor-2zom.onrender.com";

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  
});
