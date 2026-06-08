import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!roomId || !username) return;
    navigate(`/editor/${roomId}?username=${username}`);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #1e1e2f, #121212)"
    }}>

      <div style={{
        background: "#1e1e1e",
        padding: "40px",
        borderRadius: "12px",
        width: "320px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>

        <h2 style={{
          color: "white",
          marginBottom: "20px"
        }}>
          CodeCollab 💻
        </h2>

        <input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={joinRoom}
          style={{
            marginTop: "15px",
            padding: "10px",
            width: "100%",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
           Join Room
        </button>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "none",
  outline: "none"
};

export default Home;