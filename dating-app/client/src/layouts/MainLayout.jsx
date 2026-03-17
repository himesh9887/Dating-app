import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import Sidebar from "../components/Sidebar";
import UserCard from "../components/UserCard";
import { fetchSuggestions } from "../redux/slices/userSlice";

const MainLayout = () => {
  const dispatch = useDispatch();
  const suggestions = useSelector((state) => state.user.suggestions);

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)_330px]">
        <Sidebar />
        <div className="min-h-[calc(100vh-2rem)]">
          <Navbar />
          <motion.main
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-24 pt-4 lg:pb-8"
          >
            <Outlet />
          </motion.main>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-4 space-y-4">
            <ProfileCard />
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
