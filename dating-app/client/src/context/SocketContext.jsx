import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  markConversationSeen,
  receiveMessage,
  updateTypingState,
} from "../redux/slices/chatSlice";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { fetchMatches } from "../redux/slices/matchSlice";

export const SocketContext = createContext({
  socket: null,
});

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token || token === "demo-token") {
      return undefined;
    }

    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token },
    });

    socketInstance.on("message:new", (message) => {
      dispatch(receiveMessage(message));
    });

    socketInstance.on("message:seen:update", ({ matchId }) => {
      dispatch(markConversationSeen(matchId));
    });

    socketInstance.on("typing:update", (payload) => {
      dispatch(updateTypingState(payload));
    });

    socketInstance.on("notification:new", () => {
      dispatch(fetchNotifications());
    });

    socketInstance.on("match:new", () => {
      dispatch(fetchMatches());
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, [dispatch, token]);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
