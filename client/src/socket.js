import { io } from "socket.io-client";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://code-editor-1-4o1v.onrender.com";

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  
});
