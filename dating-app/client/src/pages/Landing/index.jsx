import { motion } from "framer-motion";
import { ArrowRight, HeartHandshake, MessageCircleMore, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => (
  <div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
    <div className="absolute inset-0 bg-spark-gradient" />
    <div className="absolute left-[8%] top-16 h-72 w-72 rounded-full bg-spark-pink/20 blur-3xl" />
    <div className="absolute bottom-10 right-[8%] h-80 w-80 rounded-full bg-spark-blue/20 blur-3xl" />
    <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-between gap-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-3xl bg-spark-button px-4 py-3 font-display text-xl font-semibold shadow-glow">
            Spark
          </div>
          <span className="text-sm uppercase tracking-[0.3em] text-white/40">
            Social dating
          </span>
        </div>
        <div className="hidden gap-3 sm:flex">
          <Link to="/login" className="spark-button-ghost">Login</Link>
          <Link to="/signup" className="spark-button">Join now</Link>
        </div>
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/[0.65]">
            Instagram x Tinder energy
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl">
            Meet, match, and message through a bold social universe.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Spark brings nearby discovery, social stories, creator-style feeds, premium
            boosts, and live chat into one modern Gen-Z platform.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="spark-button">
              Create your profile
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/login" className="spark-button-ghost">
              I already have an account
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel relative overflow-hidden p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-soft p-4">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                alt="Feed preview"
                className="h-64 w-full rounded-[24px] object-cover"
              />
              <p className="mt-4 text-sm text-white/[0.65]">
                Swipe-worthy profiles, premium boosts, and matches with real momentum.
              </p>
            </div>
            <div className="space-y-4">
              {[
                ["Nearby Discovery", HeartHandshake, "See who fits your vibe nearby."],
                ["Stories + Feed", Sparkles, "Social-first energy with creator moments."],
                ["Real-Time Chat", MessageCircleMore, "Typing, reads, photos, and instant replies."],
              ].map(([title, Icon, description]) => (
                <div key={title} className="glass-soft p-5">
                  <div className="inline-flex rounded-2xl bg-white/10 p-3 text-spark-pink">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-white/60">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

export default LandingPage;
