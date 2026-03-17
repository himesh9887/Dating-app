import api from "./api";
import { demoUser } from "../utils/mockData";
import { buildFormData } from "../utils/helpers";

const demoAuthResponse = {
  token: "demo-token",
  user: demoUser,
};

const authService = {
  async signup(payload) {
    try {
      const { data } = await api.post("/auth/register", buildFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (_error) {
      return demoAuthResponse;
    }
  },

  async login(payload) {
    try {
      const { data } = await api.post("/auth/login", payload);
      return data;
    } catch (_error) {
      return demoAuthResponse;
    }
  },

  async googleLogin(credential) {
    try {
      const { data } = await api.post("/auth/google", { credential });
      return data;
    } catch (_error) {
      return demoAuthResponse;
    }
  },

  async forgotPassword(email) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  async getCurrentUser() {
    try {
      const { data } = await api.get("/auth/me");
      return data;
    } catch (_error) {
      return { user: demoUser };
    }
  },
};

export default authService;
