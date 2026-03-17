import { Bell, Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageTitles = {
  "/home": "For you",
  "/discover": "Discover",
  "/matches": "Matches",
  "/messages": "Messages",
  "/notifications": "Notifications",
  "/search": "Search",
  "/settings": "Settings",
  "/create": "Create",
};

const Navbar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Profile";

  return (
    <header className="glass-panel sticky top-0 z-20 flex items-center justify-between px-4 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">Spark</p>
        <h1 className="font-display text-2xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/search"
          className="spark-button-ghost p-3"
        >
          <Search size={18} />
        </Link>
        <Link
          to="/discover"
          className="spark-button-ghost p-3"
        >
          <Sparkles size={18} />
        </Link>
        <Link
          to="/notifications"
          className="spark-button-ghost p-3"
        >
          <Bell size={18} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
