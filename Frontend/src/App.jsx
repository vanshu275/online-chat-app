import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "./socket/socket";
import Login from "./pages/Login";
import Register from "./pages/Registration";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("login");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const chatRef = useRef(null);

  // Auth Success Handler
  const handleAuth = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setCurrentUser(decoded);
    socket.auth = { token };
    socket.connect(); // Manual connect
    setPage("chat");
  };

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      handleAuth(token);
    }
  }, []);

  useEffect(() => {
    if (page === "chat") {
      socket.emit("joinChat");

      const onReceive = (data) => setMessages((prev) => [...prev, data]);
      const onHistory = (data) => setMessages(data);
      const onTyping = (user) => setTypingUser(user);
      const onHideTyping = () => setTypingUser("");

      socket.on("receiveMessage", onReceive);
      socket.on("chatHistory", onHistory);
      socket.on("showTyping", onTyping);
      socket.on("hideTyping", onHideTyping);

      return () => {
        socket.off("receiveMessage", onReceive);
        socket.off("chatHistory", onHistory);
        socket.off("showTyping", onTyping);
        socket.off("hideTyping", onHideTyping);
      };
    }
  }, [page]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  if (page === "login") return <Login setPage={setPage} onAuthSuccess={handleAuth} />;
  if (page === "register") return <Register setPage={setPage} onAuthSuccess={handleAuth} />;

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 w-125 h-150 rounded-2xl shadow-xl flex flex-col">
        <ChatHeader username={currentUser?.username} />
        <MessageList 
          messages={messages} 
          currentUserId={currentUser?.userId} 
          chatRef={chatRef} 
        />
        {typingUser && <p className="text-gray-400 text-xs ml-4 mb-2">{typingUser} is typing...</p>}
        <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} socket={socket} />
      </div>
    </div>
  );
}

export default App;