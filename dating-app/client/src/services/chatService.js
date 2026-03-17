import api from "./api";
import { demoConversations, demoMessages } from "../utils/mockData";

const chatService = {
  async fetchConversations() {
    try {
      const { data } = await api.get("/messages/conversations");
      return data;
    } catch (_error) {
      return { conversations: demoConversations };
    }
  },

  async fetchMessages(matchId) {
    try {
      const { data } = await api.get(`/messages/${matchId}`);
      return data;
    } catch (_error) {
      return { messages: demoMessages[matchId] || [] };
    }
  },

  async sendMessage(matchId, payload) {
    try {
      const { data } = await api.post(`/messages/${matchId}`, payload);
      return data;
    } catch (_error) {
      return {
        data: {
          _id: `msg-${Date.now()}`,
          matchId,
          senderId: payload.senderId,
          receiverId: payload.receiverId,
          message: payload.message,
          messageType: payload.messageType || "text",
          seenStatus: false,
          createdAt: new Date().toISOString(),
        },
      };
    }
  },

  async markSeen(matchId) {
    try {
      const { data } = await api.post(`/messages/${matchId}/seen`);
      return data;
    } catch (_error) {
      return { success: true };
    }
  },
};

export default chatService;
