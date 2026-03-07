import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 4000;

const httpServer = createServer(app);

// initialize socket
initSocket(httpServer);

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});