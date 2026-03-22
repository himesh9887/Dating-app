import { Music2, PlayCircle, Sparkles, UsersRound } from "lucide-react";
import Reels from "../../components/instagram/Reels";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import { demoReels } from "../../utils/mockData";

const DiscoverPage = () => {
  const totalReach = demoReels.reduce((sum, reel) => sum + reel.likes + reel.comments, 0);

  return (
    <PageShell
      eyebrow="Discovery stream"
      title="Scroll a cleaner reel-style discover experience"
      subtitle="Short-form discovery now sits inside the same premium shell as the rest of the app, with better spacing, cleaner supporting panels, and a more stable mobile viewport."
      stats={[
        { label: "Live reels", value: demoReels.length, meta: "Now" },
        { label: "Creators", value: new Set(demoReels.map((reel) => reel.author._id)).size, meta: "Active" },
        { label: "Total reach", value: new Intl.NumberFormat("en-US", { notation: "compact" }).format(totalReach), meta: "Social" },
      ]}
      className="px-1 pb-4 pt-1 sm:px-0"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="glass-panel p-4 sm:p-5">
          <SectionHeader
            title="Discover reels"
            subtitle="Swipe through a more focused, edge-to-edge discovery feed without the rest of the layout feeling cramped or broken."
          />

          <Reels className="lg:h-[calc(100vh-22rem)]" />
        </section>

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <section className="glass-panel p-5">
            <div className="inline-flex rounded-2xl bg-spark-gradient p-3 text-spark-base shadow-glow">
              <PlayCircle size={18} />
            </div>
            <h2 className="mt-4 font-display text-[1.9rem] font-semibold text-white">
              Better discovery rhythm
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              The reel surface now sits inside a consistent page shell, so discovery feels like a
              real part of the product instead of a disconnected full-screen clone.
            </p>
            <div className="mt-5 grid gap-3">
              {[
                "More stable viewport height across mobile and desktop.",
                "Cleaner CTA stack and better spacing around reel actions.",
                "Supporting insights stay visible while you browse content.",
              ].map((item) => (
                <div
                  key={item}
                  className="glass-soft p-4 text-sm leading-6 text-white/62"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
              Trending audio
            </p>
            <div className="mt-4 grid gap-3">
              {demoReels.map((reel) => (
                <div
                  key={reel._id}
                  className="glass-soft p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-white/[0.06] text-spark-cyan">
                      <Music2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{reel.audio}</p>
                      <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-white/38">
                        {reel.author.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-5">
            <div className="flex items-center gap-2 text-spark-gold">
              <Sparkles size={16} />
              <UsersRound size={16} />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">
              Discovery notes
            </h3>
            <p className="mt-2 text-sm leading-7 text-white/60">
              Keep reels visually bold, captions short, and profile photos polished so people move
              from viewing to messaging faster.
            </p>
          </section>
        </aside>
      </div>
    </PageShell>
  );
};

export default DiscoverPage;
