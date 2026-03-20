import { ArrowLeft, ImagePlus, Info, Phone, SendHorizontal, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const messageListRef = useRef(null);

  useEffect(() => {
    if (!socket || !conversation?._id) {
      return;
    }

    socket.emit("conversation:join", conversation._id);
  }, [conversation?._id, socket]);

  useEffect(() => {
    const container = messageListRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [conversation?._id, messages.length]);

  if (!conversation) {
    return (
      <div
        className={classNames(
          "flex w-full flex-col overflow-hidden text-white",
          isMobileDetail
            ? "min-h-screen bg-[#05070c]"
            : "min-h-[620px] rounded-[32px] border border-white/10 bg-[#0b0f15]/90 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:min-h-[calc(100vh-7rem)]",
        )}
      >
        {isMobileDetail ? (
          <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#06090f]/95 px-4 py-3 backdrop-blur-xl">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                aria-label="Back to inbox"
              >
                <ArrowLeft size={22} strokeWidth={2.1} />
              </button>
            ) : null}
            <p className="text-[17px] font-semibold text-white">Chat</p>
          </div>
        ) : null}

        <div className="flex flex-1 items-center justify-center px-6 py-10 text-center">
          <div className="max-w-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#3797f0]/15 text-[1rem] font-semibold tracking-[0.18em] text-[#9bd0ff]">
              DM
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/30">
              Messages
            </p>
            <h2 className="mt-3 text-[1.45rem] font-semibold leading-tight text-white">
              Choose a conversation
            </h2>
            <p className="mt-3 text-[14px] leading-6 text-white/56">
              Open any thread from the inbox to read messages, send replies, and keep the chat
              flowing in one clean space.
            </p>
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
        "flex w-full flex-col overflow-hidden text-white",
        isMobileDetail
          ? "min-h-screen bg-[#05070c]"
          : "min-h-[620px] rounded-[32px] border border-white/10 bg-[#0b0f15]/90 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:min-h-[calc(100vh-7rem)]",
      )}
    >
      <div
        className={classNames(
          "flex items-center gap-3 border-b border-white/10 bg-[linear-gradient(180deg,rgba(14,19,27,0.98),rgba(10,13,18,0.92))]",
          isMobileDetail ? "sticky top-0 z-20 px-4 py-3 backdrop-blur-xl" : "px-5 py-4",
        )}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
            aria-label="Back to inbox"
          >
            <ArrowLeft size={22} strokeWidth={2.1} />
          </button>
        ) : null}

        <div className="rounded-full bg-[linear-gradient(135deg,rgba(55,151,240,0.92),rgba(173,99,255,0.65))] p-[2px]">
          <img
            src={getPrimaryPhoto(conversation.partner)}
            alt={conversation.partner.name}
            className="h-11 w-11 rounded-full border-2 border-[#0b0f15] object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[16px] font-semibold tracking-[0.01em] text-white">
              {conversation.partner.username || conversation.partner.name}
            </h3>
            {typingState?.isTyping ? (
              <span className="rounded-full bg-[#3797f0]/14 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9ed1ff]">
                Live
              </span>
            ) : null}
          </div>
          <p className="mt-1 truncate text-[12px] text-white/46">
            {typingState?.isTyping ? "typing right now..." : `@${conversation.partner.username || "chat"}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/78 transition hover:bg-white/[0.07] hover:text-white"
            aria-label="Voice call"
          >
            <Phone size={17} strokeWidth={2.1} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/78 transition hover:bg-white/[0.07] hover:text-white"
            aria-label="Conversation info"
          >
            <Info size={17} strokeWidth={2.1} />
          </button>
        </div>
      </div>

      <div
        ref={messageListRef}
        className="spark-scrollbar flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(55,151,240,0.08),_rgba(0,0,0,0)_34%)] px-4 py-4 sm:px-5"
      >
        {messages.length ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
            <div className="self-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/34">
              Today
            </div>

            {messages.map((message) => {
              const own = message.senderId === resolvedUser._id;

              return (
                <div
                  key={message._id}
                  className={`flex ${own ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={classNames(
                      "max-w-[86%] rounded-[24px] px-4 py-3 shadow-[0_14px_34px_rgba(0,0,0,0.18)] sm:max-w-[76%]",
                      own
                        ? "rounded-br-[10px] bg-[linear-gradient(135deg,#3797f0,#5ab2ff)] text-white"
                        : "rounded-bl-[10px] border border-white/10 bg-white/[0.05] text-white/92",
                    )}
                  >
                    <p className="text-[14px] leading-6 sm:text-[15px]">{message.message}</p>
                    <div
                      className={classNames(
                        "mt-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em]",
                        own ? "text-white/68" : "text-white/40",
                      )}
                    >
                      <span>{formatTimeAgo(message.createdAt)}</span>
                      {own && message.seenStatus ? <span className="text-[#d7eeff]">Seen</span> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-7 text-center shadow-[0_18px_44px_rgba(0,0,0,0.2)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/32">
                New conversation
              </p>
              <h3 className="mt-3 text-[1.28rem] font-semibold text-white">Break the ice</h3>
              <p className="mt-3 text-[14px] leading-6 text-white/56">
                Say hi first. Short, thoughtful messages usually make the best first impression.
              </p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-white/10 bg-[#06090f]/95 p-3 backdrop-blur-xl sm:p-4"
      >
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[28px] border border-white/10 bg-[#121821] px-3 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/68 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Open emoji picker"
          >
            <SmilePlus size={17} />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/68 transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Attach media"
          >
            <ImagePlus size={17} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/28">
              Message
            </p>
            <input
              value={text}
              onChange={(event) => handleTyping(event.target.value)}
              placeholder="Write something nice..."
              className="w-full bg-transparent px-2 pb-1 pt-0.5 text-[15px] leading-6 text-white placeholder:text-white/38"
            />
          </div>

          <button
            type="submit"
            className="mb-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3797f0,#5ab2ff)] text-white shadow-[0_12px_26px_rgba(55,151,240,0.3)] transition hover:brightness-110"
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
