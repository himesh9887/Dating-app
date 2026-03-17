import jwt from "jsonwebtoken";

const configureSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error("Unauthorized socket connection"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);

    socket.on("conversation:join", (matchId) => {
      socket.join(matchId);
    });

    socket.on("typing:start", ({ matchId, recipientId }) => {
      io.to(matchId).emit("typing:update", {
        matchId,
        recipientId,
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on("typing:stop", ({ matchId, recipientId }) => {
      io.to(matchId).emit("typing:update", {
        matchId,
        recipientId,
        userId: socket.userId,
        isTyping: false,
      });
    });

    socket.on("message:seen", ({ matchId, recipientId }) => {
      io.to(matchId).emit("message:seen:update", {
        matchId,
        recipientId,
        userId: socket.userId,
      });
    });
  });
};

export default configureSocket;
