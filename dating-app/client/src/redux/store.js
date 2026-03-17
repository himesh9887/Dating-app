import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import matchReducer from "./slices/matchSlice";
import notificationReducer from "./slices/notificationSlice";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    matches: matchReducer,
    chat: chatReducer,
    user: userReducer,
    notifications: notificationReducer,
  },
});

export default store;
