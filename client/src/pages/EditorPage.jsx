import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "../socket";

import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import Users from "../components/Users";

function EditorPage() {
  const { roomId } = useParams();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const username = params.get("username");

  useEffect(() => {
    if (!roomId || !username) return;

    console.log("Joining room:", roomId, username);

    socket.emit("join_room", { roomId, username });

  }, [roomId, username]);

  return (
  <div style={{
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#020617"
  }}>

    {/* 🔥 TOP BAR */}
    <div style={{
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      background: "#020617",
      borderBottom: "1px solid #1e293b",
      color: "#e2e8f0",
      fontWeight: "500"
    }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{ fontSize: "18px" }}>💻 CodeCollab</span>
      </div>

      <div style={{ fontSize: "13px", opacity: 0.8 }}>
        Room: {roomId} | {username}
      </div>
    </div>

    {/* 🔥 MAIN LAYOUT */}
    <div style={{ flex: 1, display: "flex" }}>

      {/* USERS PANEL */}
      <div style={{
        width: "220px",
        borderRight: "1px solid #1e293b",
        background: "#020617"
      }}>
        <Users roomId={roomId} />
      </div>

      {/* EDITOR */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: "#020617"
      }}>
        <CodeEditor roomId={roomId} />
      </div>

      {/* CHAT */}
      <div style={{
        width: "320px",
        borderLeft: "1px solid #1e293b"
      }}>
        <Chat roomId={roomId} username={username} />
      </div>

    </div>
  </div>
);
}

export default EditorPage;