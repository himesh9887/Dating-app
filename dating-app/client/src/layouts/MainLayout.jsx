import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/instagram/BottomNav";
import Navbar from "../components/instagram/Navbar";

const MainLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const hideGlobalNavbar =
    pathname === "/discover" ||
    pathname === "/search" ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/profile/");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto min-h-screen w-full max-w-md bg-black lg:border-x lg:border-[#262626]">
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
