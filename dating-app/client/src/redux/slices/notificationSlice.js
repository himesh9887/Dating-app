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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.notifications;
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
      });
  },
});

export default notificationSlice.reducer;
