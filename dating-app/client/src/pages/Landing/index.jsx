import { motion } from "framer-motion";
import {
  ArrowRight,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
  {
    title: "Professional discover flow",
    description: "Filters, profile polish, and richer cards help every swipe feel intentional.",
    icon: Sparkles,
  },
  {
    title: "Feed plus social energy",
    description: "Stories, posts, and creator-style moments keep the app active between matches.",
    icon: UsersRound,
  },
  {
    title: "Safe by design",
    description: "Privacy settings, clean visibility controls, and calmer account management.",
    icon: ShieldCheck,
  },
];

const LandingPage = () => (
  <div className="relative min-h-screen overflow-hidden bg-spark-hero px-4 py-5 sm:px-6 lg:px-10">
    <div className="absolute left-[4%] top-16 h-72 w-72 rounded-full bg-spark-gold/18 blur-3xl" />
    <div className="absolute bottom-10 right-[6%] h-80 w-80 rounded-full bg-spark-cyan/16 blur-3xl" />

    <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col gap-8">
      <header className="glass-panel flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-spark-gradient text-lg font-display font-semibold text-spark-base shadow-glow">
            S
          </div>
          <div>
            <p className="font-display text-3xl leading-none text-white">Spark</p>
            <p className="text-xs uppercase tracking-[0.3em] text-white/38">
              Premium social dating
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="spark-button-ghost"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="spark-button"
          >
            Join now
          </Link>
        </div>
      </header>

      <div className="grid flex-1 items-center gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel relative overflow-hidden p-6 sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 spark-grid-bg opacity-[0.14]" />

          <div className="relative">
            <span className="spark-badge">Designed for a modern dating product</span>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
              Meet, match, and message inside a UI that finally feels launch-ready.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/64">
              Spark combines social feed energy, thoughtful profile design, and real-time chat in
              one polished experience built to feel premium on both mobile and desktop.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="spark-button"
              >
                Create your profile
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="spark-button-ghost"
              >
                I already have an account
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["4.9/5", "Average design feedback"],
                ["12k+", "Weekly social interactions"],
                ["<2 sec", "Fast path into discovery"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="spark-stat"
                >
                  <p className="font-display text-3xl font-semibold text-white">{value}</p>
                  <p className="mt-2 text-sm text-white/52">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid gap-5"
        >
          <div className="glass-panel overflow-hidden p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-4">
                {featureCards.map(({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="glass-soft p-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/[0.06] text-spark-cyan">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-white">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">{description}</p>
                  </div>
                ))}
              </div>

              <div className="glass-soft overflow-hidden p-4">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,16,24,0.86),rgba(18,36,51,0.76))] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                        Product preview
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-semibold text-white">
                        Social profile card
                      </h3>
                    </div>
                    <span className="spark-badge px-3 py-1 tracking-[0.18em] text-white/54">
                      Live UI
                    </span>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[26px]">
                    <img
                      src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
                      alt="Spark preview"
                      className="h-[360px] w-full object-cover"
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
                        Discover
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/64">
                        Match cards with cleaner hierarchy, location, intent, and profile energy.
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
                        Chat
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/64">
                        Better message spacing, faster reading, and a more premium reply composer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel flex flex-col items-center justify-between gap-4 p-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/36">
                Ready to enter
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-white">
                Start the full product flow.
              </h2>
            </div>
            <Link
              to="/signup"
              className="spark-button"
            >
              <MessageCircleHeart size={18} />
              Join Spark
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  </div>
);

export default LandingPage;
