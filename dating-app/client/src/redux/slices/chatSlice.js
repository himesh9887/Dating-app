import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "../../services/chatService";
import { demoUser } from "../../utils/mockData";
import { normalizeError } from "../../utils/helpers";

const updateConversationMeta = (state, matchId, updates) => {
  const index = state.conversations.findIndex((conversation) => conversation._id === matchId);

  if (index === -1) {
    return;
  }

  const nextConversation = {
    ...state.conversations[index],
    ...updates,
  };

  state.conversations = [
    nextConversation,
    ...state.conversations.filter((conversation) => conversation._id !== matchId),
  ];
};

export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      return await chatService.fetchConversations();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load chats"));
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await chatService.fetchMessages(matchId);
      return { matchId, messages: response.messages };
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load messages"));
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ matchId, partnerId, text }, { getState, rejectWithValue }) => {
    try {
      const senderId = getState().auth.user?._id || demoUser._id;
      const response = await chatService.sendMessage(matchId, {
        senderId,
        receiverId: partnerId,
        message: text,
      });
      return { matchId, message: response.data };
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to send message"));
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    messagesByMatch: {},
    activeMatchId: null,
    typingByMatch: {},
  },
  reducers: {
    setActiveMatch(state, action) {
      state.activeMatchId = action.payload;

      if (action.payload) {
        updateConversationMeta(state, action.payload, { unreadCount: 0 });
      }
    },
    receiveMessage(state, action) {
      const message = action.payload;
      const matchId = message.matchId;
      state.messagesByMatch[matchId] = [
        ...(state.messagesByMatch[matchId] || []),
        message,
      ];

      const currentUnread =
        state.conversations.find((conversation) => conversation._id === matchId)?.unreadCount || 0;

      updateConversationMeta(state, matchId, {
        lastMessage: message.message,
        lastMessageAt: message.createdAt,
        unreadCount: matchId === state.activeMatchId ? 0 : currentUnread + 1,
      });
    },
    updateTypingState(state, action) {
      const { matchId, isTyping, userId } = action.payload;
      state.typingByMatch[matchId] = {
        isTyping,
        userId,
      };
    },
    markConversationSeen(state, action) {
      const matchId = action.payload;
      state.messagesByMatch[matchId] = (state.messagesByMatch[matchId] || []).map(
        (message) => ({
          ...message,
          seenStatus: true,
        }),
      );
      updateConversationMeta(state, matchId, { unreadCount: 0 });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations.map((conversation) => ({
          ...conversation,
          unreadCount: conversation.unreadCount || 0,
        }));

        if (
          state.activeMatchId &&
          !state.conversations.some((conversation) => conversation._id === state.activeMatchId)
        ) {
          state.activeMatchId = null;
        }
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesByMatch[action.payload.matchId] = action.payload.messages;
        updateConversationMeta(state, action.payload.matchId, { unreadCount: 0 });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messagesByMatch[action.payload.matchId] = [
          ...(state.messagesByMatch[action.payload.matchId] || []),
          action.payload.message,
        ];
        updateConversationMeta(state, action.payload.matchId, {
          lastMessage: action.payload.message.message,
          lastMessageAt: action.payload.message.createdAt,
          unreadCount: 0,
        });
      });
  },
});

export const {
  markConversationSeen,
  receiveMessage,
  setActiveMatch,
  updateTypingState,
} = chatSlice.actions;
export default chatSlice.reducer;
