import api from "./api";
import { buildFormData } from "../utils/helpers";
import { demoSearchResults, demoSuggestions, demoUser } from "../utils/mockData";

const userService = {
  async fetchSuggestions() {
    try {
      const { data } = await api.get("/users/suggestions");
      return data;
    } catch (_error) {
      return { suggestions: demoSuggestions };
    }
  },

  async searchUsers(params) {
    try {
      const { data } = await api.get("/users/search", { params });
      return data;
    } catch (_error) {
      return { users: demoSearchResults };
    }
  },

  async fetchProfile(username) {
    try {
      const { data } = await api.get(`/users/profile/${username}`);
      return data;
    } catch (_error) {
      return { profile: demoUser };
    }
  },

  async updateProfile(payload) {
    try {
      const { data } = await api.put("/users/me", buildFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (_error) {
      return { user: { ...demoUser, ...payload } };
    }
  },

  async followUser(userId) {
    try {
      const { data } = await api.post(`/users/${userId}/follow`);
      return data;
    } catch (_error) {
      return { success: true };
    }
  },

  async unfollowUser(userId) {
    try {
      const { data } = await api.delete(`/users/${userId}/follow`);
      return data;
    } catch (_error) {
      return { success: true };
    }
  },

  async activateBoost() {
    try {
      const { data } = await api.post("/users/me/boost");
      return data;
    } catch (_error) {
      return {
        boostedUntil: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };
    }
  },

  async fetchLikedYou() {
    try {
      const { data } = await api.get("/users/premium/likes");
      return data;
    } catch (_error) {
      return { likedYou: demoSuggestions };
    }
  },
};

export default userService;
