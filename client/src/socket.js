import { io } from "socket.io-client";

const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://code-editor-1-4o1v.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
});
