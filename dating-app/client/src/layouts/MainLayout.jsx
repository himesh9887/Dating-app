import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/instagram/BottomNav";
import Navbar from "../components/instagram/Navbar";
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div
        className={classNames(
          "mx-auto min-h-screen w-full bg-black",
          isMessagesPage || isWideShell
            ? "max-w-[1320px]"
            : "max-w-md lg:border-x lg:border-[#262626]",
        )}
      >
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={hideGlobalNavbar ? "pb-20" : "pb-20 pt-[60px]"}
        >
          <Outlet />
        </motion.main>
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
