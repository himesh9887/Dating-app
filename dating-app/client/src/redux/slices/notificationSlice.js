import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationService from "../../services/notificationService";
import { normalizeError } from "../../utils/helpers";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.fetchNotifications();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load notifications"));
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to update notification"));
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllRead();
      return true;
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to update notifications"));
    }
  },
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.notifications;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const item = state.items.find((notification) => notification._id === action.payload);

        if (item) {
          item.isRead = true;
        }
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.items = state.items.map((notification) => ({
          ...notification,
          isRead: true,
        }));
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
