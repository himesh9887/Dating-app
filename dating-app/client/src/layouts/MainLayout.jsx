import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/instagram/BottomNav";
import Navbar from "../components/instagram/Navbar";
import Sidebar from "../components/Sidebar";
import { classNames } from "../utils/helpers";

const MainLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isMessagesPage = pathname.startsWith("/messages");
  const isWideShell =
    pathname === "/matches" ||
    pathname === "/notifications" ||
    pathname === "/settings" ||
    pathname === "/create";
  const hideGlobalNavbar =
    pathname === "/discover" ||
    pathname === "/search" ||
    isMessagesPage ||
    pathname.startsWith("/profile/");
  const contentWidthClass = isMessagesPage
    ? "max-w-full"
    : pathname === "/home"
      ? "max-w-[1240px]"
      : pathname === "/discover" || pathname === "/search" || pathname.startsWith("/profile/")
        ? "max-w-[1320px]"
        : isWideShell
          ? "max-w-[1280px]"
          : "max-w-5xl";

  return (
    <div className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-6%] top-10 h-64 w-64 rounded-full bg-spark-gold/14 blur-3xl" />
        <div className="absolute right-[-8%] top-[18%] h-72 w-72 rounded-full bg-spark-cyan/14 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[24%] h-80 w-80 rounded-full bg-spark-coral/12 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1520px] gap-6 px-3 pb-28 pt-3 sm:px-4 lg:px-6 lg:pb-6 lg:pt-6">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          {hideGlobalNavbar ? null : <Navbar />}

          <motion.main
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className={classNames("min-w-0 flex-1", hideGlobalNavbar ? "" : "lg:pt-0")}
          >
            <div className={classNames("mx-auto w-full", contentWidthClass)}>
              <Outlet />
            </div>
          </motion.main>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default MainLayout;
