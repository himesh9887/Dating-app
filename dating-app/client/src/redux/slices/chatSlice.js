import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "../../services/chatService";
import { demoUser } from "../../utils/mockData";
import { normalizeError } from "../../utils/helpers";

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
  async ({ matchId, partnerId, text }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(matchId, {
        senderId: demoUser._id,
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
    },
    receiveMessage(state, action) {
      const message = action.payload;
      const matchId = message.matchId;
      state.messagesByMatch[matchId] = [
        ...(state.messagesByMatch[matchId] || []),
        message,
      ];
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload.conversations;
        state.activeMatchId ||= action.payload.conversations[0]?._id || null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messagesByMatch[action.payload.matchId] = action.payload.messages;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messagesByMatch[action.payload.matchId] = [
          ...(state.messagesByMatch[action.payload.matchId] || []),
          action.payload.message,
        ];
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
