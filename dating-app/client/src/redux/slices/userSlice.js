import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { normalizeError } from "../../utils/helpers";

export const fetchSuggestions = createAsyncThunk(
  "user/fetchSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.fetchSuggestions();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load suggestions"));
    }
  },
);

export const searchUsers = createAsyncThunk(
  "user/searchUsers",
  async (params, { rejectWithValue }) => {
    try {
      return await userService.searchUsers(params);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to search users"));
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      return await userService.fetchProfile(username);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load profile"));
    }
  },
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      return await userService.updateProfile(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to update profile"));
    }
  },
);

export const activateBoost = createAsyncThunk(
  "user/activateBoost",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.activateBoost();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to activate boost"));
    }
  },
);

export const fetchLikedYou = createAsyncThunk(
  "user/fetchLikedYou",
  async (_, { rejectWithValue }) => {
    try {
      return await userService.fetchLikedYou();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load likes"));
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    suggestions: [],
    searchResults: [],
    profile: null,
    likedYou: [],
    boostUntil: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload.suggestions;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload.users;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload.profile;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload.user;
      })
      .addCase(activateBoost.fulfilled, (state, action) => {
        state.boostUntil = action.payload.boostedUntil;
      })
      .addCase(fetchLikedYou.fulfilled, (state, action) => {
        state.likedYou = action.payload.likedYou;
      });
  },
});

export default userSlice.reducer;
