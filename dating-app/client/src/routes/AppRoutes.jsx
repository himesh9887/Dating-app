import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CreatePostPage from "../pages/CreatePost";
import DiscoverPage from "../pages/Discover";
import HomePage from "../pages/Home";
import LandingPage from "../pages/Landing";
import LoginPage from "../pages/Login";
import MatchesPage from "../pages/Matches";
import MessagesPage from "../pages/Messages";
import NotificationsPage from "../pages/Notifications";
import ProfilePage from "../pages/Profile";
import SearchPage from "../pages/Search";
import SettingsPage from "../pages/Settings";
import SignupPage from "../pages/Signup";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes
        key={location.pathname}
        location={location}
      >
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/signup"
            element={<SignupPage />}
          />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/home"
              element={<HomePage />}
            />
            <Route
              path="/discover"
              element={<DiscoverPage />}
            />
            <Route
              path="/matches"
              element={<MatchesPage />}
            />
            <Route
              path="/messages"
              element={<MessagesPage />}
            />
            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />
            <Route
              path="/search"
              element={<SearchPage />}
            />
            <Route
              path="/profile/:username"
              element={<ProfilePage />}
            />
            <Route
              path="/settings"
              element={<SettingsPage />}
            />
            <Route
              path="/create"
              element={<CreatePostPage />}
            />
          </Route>
        </Route>
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
