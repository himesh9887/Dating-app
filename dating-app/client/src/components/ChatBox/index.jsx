import { ArrowLeft, ImagePlus, Info, Phone, SendHorizontal, SmilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../hooks/useSocket";
import { sendMessage } from "../../redux/slices/chatSlice";
import { classNames, formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";
import { demoUser } from "../../utils/mockData";

const ChatBox = ({ conversation, onBack, isMobileDetail = false }) => {
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [text, setText] = useState("");
  const messages = useSelector(
    (state) => state.chat.messagesByMatch[conversation?._id] || [],
  );
  const authUser = useSelector((state) => state.auth.user);
  const resolvedUser = authUser || demoUser;
  const typingState = useSelector((state) => state.chat.typingByMatch[conversation?._id]);

  useEffect(() => {
    if (!socket || !conversation?._id) {
      return;
    }

    socket.emit("conversation:join", conversation._id);
  }, [conversation?._id, socket]);

  if (!conversation) {
    return (
      <div
        className={classNames(
          isMobileDetail ? "min-h-screen bg-black text-white" : "glass-panel min-h-[620px]",
          "flex flex-col overflow-hidden",
        )}
      >
        {isMobileDetail ? (
          <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-black/95 px-4 pb-4 pt-3 backdrop-blur-xl">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="instagram-icon-button"
                aria-label="Back to inbox"
              >
                <ArrowLeft size={28} strokeWidth={2.1} />
              </button>
            ) : null}
            <p className="text-[1.05rem] font-semibold text-white">Chat</p>
          </div>
        ) : null}

        <div className="flex flex-1 items-center justify-center px-8 text-center text-white/55">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/35">Messages</p>
            <p className="mt-3 text-sm text-white/55">Select a conversation to open the chat.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText) {
      return;
    }

    dispatch(
      sendMessage({
        matchId: conversation._id,
        partnerId: conversation.partner._id,
        text: trimmedText,
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

    socket.emit(value ? "typing:start" : "typing:stop", {
      matchId: conversation._id,
      recipientId: conversation.partner._id,
    });
  };

  return (
    <div
      className={classNames(
        "flex flex-col overflow-hidden text-white",
        isMobileDetail
          ? "min-h-screen bg-black"
          : "glass-panel min-h-[620px] bg-black/90 lg:min-h-[calc(100vh-10rem)]",
      )}
    >
      <div
        className={classNames(
          "flex items-center gap-3 border-b border-white/10",
          isMobileDetail
            ? "sticky top-0 z-20 bg-black/95 px-4 pb-4 pt-3 backdrop-blur-xl"
            : "px-5 py-4",
        )}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="instagram-icon-button"
            aria-label="Back to inbox"
          >
            <ArrowLeft size={28} strokeWidth={2.1} />
          </button>
        ) : null}

        <img
          src={getPrimaryPhoto(conversation.partner)}
          alt={conversation.partner.name}
          className="h-11 w-11 rounded-full border border-white/10 object-cover"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[1.02rem] font-semibold">
            {conversation.partner.username || conversation.partner.name}
          </h3>
          <p className="text-sm text-white/50">
            {typingState?.isTyping ? "typing..." : `@${conversation.partner.username || "chat"}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="instagram-icon-button h-10 w-10 text-white/80"
            aria-label="Voice call"
          >
            <Phone size={20} strokeWidth={2.1} />
          </button>
          <button
            type="button"
            className="instagram-icon-button h-10 w-10 text-white/80"
            aria-label="Conversation info"
          >
            <Info size={20} strokeWidth={2.1} />
          </button>
        </div>
      </div>

      <div className="spark-scrollbar flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_rgba(0,0,0,0)_45%)] px-4 py-5 sm:px-5">
        {messages.length ? (
          messages.map((message) => {
            const own = message.senderId === resolvedUser._id;

            return (
              <div
                key={message._id}
                className={`flex ${own ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={classNames(
                    "max-w-[85%] rounded-[26px] px-4 py-3 text-[0.97rem] sm:max-w-[78%]",
                    own ? "bg-[#3797f0] text-white" : "bg-[#23262d] text-white/90",
                  )}
                >
                  <p>{message.message}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
                    {formatTimeAgo(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/35">New conversation</p>
              <p className="mt-3 text-sm text-white/55">
                Say hi first. Good chats usually start simple.
              </p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 bg-black/95 p-4 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#15181e] px-2 py-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Open emoji picker"
          >
            <SmilePlus size={18} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/[0.06] hover:text-white"
            aria-label="Attach media"
          >
            <ImagePlus size={18} />
          </button>
          <input
            value={text}
            onChange={(event) => handleTyping(event.target.value)}
            placeholder="Message..."
            className="min-w-0 flex-1 bg-transparent px-2 text-[0.98rem] text-white placeholder:text-white/40"
          />
          <button
            type="submit"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3797f0] text-white transition hover:brightness-110"
            aria-label="Send message"
          >
            <SendHorizontal size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
