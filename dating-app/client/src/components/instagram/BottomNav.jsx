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
  const pathname = location.pathname;
  const isMessagesPage = location.pathname.startsWith("/messages");
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
      className={classNames(
        "pointer-events-none fixed bottom-0 left-1/2 z-40 w-full -translate-x-1/2 px-3 pt-2 sm:px-4",
        isMessagesPage ? "max-w-[1320px]" : "max-w-md",
      )}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-[390px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,31,0.94),rgba(6,9,15,0.98))] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = item.isProfile
            ? pathname.startsWith("/profile/") || pathname === "/settings"
            : item.path === "/messages"
              ? pathname.startsWith("/messages")
              : pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              className={classNames(
                "group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] px-1.5 py-2.5 text-center transition-all duration-300 active:scale-95",
                active
                  ? "bg-[linear-gradient(180deg,rgba(55,151,240,0.2),rgba(255,255,255,0.05))] text-white shadow-[0_10px_26px_rgba(12,21,35,0.34)]"
                  : "text-white/52 hover:bg-white/[0.05] hover:text-white/78",
              )}
              aria-label={item.label}
            >
              {item.isProfile ? (
                <div
                  className={classNames(
                    "rounded-full p-[2px] transition-all duration-300",
                    active
                      ? "bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_52%,#6228d7_100%)] shadow-[0_8px_20px_rgba(98,40,215,0.28)]"
                      : "bg-white/12 group-hover:bg-white/22",
                  )}
                >
                  <img
                    src={getPrimaryPhoto(user)}
                    alt={user?.name || "Profile"}
                    className="h-[28px] w-[28px] rounded-full border-2 border-[#090c12] object-cover"
                  />
                </div>
              ) : (
                <span
                  className={classNames(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                    active ? "bg-white/[0.06]" : "bg-transparent",
                  )}
                >
                  <Icon
                    size={active ? 22 : 20}
                    strokeWidth={active ? 2.35 : 2}
                    className={classNames(active ? "text-white" : "text-white/64")}
                  />
                </span>
              )}

              <span
                className={classNames(
                  "max-w-full truncate text-[10px] font-medium leading-none",
                  active ? "text-white" : "text-white/46",
                )}
              >
                {item.label}
              </span>

              {active ? (
                <span className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full bg-[#8ed2ff]" />
              ) : null}
            </NavLink>
          );
        })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
