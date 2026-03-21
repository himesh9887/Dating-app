import { MessageCircleHeart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const MatchCard = ({ match }) => (
  <div className="glass-panel flex h-full flex-col overflow-hidden">
    <div className="relative">
      <img
        src={getPrimaryPhoto(match.partner)}
        alt={match.partner.name}
        className="h-80 w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-spark-base via-black/24 to-transparent" />
      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-spark-mint backdrop-blur-xl">
        <Sparkles size={14} />
        It's a match
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-display text-[2.1rem] font-semibold leading-none text-white">
          {match.partner.name}, {match.partner.age}
        </h3>
        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/72">
          {match.partner.bio ||
            "Your chemistry is live. Send a thoughtful first message and keep it moving."}
        </p>
      </div>
    </div>

    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="spark-stat">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
            Last spark
          </p>
          <p className="mt-3 text-sm text-white/76">
            {formatTimeAgo(match.lastMessageAt || match.matchedAt)}
          </p>
        </div>
        <div className="spark-stat">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
            Best opener
          </p>
          <p className="mt-3 text-sm text-white/76">
            Ask about their vibe, city plans, or favorite late-night spot.
          </p>
        </div>
      </div>

      <Link
        to={`/messages/${match._id}`}
        className="spark-button w-full justify-center"
      >
        <MessageCircleHeart size={16} />
        Open chat
      </Link>
    </div>
  </div>
);

export default MatchCard;
