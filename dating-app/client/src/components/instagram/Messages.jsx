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
  <div className="w-[104px] shrink-0 text-center">
    <div className="relative mx-auto flex w-full justify-center pt-12">
      <div className="absolute left-1/2 top-0 w-[92px] -translate-x-1/2 rounded-[20px] border border-white/10 bg-[#171c24] px-3 py-2 text-left text-[13px] leading-4 text-white/78 shadow-[0_16px_32px_rgba(0,0,0,0.28)]">
        {item.note}
      </div>
      <div className="relative rounded-full bg-spark-gradient p-[2px]">
        <img
          src={item.image}
          alt={item.title}
          className="h-[76px] w-[76px] rounded-full border-2 border-[#0b0f15] object-cover"
        />
        {item.hasBadge ? (
          <span className="absolute -right-1 top-1 h-[14px] w-[14px] rounded-full border-2 border-[#0b0f15] bg-spark-coral" />
        ) : null}
      </div>
    </div>
    <p className="mt-3 truncate text-[13px] font-medium text-white">{item.title}</p>
    <p className="mt-1 truncate text-[12px] text-white/48">{item.subtitle}</p>
  </div>
);

const ConversationRow = ({ conversation, active, onOpenConversation }) => {
  const displayName = conversation.partner.username || conversation.partner.name;
  const messageAge = formatTimeAgo(conversation.lastMessageAt || conversation.matchedAt);
  const previewText = getConversationPreview(conversation);
  const hasUnread = Boolean(conversation.unreadCount);

  return (
    <button
      type="button"
      onClick={() => onOpenConversation(conversation._id)}
      className={classNames(
        "group flex w-full items-center gap-3 rounded-[26px] border px-3 py-3.5 text-left transition-all duration-300",
        active
          ? "border-white/14 bg-[linear-gradient(135deg,rgba(113,223,243,0.12),rgba(255,139,107,0.08),rgba(18,22,29,0.96))] shadow-[0_18px_40px_rgba(13,24,40,0.35)]"
          : "border-white/5 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04]",
      )}
    >
      <div className="relative shrink-0">
        <img
          src={getPrimaryPhoto(conversation.partner)}
          alt={conversation.partner.name}
          className="h-[58px] w-[58px] rounded-full border border-white/10 object-cover shadow-[0_12px_26px_rgba(0,0,0,0.3)]"
        />
        {hasUnread ? (
          <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0b0f15] bg-spark-coral px-1 text-[10px] font-semibold text-white">
            {conversation.unreadCount}
          </span>
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-5 text-white">{displayName}</p>
            <p className="mt-0.5 truncate text-[11px] uppercase tracking-[0.22em] text-white/32">
              @{conversation.partner.username || "new-match"}
            </p>
          </div>

          {messageAge ? (
            <span
              className={classNames(
                "shrink-0 pt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em]",
                hasUnread ? "text-spark-cyan" : "text-white/34",
              )}
            >
              {messageAge}
            </span>
          ) : null}
        </div>

        <p
          className={classNames(
            "mt-2 truncate pr-2 text-[13px] leading-5",
            hasUnread ? "text-white/82" : "text-[#9ea4b1]",
          )}
        >
          {previewText}
        </p>
      </div>

      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/36 transition-all duration-300 group-hover:bg-white/[0.05] group-hover:text-white/76 sm:flex">
        <Camera size={19} strokeWidth={1.9} />
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
      title:
        conversation.partner.name?.split(" ")[0] || conversation.partner.username || "Match",
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
  const tabCounts = normalizedConversations.reduce(
    (counts, conversation) => ({
      ...counts,
      [conversation.inboxType]: (counts[conversation.inboxType] || 0) + 1,
    }),
    {
      primary: 0,
      requests: 0,
      general: 0,
    },
  );
  const totalUnread = normalizedConversations.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0,
  );

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

  return (
    <div className="px-1 pb-4 sm:px-0">
      <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(244,193,108,0.14),_rgba(5,8,13,0.96)_38%,_#020203_100%)] text-white shadow-panel">
        <div className="absolute inset-0 spark-grid-bg opacity-[0.08]" />
        <div className="absolute left-[-8%] top-8 h-52 w-52 rounded-full bg-spark-gold/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-4%] h-64 w-64 rounded-full bg-spark-cyan/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-[1380px] flex-col gap-4 p-3 sm:p-4 lg:h-[calc(100vh-9rem)] lg:min-h-[760px] lg:flex-row lg:p-5">
          <aside
            className={classNames(
              "min-h-0 w-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0f15]/90 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:h-full",
              selectedConversationId
                ? "hidden lg:flex lg:w-[390px] xl:w-[420px]"
                : "flex lg:w-[390px] xl:w-[420px]",
            )}
          >
            <div className="border-b border-white/10 px-4 pb-4 pt-3.5 sm:px-5">
              <header className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:bg-white/[0.07]"
                  aria-label="Messages settings"
                >
                  <ListFilter size={22} strokeWidth={1.9} />
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-2 py-1 text-[1.02rem] font-semibold text-white"
                >
                  <span>{resolvedUser.username}</span>
                  <ChevronDown size={16} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:bg-white/[0.07]"
                    aria-label="Inbox activity"
                  >
                    <TrendingUp size={20} strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition-all duration-300 hover:bg-white/[0.07]"
                    aria-label="Compose message"
                  >
                    <SquarePen size={20} strokeWidth={2} />
                  </button>
                </div>
              </header>

              <div className="mt-4 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(244,193,108,0.22),rgba(113,223,243,0.12),rgba(11,15,21,0.92))] p-4 shadow-[0_18px_44px_rgba(5,10,19,0.36)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/48">
                  Your inbox
                </p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div className="max-w-[220px]">
                    <h1 className="text-[1.55rem] font-semibold leading-tight text-white">
                      Messages
                    </h1>
                    <p className="mt-2 text-[14px] leading-6 text-white/74">
                      Cleaner chat layout, better spacing, and easier reading across every thread.
                    </p>
                  </div>

                  <div className="shrink-0 rounded-[22px] border border-white/10 bg-black/25 px-3.5 py-3 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/42">
                      Unread
                    </p>
                    <p className="mt-1 text-[1.2rem] font-semibold text-white">{totalUnread}</p>
                  </div>
                </div>
              </div>

              <label className="mt-4 flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white/54 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                <Search size={18} strokeWidth={2} />
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search messages or people"
                  className="w-full bg-transparent text-[15px] leading-6 text-white placeholder:text-white/42"
                />
              </label>
            </div>

            <div className="spark-scrollbar flex-1 overflow-y-auto px-4 pb-5 sm:px-5">
              <section className="border-b border-white/6 py-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                      Notes
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-white/54">
                      Quick prompts to keep conversations warm and easy to start.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-[12px] font-semibold text-spark-cyan transition hover:text-white"
                  >
                    View
                  </button>
                </div>

                <div className="spark-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
                  {notes.map((item) => (
                    <NoteCard
                      key={item._id}
                      item={item}
                    />
                  ))}
                </div>
              </section>

              <section className="py-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-[1.08rem] font-semibold text-white">Chats</h2>
                    <p className="mt-1 text-[13px] text-white/52">
                      {filteredConversations.length} conversations in {activeFilter}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/76 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                    aria-label="Filter conversations"
                  >
                    <SlidersHorizontal size={17} strokeWidth={2.1} />
                  </button>
                </div>

                <div className="spark-scrollbar mb-4 flex gap-3 overflow-x-auto pb-1">
                  {inboxTabs.map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveFilter(tab.key)}
                      className={classNames(
                        "flex h-11 shrink-0 items-center gap-2 rounded-full border px-[18px] text-[14px] font-medium transition-all duration-300 active:scale-95",
                        activeFilter === tab.key
                          ? "border-white/14 bg-white/[0.08] text-white shadow-[0_14px_30px_rgba(17,30,49,0.26)]"
                          : "border-white/10 bg-white/[0.02] text-white/72 hover:bg-white/[0.04]",
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={classNames(
                          "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          activeFilter === tab.key ? "bg-black/20 text-white" : "bg-white/6 text-white/60",
                        )}
                      >
                        {tabCounts[tab.key] || 0}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5">
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
                    <div className="rounded-[26px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                        No matches
                      </p>
                      <p className="mt-3 text-[14px] leading-6 text-white/56">
                        No chats match this search yet. Try another name or switch inbox tabs.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </aside>

          {selectedConversationId ? (
            <div className="w-full lg:hidden">
              <ChatBox
                conversation={activeConversation}
                onBack={() => navigate("/messages")}
                isMobileDetail
              />
            </div>
          ) : null}

          <div className="hidden min-h-0 lg:flex lg:flex-1">
            <ChatBox conversation={activeConversation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
