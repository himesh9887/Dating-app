import { Bell, ChevronDown, Heart, Plus, Search, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { classNames } from "../../utils/helpers";
import { demoStories } from "../../utils/mockData";

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
  const isHomePage = location.pathname === "/home";
  const isDiscoverPage = location.pathname === "/discover";
  const isSearchPage = location.pathname === "/search";
  const isProfilePage = location.pathname.startsWith("/profile/");
  const hideMobileDefaultHeader = isHomePage || isDiscoverPage || isSearchPage || isProfilePage;
  const title = location.pathname.startsWith("/profile/")
    ? "Profile"
    : pageTitles[location.pathname] || "Spark";

  return (
    <>
      {isHomePage ? (
        <header className="sticky top-0 z-30 flex items-center justify-between bg-black px-4 pb-2.5 pt-2.5 lg:hidden">
          <Link
            to="/create"
            className="instagram-icon-button h-12 w-12"
            aria-label="Create post"
          >
            <Plus size={34} strokeWidth={1.7} />
          </Link>
          <Link
            to="/home"
            className="font-logo text-[3.2rem] leading-none text-white"
          >
            Instagram
          </Link>
          <Link
            to="/notifications"
            className="relative instagram-icon-button h-12 w-12"
            aria-label="Notifications"
          >
            <Heart size={30} strokeWidth={1.9} />
            <span className="absolute right-2 top-2.5 h-2.5 w-2.5 rounded-full bg-red-500" />
          </Link>
        </header>
      ) : null}

      {isDiscoverPage ? (
        <header className="sticky top-0 z-30 flex items-center justify-between bg-black/90 px-4 pb-3 pt-4 backdrop-blur-xl lg:hidden">
          <Link
            to="/create"
            className="instagram-icon-button"
            aria-label="Create post"
          >
            <Plus size={32} strokeWidth={1.8} />
          </Link>
          <div className="flex items-center gap-6">
            <button
              type="button"
              className={classNames(
                "flex items-center gap-1 text-2xl font-semibold",
                isHomePage ? "text-white" : "text-white/55",
              )}
            >
              <span>Reels</span>
              <ChevronDown size={20} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className={classNames(
                "text-2xl font-semibold",
                "text-white",
              )}
            >
              Friends
            </button>
          </div>
          <div className="flex items-center">
            {demoStories.slice(0, 3).map((story, index) => (
              <img
                key={story._id}
                src={story.author.profilePhotos?.[0]?.url}
                alt={story.author.username}
                className={classNames(
                  "h-8 w-8 rounded-full border-2 border-black object-cover",
                  index ? "-ml-2" : "",
                )}
              />
            ))}
          </div>
        </header>
      ) : null}

      <header
        className={classNames(
          "glass-panel sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5",
          hideMobileDefaultHeader ? "hidden lg:flex" : "",
        )}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Spark</p>
          <h1 className="font-display text-xl font-semibold sm:text-2xl">{title}</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
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
    </>
  );
};

export default Navbar;
