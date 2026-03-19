import { Heart, MessageCircle, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageTitles = {
  "/notifications": "Activity",
  "/matches": "Matches",
  "/create": "Create",
  "/settings": "Settings",
};

const hiddenRoutes = [
  "/discover",
  "/search",
];

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isHome = pathname === "/home";
  const isHidden =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/profile/");

  if (isHidden) {
    return null;
  }

  if (isHome) {
    return (
      <header className="fixed left-1/2 top-0 z-40 flex h-[60px] w-full max-w-md -translate-x-1/2 items-center justify-between border-b border-[#262626] bg-black/95 px-4 backdrop-blur-xl">
        <Link
          to="/create"
          className="instagram-icon-button"
          aria-label="Create post"
        >
          <Plus size={26} strokeWidth={2.1} />
        </Link>

        <Link
          to="/home"
          className="text-[1.55rem] font-semibold tracking-[-0.03em] text-white"
        >
          Instagram
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/notifications"
            className="instagram-icon-button"
            aria-label="Activity"
          >
            <Heart size={24} strokeWidth={2} />
          </Link>
          <Link
            to="/messages"
            className="instagram-icon-button"
            aria-label="Messages"
          >
            <MessageCircle size={24} strokeWidth={2} />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed left-1/2 top-0 z-40 flex h-[60px] w-full max-w-md -translate-x-1/2 items-center justify-between border-b border-[#262626] bg-black/95 px-4 backdrop-blur-xl">
      <h1 className="text-[1.05rem] font-semibold text-white">
        {pageTitles[pathname] || "Instagram"}
      </h1>
      <div className="flex items-center gap-1">
        <Link
          to="/notifications"
          className="instagram-icon-button"
          aria-label="Activity"
        >
          <Heart size={22} strokeWidth={2} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
