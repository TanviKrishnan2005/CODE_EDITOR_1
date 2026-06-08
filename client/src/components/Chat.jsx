import { useEffect, useState } from "react";
import { socket } from "../socket";

function Chat({ roomId, username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Load saved messages
  useEffect(() => {
    const saved = localStorage.getItem(roomId + "_chat");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, [roomId]);

  // ✅ Receive messages (ignore own to avoid duplicate)
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.username !== username) {
        setMessages((prev) => {
          const updated = [...prev, data];
          localStorage.setItem(roomId + "_chat", JSON.stringify(updated));
          return updated;
        });
      }
    });

    return () => socket.off("receive_message");
  }, [roomId, username]);

  // ✅ Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      roomId,
      message,
      username
    };

    socket.emit("send_message", msgData);

    // add locally ONLY once
    setMessages((prev) => {
      const updated = [...prev, msgData];
      localStorage.setItem(roomId + "_chat", JSON.stringify(updated));
      return updated;
    });

    setMessage("");
  };

  return (
    <div style={{
      width: "320px",
      height: "100%",
      background: "#0f172a",
      color: "white",
      padding: "15px",
      display: "flex",
      flexDirection: "column",
      borderLeft: "1px solid #1e293b"
    }}>
      
      <h3 style={{ marginBottom: "10px" }}>💬 Chat</h3>

      <div style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf:
                msg.username === username ? "flex-end" : "flex-start",
              background:
                msg.username === username
                  ? "#22c55e"
                  : "#1e293b",
              padding: "8px",
              borderRadius: "8px",
              maxWidth: "75%"
            }}
          >
            <strong>{msg.username}</strong>
            <div>{msg.message}</div>
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        style={{
          marginTop: "10px",
          padding: "8px",
          borderRadius: "6px",
          border: "none"
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginTop: "5px",
          padding: "8px",
          borderRadius: "6px",
          border: "none",
          background: "#22c55e",
          color: "white"
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Chat;