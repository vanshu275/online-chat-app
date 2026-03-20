import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/messages.models.js";

let users = {};

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded; // user info attach
      console.log("User authenticated:", decoded);

      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    // 1️⃣ JOIN CHAT
    socket.on("joinChat", async () => {
      const username = socket.user.username;
      users[socket.id] = username;

      // 🔹 LOAD OLD MESSAGES
      const oldMessages = await Message.find().sort({ createdAt: 1 }).limit(10);
      socket.emit("chatHistory", oldMessages);

      io.emit("receiveMessage", {
        user: "System",
        message: `${username} joined the chat`,
      });
    });

    // ... existing imports
   // Backend sendMessage logic update
socket.on("sendMessage", async (message) => {
  const username = socket.user.username; // Direct decoded token se lo
  const userId = socket.user.userId;

  const newMessage = new Message({
    user: userId,
    username: username,
    message: message,
  });

  await newMessage.save();

  io.emit("receiveMessage", {
    user: userId,
    username: username,
    message: message,
  });
});

    // 3️⃣ TYPING
    socket.on("typing", () => {
      const username = users[socket.id];
      socket.broadcast.emit("showTyping", username);
    });

    socket.on("stopTyping", () => {
      socket.broadcast.emit("hideTyping");
    });

    // 4️⃣ DISCONNECT
    socket.on("disconnect", () => {
      const username = users[socket.id];

      if (username) {
        io.emit("receiveMessage", {
          user: "System",
          message: `${username} left the chat`,
        });

        delete users[socket.id];
      }
    });
  });
};





