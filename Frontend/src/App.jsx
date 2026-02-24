import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setMyId(socket.id);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div style={{ margin: "40px auto" }}>
      <h2>Simple Chat App</h2>

      <div
        style={{
          padding: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.id === myId ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: msg.id === myId ? "#DCF8C6" : "#eee",
              }}
            >
              {msg.text}
              <div style={{ fontSize: "10px" }}>{msg.time}</div>
            </span>
          </div>
        ))}
      </div>

      <div style={{  display: "flex" , position: "fixed", bottom: "20px", margin: "0 10%", width: "80%"}}>
        <input
          style={{ flex: 1, padding: "8px" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
