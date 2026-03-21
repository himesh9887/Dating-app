import { Crown, LogOut, MapPin, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { navigationItems, quickStats } from "../../utils/constants";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";
import { demoUser } from "../../utils/mockData";

const itemDescriptions = {
  Home: "Your social feed",
  Discover: "High-intent discovery",
  Matches: "People who said yes",
  Messages: "Active conversations",
  Notifications: "Everything new",
  Search: "Profiles and creators",
  Create: "Share a new moment",
  Profile: "Your public identity",
  Settings: "Controls and privacy",
};

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user) || demoUser;
  const profilePath = authUser?.username ? `/profile/${authUser.username}` : "/settings";
  const resolvedNavigationItems = navigationItems.map((item) =>
    item.label === "Profile" ? { ...item, path: profilePath } : item,
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside className="hidden lg:block lg:w-[300px] xl:w-[330px]">
      <div className="sticky top-6 flex max-h-[calc(100vh-3rem)] flex-col gap-5">
        <div className="glass-panel relative overflow-hidden p-5 xl:p-6">
          <div className="absolute inset-0 spark-grid-bg opacity-[0.12]" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <Link
                to="/home"
                className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-spark-gradient text-lg font-display font-semibold text-spark-base shadow-glow">
                  S
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-white">Spark</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/38">
                    Premium social dating
                  </p>
                </div>
              </Link>

              <span className="spark-badge px-3 py-1 tracking-[0.18em] text-white/58">
                Live
              </span>
            </div>

            <div className="glass-soft mt-6 overflow-hidden p-4">
              <div className="flex items-start gap-3">
                <img
                  src={getPrimaryPhoto(authUser)}
                  alt={authUser?.name}
                  className="h-16 w-16 rounded-[24px] border border-white/10 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[1.05rem] font-semibold text-white">
                        {authUser?.name}
                      </p>
                      <p className="truncate text-sm text-white/50">@{authUser?.username}</p>
                    </div>
                    <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-spark-gold">
                      {authUser?.subscription?.plan || "free"}
                    </span>
                  </div>

                  <p className="mt-2 flex items-center gap-1.5 text-xs text-white/54">
                    <MapPin size={12} />
                    {authUser?.location?.label || authUser?.location || "Location hidden"}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/62">
                    {authUser?.bio || "Build chemistry through polished profiles, stories, and chat."}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {quickStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-3"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/34">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                  </div>
                ))}
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
                        "group flex items-center gap-3 rounded-[22px] border px-4 py-3.5 transition-all duration-300",
                        isActive
                          ? "border-white/14 bg-white/[0.09] shadow-lift"
                          : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.04]",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={classNames(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] transition-all duration-300",
                            isActive
                              ? "bg-spark-gradient text-spark-base shadow-glow"
                              : "bg-white/[0.05] text-white/70 group-hover:text-white",
                          )}
                        >
                          <Icon size={18} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-white">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-white/42">
                            {itemDescriptions[item.label]}
                          </span>
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="glass-soft p-4">
                <div className="flex items-center gap-2 text-spark-cyan">
                  <Sparkles size={16} />
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
                    Daily momentum
                  </p>
                </div>
                <p className="mt-3 text-lg font-semibold text-white">
                  Keep your profile active to surface higher in discover and matches.
                </p>
              </div>

              <div className="glass-soft p-4">
                <div className="flex items-center gap-2 text-spark-gold">
                  <Crown size={16} />
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
                    Gold mode
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  Better visibility, smarter filters, and quick access to who already likes you.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="spark-button-ghost mt-6 w-full justify-center"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
