import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { updateProfile } from "./userSlice";
import { normalizeError } from "../../utils/helpers";

const storedToken = localStorage.getItem("spark-token");
const storedUser = localStorage.getItem("spark-user");

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Login failed"));
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.signup(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Signup failed"));
    }
  },
);

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async (credential, { rejectWithValue }) => {
    try {
      return await authService.googleLogin(credential);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Google login failed"));
    }
  },
);

export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load account"));
    }
  },
);

const persistAuth = (state, payload) => {
  state.user = payload.user;
  state.token = payload.token ?? state.token;
  state.isAuthenticated = true;
  state.error = null;

  localStorage.setItem("spark-token", state.token);
  localStorage.setItem("spark-user", JSON.stringify(state.user));
};

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: Boolean(storedToken),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("spark-token");
      localStorage.removeItem("spark-user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        persistAuth(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        persistAuth(state, action.payload);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        persistAuth(state, action.payload);
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("spark-user", JSON.stringify(state.user));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
