import { ImagePlus, SendHorizontal, SmilePlus } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../redux/slices/chatSlice";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";
import { useSocket } from "../../hooks/useSocket";

const ChatBox = ({ conversation }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const messages = useSelector(
    (state) => state.chat.messagesByMatch[conversation?._id] || [],
  );
  const authUser = useSelector((state) => state.auth.user);
  const typingState = useSelector((state) => state.chat.typingByMatch[conversation?._id]);

  if (!conversation) {
    return (
      <div className="glass-panel flex min-h-[560px] items-center justify-center p-10 text-center text-white/50">
        Pick a match to start talking.
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!text.trim()) {
      return;
    }

    dispatch(
      sendMessage({
        matchId: conversation._id,
        partnerId: conversation.partner._id,
        text,
      }),
    );
    socket?.emit("typing:stop", {
      matchId: conversation._id,
      recipientId: conversation.partner._id,
    });
    setText("");
  };

  const handleTyping = (value) => {
    setText(value);

    if (!socket) {
      return;
    }

    socket.emit("conversation:join", conversation._id);
    socket.emit(value ? "typing:start" : "typing:stop", {
      matchId: conversation._id,
      recipientId: conversation.partner._id,
    });
  };

  return (
    <div className="glass-panel flex min-h-[560px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <img
          src={getPrimaryPhoto(conversation.partner)}
          alt={conversation.partner.name}
          className="h-12 w-12 rounded-2xl object-cover"
        />
        <div>
          <h3 className="font-display text-lg font-semibold">{conversation.partner.name}</h3>
          <p className="text-sm text-white/50">
            {typingState?.isTyping ? "typing..." : "Active recently"}
          </p>
        </div>
      </div>
      <div className="spark-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => {
          const own = message.senderId === authUser?._id;

          return (
            <div
              key={message._id}
              className={`flex ${own ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-[24px] px-4 py-3 text-sm ${
                  own
                    ? "bg-spark-button text-white"
                    : "border border-white/10 bg-white/[0.06] text-white/80"
                }`}
              >
                <p>{message.message}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/[0.45]">
                  {formatTimeAgo(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 p-4"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="spark-button-ghost p-3"
          >
            <SmilePlus size={18} />
          </button>
          <button
            type="button"
            className="spark-button-ghost p-3"
          >
            <ImagePlus size={18} />
          </button>
          <input
            value={text}
            onChange={(event) => handleTyping(event.target.value)}
            placeholder="Type something smooth..."
            className="spark-input"
          />
          <button
            type="submit"
            className="spark-button px-4"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
