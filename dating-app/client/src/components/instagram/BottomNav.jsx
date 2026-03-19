import {
  Clapperboard,
  House,
  MessageCircle,
  Search,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";

const BottomNav = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const profilePath = user?.username ? `/profile/${user.username}` : "/settings";
  const items = [
    { key: "home", path: "/home", icon: House, label: "Home" },
    { key: "reels", path: "/discover", icon: Clapperboard, label: "Reels" },
    { key: "messages", path: "/messages", icon: MessageCircle, label: "Messages" },
    { key: "search", path: "/search", icon: Search, label: "Search" },
    { key: "profile", path: profilePath, label: "Profile", isProfile: true },
  ];

  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-[#262626] bg-black/95 px-2 py-1.5 backdrop-blur-xl"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)" }}
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const active = item.isProfile
            ? location.pathname.startsWith("/profile/")
            : item.path === "/messages"
              ? location.pathname.startsWith("/messages")
              : location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-300 active:scale-95"
              aria-label={item.label}
            >
              {item.isProfile ? (
                <div
                  className={classNames(
                    "rounded-full p-[2px] transition-all duration-300",
                    active
                      ? "bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_52%,#6228d7_100%)]"
                      : "bg-[#262626]",
                  )}
                >
                  <img
                    src={getPrimaryPhoto(user)}
                    alt={user?.name || "Profile"}
                    className="h-[26px] w-[26px] rounded-full border-2 border-black object-cover"
                  />
                </div>
              ) : (
                <Icon
                  size={active ? 24 : 22}
                  strokeWidth={active ? 2.4 : 2}
                  className={classNames(active ? "text-white" : "text-[#a8a8a8]")}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
