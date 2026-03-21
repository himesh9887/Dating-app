import { motion } from "framer-motion";
import { MessageCircleHeart, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Outlet } from "react-router-dom";

const authHighlights = [
  {
    title: "Intentional discovery",
    description: "Profiles, filters, and matches that feel more curated than chaotic.",
    icon: Sparkles,
  },
  {
    title: "Built for conversation",
    description: "Real-time messaging and thoughtful prompts keep first replies easy.",
    icon: MessageCircleHeart,
  },
  {
    title: "Privacy by default",
    description: "Visibility controls and account settings stay close to the profile owner.",
    icon: ShieldCheck,
  },
];

const AuthLayout = () => (
  <div className="relative min-h-screen overflow-hidden bg-spark-hero px-4 py-5 sm:px-6 lg:px-10">
    <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-spark-gold/18 blur-3xl" />
    <div className="absolute bottom-10 right-[-5%] h-80 w-80 rounded-full bg-spark-cyan/18 blur-3xl" />

    <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative hidden overflow-hidden p-6 md:flex md:flex-col md:justify-between lg:p-10"
      >
        <div className="absolute inset-0 spark-grid-bg opacity-[0.14]" />

        <div className="relative">
          <span className="spark-badge">Spark access</span>
          <h1 className="mt-8 max-w-2xl font-display text-5xl font-semibold leading-tight text-white">
            A dating product that feels polished from the first screen to the first message.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/66">
            Discover nearby people, share moments, manage your profile, and move into chat
            without the UI ever feeling messy or unfinished.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["12k+", "Weekly connections"],
              ["4.9/5", "Average session rating"],
              ["24/7", "Live social energy"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="glass-soft p-4"
              >
                <p className="font-display text-3xl font-semibold text-white">{value}</p>
                <p className="mt-2 text-sm text-white/56">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-soft overflow-hidden p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-spark-gradient text-spark-base">
                <UsersRound size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Trusted profile surface</p>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Professional by design
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {authHighlights.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-white/[0.06] text-spark-cyan">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-white/50">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-soft flex flex-col justify-between p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">
                Session flow
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">
                Fast to enter, easy to trust.
              </h2>
            </div>
            <div className="mt-6 space-y-3">
              {["Create profile", "Upload photos", "Start discovering", "Move into chat"].map(
                (step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-spark-gradient text-xs font-bold text-spark-base">
                      0{index + 1}
                    </span>
                    <p className="text-sm text-white/72">{step}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="glass-panel flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <Outlet />
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
