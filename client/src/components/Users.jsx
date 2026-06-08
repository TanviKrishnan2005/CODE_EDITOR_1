import { useEffect, useState } from "react";
import { socket } from "../socket";

function Users({ roomId }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("room_users", (data) => {
      setUsers(data);
    });

    return () => socket.off("room_users");
  }, []);

  return (
    <div style={{
      height: "100%",
      padding: "15px",
      color: "#e2e8f0"
    }}>
      <h4 style={{ marginBottom: "10px" }}>
        👥 Users ({users.length})
      </h4>

      {users.map((u, i) => (
        <div key={i} style={{
          padding: "6px 8px",
          borderRadius: "6px",
          background: "#1e293b",
          marginBottom: "6px",
          fontSize: "14px"
        }}>
          {u.username}
        </div>
      ))}
    </div>
  );
}

export default Users;