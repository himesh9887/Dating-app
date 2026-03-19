import {
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  Send,
} from "lucide-react";
import { useState } from "react";
import { getPrimaryPhoto } from "../../utils/helpers";
import { demoReels } from "../../utils/mockData";

const formatCount = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const Reels = () => {
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-auto bg-black text-white">
      {demoReels.map((reel) => {
        const isLiked = Boolean(liked[reel._id]);
        const isSaved = Boolean(saved[reel._id]);

        return (
          <section
            key={reel._id}
            className="relative h-screen snap-start overflow-hidden bg-black"
          >
            <img
              src={reel.media.url}
              alt={reel.caption}
              className="h-screen w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/80" />

            <div className="absolute bottom-24 right-3 flex flex-col gap-4 text-white">
              <button
                type="button"
                onClick={() => setLiked((current) => ({ ...current, [reel._id]: !current[reel._id] }))}
                className="flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Heart
                  size={28}
                  className={isLiked ? "fill-current text-[#ed4956]" : ""}
                />
                <span className="text-xs font-semibold">
                  {formatCount(reel.likes + (isLiked ? 1 : 0))}
                </span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <MessageCircle size={28} />
                <span className="text-xs font-semibold">{formatCount(reel.comments)}</span>
              </button>

              <button
                type="button"
                className="flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Send size={28} />
                <span className="text-xs font-semibold">{formatCount(reel.shares)}</span>
              </button>

              <button
                type="button"
                onClick={() => setSaved((current) => ({ ...current, [reel._id]: !current[reel._id] }))}
                className="flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Bookmark size={28} className={isSaved ? "fill-current" : ""} />
              </button>
            </div>

            <div className="absolute bottom-5 left-3 right-20 text-white">
              <div className="flex items-center gap-3">
                <img
                  src={getPrimaryPhoto(reel.author)}
                  alt={reel.author.username}
                  className="h-10 w-10 rounded-full border border-white/20 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{reel.author.username}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/80">
                    <Music2 size={13} />
                    <span className="truncate">{reel.audio}</span>
                  </p>
                </div>
              </div>
              <p className="mt-3 max-w-[18rem] text-sm text-white">
                {reel.caption}
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Reels;
