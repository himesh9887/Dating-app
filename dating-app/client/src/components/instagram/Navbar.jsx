import { Heart, MessageCircle, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { classNames } from "../../utils/helpers";

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
  const isWideShell =
    pathname === "/matches" ||
    pathname === "/notifications" ||
    pathname === "/settings" ||
    pathname === "/create";
  const isHidden =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/profile/");
  const shellWidthClass = isWideShell ? "max-w-[1320px]" : "max-w-md";
  const contentWidthClass = isWideShell ? "mx-auto flex h-[60px] w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" : "flex h-[60px] items-center justify-between px-4";

  if (isHidden) {
    return null;
  }

  if (isHome) {
    return (
      <header
        className={classNames(
          "fixed left-1/2 top-0 z-40 w-full -translate-x-1/2 border-b border-[#262626] bg-black/95 backdrop-blur-xl",
          shellWidthClass,
        )}
      >
        <div className={contentWidthClass}>
          <Link
            to="/create"
            className="instagram-icon-button h-9 w-9"
            aria-label="Create post"
          >
            <Plus size={25} strokeWidth={2.1} />
          </Link>

          <Link
            to="/home"
            className="font-logo text-[2.45rem] leading-none text-white"
          >
            Instagram
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to="/notifications"
              className="instagram-icon-button h-9 w-9"
              aria-label="Activity"
            >
              <Heart size={23} strokeWidth={2} />
            </Link>
            <Link
              to="/messages"
              className="instagram-icon-button h-9 w-9"
              aria-label="Messages"
            >
              <MessageCircle size={23} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={classNames(
        "fixed left-1/2 top-0 z-40 w-full -translate-x-1/2 border-b border-[#262626] bg-black/95 backdrop-blur-xl",
        shellWidthClass,
      )}
    >
      <div className={contentWidthClass}>
        <h1 className="text-[1rem] font-semibold text-white">
          {pageTitles[pathname] || "Instagram"}
        </h1>
        <div className="flex items-center gap-1">
          <Link
            to="/notifications"
            className="instagram-icon-button h-9 w-9"
            aria-label="Activity"
          >
            <Heart size={21} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
