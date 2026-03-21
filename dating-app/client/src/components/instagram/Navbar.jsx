import { Bell, MessageCircle, Plus, Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { classNames } from "../../utils/helpers";

const pageMeta = {
  "/home": {
    eyebrow: "Social feed",
    title: "Curated for you",
    subtitle: "Stories, fresh posts, and nearby chemistry moving in real time.",
  },
  "/matches": {
    eyebrow: "Connections",
    title: "Your matches",
    subtitle: "Every spark that already moved beyond a swipe.",
  },
  "/notifications": {
    eyebrow: "Activity",
    title: "Notifications",
    subtitle: "New followers, messages, likes, and momentum across your profile.",
  },
  "/settings": {
    eyebrow: "Workspace",
    title: "Profile settings",
    subtitle: "Polish the details people notice first.",
  },
  "/create": {
    eyebrow: "Creator mode",
    title: "Create a post",
    subtitle: "Build a polished moment before you share it.",
  },
};

const hiddenRoutes = ["/discover", "/search"];

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isHome = pathname === "/home";
  const isMessages = pathname.startsWith("/messages");
  const isProfile = pathname.startsWith("/profile/");
  const isHidden = hiddenRoutes.includes(pathname) || isMessages || isProfile;
  const meta = pageMeta[pathname] || pageMeta["/home"];

  if (isHidden) {
    return null;
  }

  return (
    <>
      <header className="glass-panel flex items-center justify-between gap-3 px-4 py-4 lg:hidden">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/38">
            {isHome ? "Spark" : meta.eyebrow}
          </p>
          <h1 className="truncate font-display text-[1.4rem] font-semibold text-white">
            {isHome ? "For you" : meta.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            className="spark-button-ghost h-11 w-11 p-0"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>
          <Link
            to="/create"
            className="spark-button-ghost h-11 w-11 p-0"
            aria-label="Create post"
          >
            <Plus size={18} />
          </Link>
          <Link
            to={isHome ? "/messages" : "/notifications"}
            className="spark-button h-11 w-11 p-0"
            aria-label={isHome ? "Messages" : "Notifications"}
          >
            {isHome ? <MessageCircle size={18} /> : <Bell size={18} />}
          </Link>
        </div>
      </header>

      <header className="glass-panel hidden items-center justify-between gap-6 px-6 py-5 lg:flex">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40">
            {meta.eyebrow}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-[2rem] font-semibold leading-none text-white">
              {meta.title}
            </h1>
            <span className="spark-badge px-3 py-1 tracking-[0.18em] text-white/58">
              <Sparkles size={12} />
              Live
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/58">{meta.subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/search"
            className="spark-button-ghost"
          >
            <Search size={16} />
            Search
          </Link>
          <Link
            to="/create"
            className={classNames(
              "spark-button-ghost",
              pathname === "/create" ? "border-white/20 bg-white/[0.08]" : "",
            )}
          >
            <Plus size={16} />
            Create
          </Link>
          <Link
            to={isHome ? "/messages" : "/notifications"}
            className="spark-button"
          >
            {isHome ? <MessageCircle size={16} /> : <Bell size={16} />}
            {isHome ? "Messages" : "Activity"}
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
