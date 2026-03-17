import api from "./api";
import { buildFormData } from "../utils/helpers";
import { demoPosts, demoStories } from "../utils/mockData";

const postService = {
  async fetchFeed(page = 1) {
    try {
      const { data } = await api.get(`/posts/feed?page=${page}&limit=5`);
      return data;
    } catch (_error) {
      return {
        posts: demoPosts,
        page,
        hasMore: false,
      };
    }
  },

  async fetchStories() {
    try {
      const { data } = await api.get("/posts/stories/all");
      return data;
    } catch (_error) {
      return { stories: demoStories };
    }
  },

  async createPost(payload) {
    try {
      const { data } = await api.post("/posts", buildFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (_error) {
      return {
        post: {
          _id: `post-${Date.now()}`,
          author: payload.author,
          caption: payload.caption,
          hashtags: payload.hashtags,
          media: payload.preview
            ? [{ url: payload.preview, type: "image" }]
            : [],
          likes: [],
          comments: [],
          shareCount: 0,
          createdAt: new Date().toISOString(),
        },
      };
    }
  },

  async likePost(postId) {
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      return data;
    } catch (_error) {
      return { success: true };
    }
  },

  async commentOnPost(postId, comment) {
    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { comment });
      return data;
    } catch (_error) {
      return { success: true, comment };
    }
  },

  async createStory(file) {
    try {
      const { data } = await api.post(
        "/posts/stories",
        buildFormData({ media: file }),
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return data;
    } catch (_error) {
      return {
        story: {
          _id: `story-${Date.now()}`,
          author: demoPosts[2].author,
          media: {
            url: URL.createObjectURL(file),
            type: "image",
          },
          createdAt: new Date().toISOString(),
        },
      };
    }
  },
};

export default postService;
