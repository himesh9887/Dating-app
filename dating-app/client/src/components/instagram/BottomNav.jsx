import { Clapperboard, House, MessageCircle, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";

const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const user = useSelector((state) => state.auth.user);
  const profilePath = user?.username ? `/profile/${user.username}` : "/settings";
  const items = [
    { key: "home", path: "/home", icon: House, label: "Home" },
    { key: "discover", path: "/discover", icon: Clapperboard, label: "Discover" },
    { key: "messages", path: "/messages", icon: MessageCircle, label: "Chats" },
    { key: "search", path: "/search", icon: Search, label: "Search" },
    { key: "profile", path: profilePath, label: "Profile", isProfile: true },
  ];

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pt-2 lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-[460px] rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,20,30,0.96),rgba(8,16,24,0.98))] p-2 shadow-panel backdrop-blur-2xl">
        <div className="grid grid-cols-5 gap-1.5">
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
                  "relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-[22px] px-1.5 py-2.5 text-center transition-all duration-300 active:scale-[0.98]",
                  active
                    ? "bg-white/[0.09] text-white shadow-lift"
                    : "text-white/52 hover:bg-white/[0.04] hover:text-white/78",
                )}
                aria-label={item.label}
              >
                {item.isProfile ? (
                  <div
                    className={classNames(
                      "rounded-full p-[2px] transition-all duration-300",
                      active ? "bg-spark-gradient shadow-glow" : "bg-white/16",
                    )}
                  >
                    <img
                      src={getPrimaryPhoto(user)}
                      alt={user?.name || "Profile"}
                      className="h-[28px] w-[28px] rounded-full border-2 border-spark-base object-cover"
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
                      size={active ? 21 : 19}
                      strokeWidth={active ? 2.3 : 2}
                    />
                  </span>
                )}

                <span
                  className={classNames(
                    "max-w-full truncate text-[10px] font-medium leading-none",
                    active ? "text-white" : "text-white/44",
                  )}
                >
                  {item.label}
                </span>

                {active ? (
                  <span className="absolute left-1/2 top-1.5 h-1 w-7 -translate-x-1/2 rounded-full bg-spark-cyan" />
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
