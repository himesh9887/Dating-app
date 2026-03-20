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
      .addCase(fetchDiscover.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDiscover.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.discoverUsers = action.payload.users;
      })
      .addCase(fetchDiscover.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matches = action.payload.matches;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(swipeProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(swipeProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.discoverUsers = state.discoverUsers.filter(
          (user) => user._id !== action.payload.userId,
        );

        if (action.payload.matched) {
          state.latestMatch = action.payload.match;
          state.matches.unshift(action.payload.match);
        }
      })
      .addCase(swipeProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { dismissLatestMatch } = matchSlice.actions;
export default matchSlice.reducer;
