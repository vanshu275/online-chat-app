import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    const messageData = {
      id: socket.id,
      text: data,
      time: new Date().toLocaleTimeString(),
    };

    io.emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () =>
  console.log("Server running on http://localhost:4000")
);