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
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const chatRef = useRef(null);

  // 1. Ye function login/register ke turant baad chalega
  const handleAuthSuccess = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setCurrentUser(decoded);

    // Socket connect logic
    socket.auth = { token };
    socket.disconnect(); // Purana agar kuch hai toh disconnect
    socket.connect(); // Fresh connection with new token
    setPage("chat");
  };

  // 2. Refresh handle karne ke liye
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      handleAuthSuccess(token);
    }
  }, []);

  // 3. Socket Listeners (Only when in chat page)
  useEffect(() => {
    if (page === "chat" && currentUser) {
      socket.emit("joinChat");

      socket.on("receiveMessage", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      socket.on("chatHistory", (data) => setMessages(data));
      socket.on("showTyping", (user) => setTypingUser(user));
      socket.on("hideTyping", () => setTypingUser(""));

      return () => {
        socket.off("receiveMessage");
        socket.off("chatHistory");
        socket.off("showTyping");
        socket.off("hideTyping");
      };
    }
  }, [page, currentUser]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  // Auto scroll
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (page === "login")
    return <Login setPage={setPage} onAuthSuccess={handleAuthSuccess} />;
  if (page === "register")
    return <Register setPage={setPage} onAuthSuccess={handleAuthSuccess} />;

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 w-125 h-150 rounded-2xl shadow-xl flex flex-col">
        <ChatHeader username={currentUser?.username} />
        <MessageList
          messages={messages}
          currentUserId={currentUser?.userId}
          chatRef={chatRef}
        />
        {typingUser && (
          <p className="text-gray-400 text-xs ml-4 mb-2 italic">
            {typingUser} is typing...
          </p>
        )}
        <MessageInput
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          socket={socket}
        />
      </div>
    </div>
  );
}
export default App;
