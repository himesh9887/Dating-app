import api from "./api";
import { demoDiscoverUsers, demoMatches } from "../utils/mockData";

const matchService = {
  async fetchDiscover() {
    try {
      const { data } = await api.get("/matches/discover");
      return data;
    } catch (_error) {
      return { users: demoDiscoverUsers };
    }
  },

  async swipeUser(userId, action) {
    try {
      const { data } = await api.post(`/matches/${userId}/swipe`, { action });
      return data;
    } catch (_error) {
      const partner = demoDiscoverUsers.find((user) => user._id === userId);
      const matched = action !== "dislike" && userId === demoDiscoverUsers[0]._id;

      return {
        matched,
        match: matched
          ? {
              _id: `m-${Date.now()}`,
              partner,
              matchedAt: new Date().toISOString(),
            }
          : null,
      };
    }
  },

  async fetchMatches() {
    try {
      const { data } = await api.get("/matches");
      return data;
    } catch (_error) {
      return { matches: demoMatches };
    }
  },
};

export default matchService;
