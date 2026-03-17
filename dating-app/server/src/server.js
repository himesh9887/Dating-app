import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDb from "./config/db.js";
import configureSocket from "./config/socket.js";

const port = Number(process.env.PORT || 5000);

const startServer = async () => {
  await connectDb();

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  configureSocket(io);
  app.set("io", io);

  httpServer.listen(port, () => {
    console.log(`Spark server listening on ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
