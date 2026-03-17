import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const AuthLayout = () => (
  <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
    <div className="absolute inset-0 bg-spark-gradient" />
    <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-spark-pink/20 blur-3xl" />
    <div className="absolute bottom-10 right-[-5%] h-80 w-80 rounded-full bg-spark-blue/20 blur-3xl" />
    <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel hidden p-10 lg:flex lg:flex-col lg:justify-between"
      >
        <div>
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Spark
          </span>
          <h1 className="mt-8 max-w-xl font-display text-5xl font-semibold leading-tight">
            Social energy, dating chemistry, and real-time connection in one vibe.
          </h1>
          <p className="mt-5 max-w-lg text-base text-white/70">
            Stories, swipes, follows, premium boosts, and chats designed for a bold
            Gen-Z style experience.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Nearby Discover", "Smart distance filters and premium visibility."],
            ["Live Chat", "Typing states, read receipts, and image sharing."],
            ["Creator Feed", "Stories and posts with endless scrolling moments."],
          ].map(([title, description]) => (
            <div
              key={title}
              className="glass-soft p-5"
            >
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <div className="glass-panel flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
