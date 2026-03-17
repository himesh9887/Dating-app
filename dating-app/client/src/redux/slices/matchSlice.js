import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import matchService from "../../services/matchService";
import { normalizeError } from "../../utils/helpers";

export const fetchDiscover = createAsyncThunk(
  "matches/fetchDiscover",
  async (_, { rejectWithValue }) => {
    try {
      return await matchService.fetchDiscover();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load discover"));
    }
  },
);

export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      return await matchService.fetchMatches();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load matches"));
    }
  },
);

export const swipeProfile = createAsyncThunk(
  "matches/swipeProfile",
  async ({ userId, action }, { rejectWithValue }) => {
    try {
      const result = await matchService.swipeUser(userId, action);
      return { userId, action, ...result };
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to save swipe"));
    }
  },
);

const matchSlice = createSlice({
  name: "matches",
  initialState: {
    discoverUsers: [],
    matches: [],
    latestMatch: null,
    status: "idle",
    error: null,
  },
  reducers: {
    dismissLatestMatch(state) {
      state.latestMatch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscover.fulfilled, (state, action) => {
        state.discoverUsers = action.payload.users;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.matches = action.payload.matches;
      })
      .addCase(swipeProfile.fulfilled, (state, action) => {
        state.discoverUsers = state.discoverUsers.filter(
          (user) => user._id !== action.payload.userId,
        );

        if (action.payload.matched) {
          state.latestMatch = action.payload.match;
          state.matches.unshift(action.payload.match);
        }
      });
  },
});

export const { dismissLatestMatch } = matchSlice.actions;
export default matchSlice.reducer;
