import { Bookmark, Heart, MessageCircle, Music2, PlayCircle, Send } from "lucide-react";
import { useState } from "react";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";
import { demoReels } from "../../utils/mockData";

const formatCount = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const Reels = ({ className }) => {
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});

  return (
    <div
      className={classNames(
        "spark-scrollbar min-h-[680px] overflow-y-auto rounded-[34px] border border-white/10 bg-spark-base text-white shadow-panel lg:h-[calc(100vh-14rem)] lg:snap-y lg:snap-mandatory",
        className,
      )}
    >
      {demoReels.map((reel, index) => {
        const isLiked = Boolean(liked[reel._id]);
        const isSaved = Boolean(saved[reel._id]);

        return (
          <section
            key={reel._id}
            className="relative flex min-h-[680px] items-end overflow-hidden px-4 py-20 sm:px-6 lg:min-h-full lg:px-8"
          >
            <img
              src={reel.media.url}
              alt={reel.caption}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,26,0.24),rgba(6,17,26,0.42),rgba(6,17,26,0.92))]" />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pb-4 pt-5 sm:px-6 lg:px-8">
              <span className="spark-badge bg-black/20 backdrop-blur-xl">
                <PlayCircle size={12} />
                Discover reel {index + 1}
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/66 backdrop-blur-xl">
                {formatCount(reel.remixes || reel.comments)} interactions
              </span>
            </div>

            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="glass-panel max-w-xl p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <img
                    src={getPrimaryPhoto(reel.author)}
                    alt={reel.author.username}
                    className="h-12 w-12 rounded-full border border-white/20 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {reel.author.username}
                    </p>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.22em] text-white/40">
                      @{reel.author.name?.replace(/\s+/g, "").toLowerCase() || "creator"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[15px] leading-7 text-white/82">{reel.caption}</p>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/72">
                  <Music2
                    size={15}
                    className="text-spark-cyan"
                  />
                  <span className="truncate">{reel.audio}</span>
                </div>
              </div>

              <div className="glass-panel flex w-full flex-row justify-between gap-2 p-3 sm:max-w-[420px] lg:max-w-[92px] lg:flex-col">
                {[
                  {
                    key: "likes",
                    icon: Heart,
                    count: formatCount(reel.likes + (isLiked ? 1 : 0)),
                    active: isLiked,
                    onClick: () =>
                      setLiked((current) => ({ ...current, [reel._id]: !current[reel._id] })),
                  },
                  {
                    key: "comments",
                    icon: MessageCircle,
                    count: formatCount(reel.comments),
                  },
                  {
                    key: "shares",
                    icon: Send,
                    count: formatCount(reel.shares),
                  },
                  {
                    key: "save",
                    icon: Bookmark,
                    count: isSaved ? "Saved" : "Save",
                    active: isSaved,
                    onClick: () =>
                      setSaved((current) => ({ ...current, [reel._id]: !current[reel._id] })),
                  },
                ].map(({ key, icon: Icon, count, active, onClick }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={onClick}
                    className="flex flex-1 flex-col items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.04] px-3 py-3 transition hover:bg-white/[0.08]"
                  >
                    <Icon
                      size={18}
                      className={active ? "fill-current text-[#ff7a6c]" : ""}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/66">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Reels;
