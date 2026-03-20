import { MessageCircleHeart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const MatchCard = ({ match }) => (
  <div className="glass-panel flex h-full flex-col overflow-hidden rounded-[30px] border-white/10 bg-[linear-gradient(180deg,rgba(16,20,28,0.98),rgba(10,12,18,0.98))]">
    <div className="relative">
      <img
        src={getPrimaryPhoto(match.partner)}
        alt={match.partner.name}
        className="h-72 w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#aff1d3] backdrop-blur-xl">
        <Sparkles size={14} />
        It's a match
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-[1.95rem] font-semibold leading-none text-white">
          {match.partner.name}, {match.partner.age}
        </h3>
        <p className="mt-3 line-clamp-2 max-w-md text-sm leading-6 text-white/72">
          {match.partner.bio || "Your chemistry is live. Send a thoughtful first message and keep it moving."}
        </p>
      </div>
    </div>

    <div className="flex flex-1 flex-col gap-4 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
            Last spark
          </p>
          <p className="mt-2 text-sm text-white/76">
            {formatTimeAgo(match.lastMessageAt || match.matchedAt)}
          </p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
            Best opener
          </p>
          <p className="mt-2 text-sm text-white/76">
            Ask about their vibe, city plans, or favorite late-night spot.
          </p>
        </div>
      </div>

      <Link
        to={`/messages/${match._id}`}
        className="spark-button w-full justify-center"
      >
        <MessageCircleHeart
          size={16}
          className="mr-2"
        />
        Open chat
      </Link>
    </div>
  </div>
);

export default MatchCard;
