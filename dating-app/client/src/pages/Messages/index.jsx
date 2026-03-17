import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "../../components/ChatBox";
import SectionHeader from "../../components/common/SectionHeader";
import { fetchConversations, fetchMessages, setActiveMatch } from "../../redux/slices/chatSlice";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const MessagesPage = () => {
  const dispatch = useDispatch();
  const { conversations, activeMatchId } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (activeMatchId) {
      dispatch(fetchMessages(activeMatchId));
    }
  }, [activeMatchId, dispatch]);

  const activeConversation = conversations.find((conversation) => conversation._id === activeMatchId);

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <div className="glass-panel p-5">
        <SectionHeader title="Conversations" subtitle="Realtime chat with your matches." />
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <button
              key={conversation._id}
              type="button"
              onClick={() => dispatch(setActiveMatch(conversation._id))}
              className={`glass-soft flex w-full items-center gap-3 p-3 text-left transition ${
                activeMatchId === conversation._id ? "border-spark-pink/40 bg-spark-pink/10" : ""
              }`}
            >
              <img
                src={getPrimaryPhoto(conversation.partner)}
                alt={conversation.partner.name}
                className="h-14 w-14 rounded-3xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate font-display text-lg font-semibold">
                    {conversation.partner.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/[0.35]">
                    {formatTimeAgo(conversation.lastMessageAt || conversation.matchedAt)}
                  </span>
                </div>
                <p className="truncate text-sm text-white/[0.55]">
                  {conversation.lastMessage || "Start the conversation"}
                </p>
              </div>
              {conversation.unreadCount ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-spark-button text-xs font-semibold">
                  {conversation.unreadCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <ChatBox conversation={activeConversation} />
    </div>
  );
};

export default MessagesPage;
