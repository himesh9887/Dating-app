import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { navigationItems } from "../../utils/constants";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-4">
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
              {navigationItems.map((item) => {
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
        className="glass-panel fixed inset-x-3 bottom-3 z-30 flex items-center justify-between px-2 py-2 lg:hidden"
      >
        {navigationItems.slice(0, 5).map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                classNames(
                  "flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition",
                  isActive ? "bg-white/[0.12] text-white" : "text-white/[0.55]",
                )
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </motion.nav>
    </>
  );
};

export default Sidebar;
