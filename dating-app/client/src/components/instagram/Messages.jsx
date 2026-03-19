import {
  Camera,
  ChevronDown,
  ListFilter,
  Search,
  SlidersHorizontal,
  SquarePen,
  TrendingUp,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "../ChatBox";
import { fetchConversations, fetchMessages, setActiveMatch } from "../../redux/slices/chatSlice";
import { classNames, formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";
import { demoUser } from "../../utils/mockData";

const inboxTabs = [
  { key: "primary", label: "Primary" },
  { key: "requests", label: "Requests" },
  { key: "general", label: "General" },
];

const notePrompts = [
  "Hot take...",
  "Late night songs",
  "Weekend plan?",
  "Reply fast",
];

const getInboxType = (conversation, index) => {
  if (conversation.inboxType) {
    return conversation.inboxType;
  }

  return index < 2 ? "primary" : "general";
};

const getConversationPreview = (conversation) =>
  conversation.lastMessage || "Start the conversation.";

const NoteCard = ({ item }) => (
  <div className="w-[94px] shrink-0 text-center">
    <div className="relative mx-auto flex w-full justify-center pt-10">
      <div className="absolute left-0 top-0 max-w-[88px] rounded-[22px] bg-[#23262d] px-3 py-2 text-left text-[0.95rem] leading-5 text-white/70 shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
        {item.note}
      </div>
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="h-[76px] w-[76px] rounded-full border border-[#262626] object-cover"
        />
        {item.hasBadge ? (
          <span className="absolute -right-1 top-0 h-4 w-4 rounded-full border-2 border-black bg-pink-500" />
        ) : null}
      </div>
    </div>
    <p className="mt-3 truncate text-[0.98rem] text-white">{item.title}</p>
    <p className="truncate text-sm text-[#a8a8a8]">{item.subtitle}</p>
  </div>
);

const ConversationRow = ({ conversation, active, onOpenConversation }) => {
  const displayName = conversation.partner.username || conversation.partner.name;
  const messageAge = formatTimeAgo(conversation.lastMessageAt || conversation.matchedAt);
  const previewText = messageAge
    ? `${getConversationPreview(conversation)} - ${messageAge}`
    : getConversationPreview(conversation);

  return (
    <button
      type="button"
      onClick={() => onOpenConversation(conversation._id)}
      className={classNames(
        "group flex w-full items-center gap-3 rounded-[22px] px-1 py-3 text-left transition-all duration-300",
        active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]",
      )}
    >
      <div className="relative shrink-0">
        <img
          src={getPrimaryPhoto(conversation.partner)}
          alt={conversation.partner.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        {conversation.unreadCount ? (
          <span className="absolute bottom-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0095f6] px-1 text-[10px] font-semibold text-white">
            {conversation.unreadCount}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
        <p className="mt-0.5 truncate text-xs text-[#a8a8a8]">{previewText}</p>
      </div>

      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#a8a8a8] transition-all duration-300 group-hover:bg-white/[0.04]">
        <Camera size={22} strokeWidth={1.8} />
      </span>
    </button>
  );
};

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  const conversations = useSelector((state) => state.chat.conversations);
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("primary");
  const deferredSearch = useDeferredValue(searchValue.trim().toLowerCase());
  const resolvedUser = authUser || demoUser;
  const normalizedConversations = conversations.map((conversation, index) => ({
    ...conversation,
    inboxType: getInboxType(conversation, index),
  }));
  const selectedConversationId = conversationId || null;
  const activeConversation =
    normalizedConversations.find((conversation) => conversation._id === selectedConversationId) ||
    null;
  const notes = [
    {
      _id: "note-self",
      title: "Your note",
      subtitle: "Location off",
      note: notePrompts[0],
      image: getPrimaryPhoto(resolvedUser),
    },
    ...normalizedConversations.slice(0, 4).map((conversation, index) => ({
      _id: `note-${conversation._id}`,
      title: conversation.partner.name.split(" ")[0],
      subtitle: conversation.partner.username || "Reply now",
      note: notePrompts[(index + 1) % notePrompts.length],
      image: getPrimaryPhoto(conversation.partner),
      hasBadge: index === 1,
    })),
  ];
  const filteredConversations = normalizedConversations.filter((conversation) => {
    if (conversation.inboxType !== activeFilter) {
      return false;
    }

    if (!deferredSearch) {
      return true;
    }

    const searchableText = [
      conversation.partner.name,
      conversation.partner.username,
      conversation.lastMessage,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(deferredSearch);
  });

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedConversationId) {
      dispatch(setActiveMatch(null));
      return;
    }

    dispatch(setActiveMatch(selectedConversationId));
    dispatch(fetchMessages(selectedConversationId));
  }, [dispatch, selectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    const selectedConversation = normalizedConversations.find(
      (conversation) => conversation._id === selectedConversationId,
    );

    if (selectedConversation?.inboxType) {
      setActiveFilter(selectedConversation.inboxType);
    }
  }, [normalizedConversations, selectedConversationId]);

  const handleOpenConversation = (matchId) => {
    dispatch(setActiveMatch(matchId));
    navigate(`/messages/${matchId}`);
  };

  if (selectedConversationId) {
    return (
      <ChatBox
        conversation={activeConversation}
        onBack={() => navigate("/messages")}
        isMobileDetail
      />
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 pb-24 pt-3 text-white">
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex items-center justify-between border-b border-[#262626] bg-black/95 px-4 pb-3 pt-2 backdrop-blur-xl">
        <button
          type="button"
          className="instagram-icon-button"
          aria-label="Messages settings"
        >
          <ListFilter size={30} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 text-[1.15rem] font-semibold"
        >
          <span>{resolvedUser.username}</span>
          <ChevronDown size={18} />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="instagram-icon-button"
            aria-label="Inbox activity"
          >
            <TrendingUp size={24} strokeWidth={2.1} />
          </button>
          <button
            type="button"
            className="instagram-icon-button"
            aria-label="Compose message"
          >
            <SquarePen size={24} strokeWidth={2.1} />
          </button>
        </div>
      </header>

      <label className="mb-5 flex items-center gap-3 rounded-full bg-[#262626] px-4 py-2.5 text-[#a8a8a8]">
        <Search size={18} strokeWidth={2.1} />
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search or ask Meta AI"
          className="w-full bg-transparent text-[1rem] text-white placeholder:text-[#a8a8a8]"
        />
      </label>

      <div className="spark-scrollbar -mx-1 mb-6 flex gap-4 overflow-x-auto px-1 pb-2">
        {notes.map((item) => (
          <NoteCard
            key={item._id}
            item={item}
          />
        ))}
      </div>

      <div className="spark-scrollbar mb-5 flex gap-3 overflow-x-auto pb-1">
        <button
          type="button"
          className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-[#262626] px-4 text-white transition-all duration-300 active:scale-95"
        >
          <SlidersHorizontal size={18} strokeWidth={2.1} />
          <ChevronDown size={16} />
        </button>

        {inboxTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className={classNames(
              "h-12 shrink-0 rounded-full border px-6 text-[1.02rem] font-medium transition-all duration-300 active:scale-95",
              activeFilter === tab.key
                ? "border-transparent bg-[#2d323a] text-white"
                : "border-[#262626] text-white/80",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filteredConversations.length ? (
          filteredConversations.map((conversation) => (
            <ConversationRow
              key={conversation._id}
              conversation={conversation}
              active={selectedConversationId === conversation._id}
              onOpenConversation={handleOpenConversation}
            />
          ))
        ) : (
          <div className="rounded-[22px] border border-[#262626] px-5 py-8 text-center text-[#a8a8a8]">
            No chats match this search yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
