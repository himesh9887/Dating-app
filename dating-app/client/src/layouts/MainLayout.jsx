import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import { fetchSuggestions } from "../redux/slices/userSlice";
import { quickStats } from "../utils/constants";
import { classNames } from "../utils/helpers";

const MainLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const suggestions = useSelector((state) => state.user.suggestions);
  const isImmersiveMobilePage =
    location.pathname === "/home" ||
    location.pathname === "/discover" ||
    location.pathname === "/search" ||
    location.pathname.startsWith("/profile/");

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  return (
    <div
      className={classNames(
        "min-h-screen",
        isImmersiveMobilePage
          ? "bg-black px-0 py-0 lg:px-6 lg:py-4 xl:px-8"
          : "px-3 py-4 sm:px-5 lg:px-6 xl:px-8",
      )}
    >
      <div
        className={classNames(
          "mx-auto grid gap-4",
          isImmersiveMobilePage
            ? "max-w-none lg:max-w-[1680px] lg:grid-cols-[252px_minmax(0,1fr)] 2xl:grid-cols-[252px_minmax(0,1fr)_320px]"
            : "max-w-[1680px] lg:grid-cols-[252px_minmax(0,1fr)] 2xl:grid-cols-[252px_minmax(0,1fr)_320px]",
        )}
      >
        <Sidebar />
        <div
          className={classNames(
            "min-w-0",
            isImmersiveMobilePage ? "min-h-screen" : "min-h-[calc(100vh-2rem)]",
          )}
        >
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={classNames(
              isImmersiveMobilePage ? "pb-24 pt-0 lg:pb-8 lg:pt-4" : "pb-24 pt-4 lg:pb-8",
            )}
          >
            <Outlet />
          </motion.main>
        </div>
        <aside className="hidden 2xl:block">
          <div className="sticky top-4 space-y-4">
            <ProfileCard />
            <div className="grid gap-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="glass-panel p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="glass-panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">Suggested for you</h3>
                <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                  Nearby
                </span>
              </div>
              <div className="space-y-3">
                {suggestions.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;
