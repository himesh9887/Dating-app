import api from "./api";
import { demoNotifications } from "../utils/mockData";

const notificationService = {
  async fetchNotifications() {
    try {
      const { data } = await api.get("/notifications");
      return data;
    } catch (_error) {
      return { notifications: demoNotifications };
    }
  },

  async markRead(id) {
    try {
      const { data } = await api.post(`/notifications/${id}/read`);
      return data;
    } catch (_error) {
      return { success: true };
    }
  },

  async markAllRead() {
    try {
      const { data } = await api.post("/notifications/read-all");
      return data;
    } catch (_error) {
      return { success: true };
    }
  },
};

export default notificationService;
