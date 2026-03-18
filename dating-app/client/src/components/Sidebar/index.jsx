import { motion } from "framer-motion";
import { Clapperboard, LogOut, Search, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { navigationItems } from "../../utils/constants";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const profilePath = user?.username ? `/profile/${user.username}` : "/settings";
  const resolvedNavigationItems = navigationItems.map((item) =>
    item.label === "Profile" ? { ...item, path: profilePath } : item,
  );
  const mobileNavigation = [
    { label: "Home", path: "/home", icon: resolvedNavigationItems[0]?.icon },
    { label: "Discover", path: "/discover", icon: Clapperboard },
    { label: "Messages", path: "/messages", icon: Send },
    { label: "Search", path: "/search", icon: Search },
    { label: "Profile", path: profilePath, icon: null, isProfile: true },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <aside className="hidden lg:block">
        <div className="spark-scrollbar sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <img
                src={getPrimaryPhoto(user)}
                alt={user?.name}
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <div>
                <p className="font-display text-xl font-semibold">Spark</p>
                <p className="text-sm text-white/[0.55]">@{user?.username}</p>
              </div>
            </div>
            <nav className="mt-6 space-y-2">
              {resolvedNavigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-white/[0.12] text-white shadow-glow"
                          : "text-white/[0.65] hover:bg-white/[0.06] hover:text-white",
                      )
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed inset-x-0 bottom-0 z-30 bg-black px-5 pt-2 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
      >
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          {mobileNavigation.map((item) => {
            const isActive =
              item.isProfile && location.pathname.startsWith("/profile/")
                ? true
                : location.pathname === item.path;
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex h-12 w-12 items-center justify-center rounded-full text-white transition"
                aria-label={item.label}
              >
                {item.isProfile ? (
                  <div
                    className={classNames(
                      "relative rounded-full p-[2px] transition",
                      isActive
                        ? "bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_52%,#6228d7_100%)]"
                        : "bg-white/20",
                    )}
                  >
                    <img
                      src={getPrimaryPhoto(user)}
                      alt={user?.name || "Profile"}
                      className="h-8 w-8 rounded-full border-2 border-black object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-black bg-red-500" />
                  </div>
                ) : (
                  <Icon
                    size={isActive ? 28 : 26}
                    strokeWidth={isActive ? 2.2 : 2}
                    className={classNames(
                      isActive ? "fill-current text-white" : "text-white/75",
                      item.label === "Search" ? "fill-none" : "",
                    )}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;
