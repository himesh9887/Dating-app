import { MessageCircleHeart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const MatchCard = ({ match }) => (
  <div className="glass-panel flex h-full flex-col overflow-hidden">
    <div className="relative">
      <img
        src={getPrimaryPhoto(match.partner)}
        alt={match.partner.name}
        className="h-64 w-full object-cover sm:h-72"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-2 text-spark-mint">
          <Sparkles size={16} />
          <span className="text-xs uppercase tracking-[0.25em]">Its a match</span>
        </div>
        <h3 className="mt-2 font-display text-3xl font-semibold">
          {match.partner.name}, {match.partner.age}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">
          {match.partner.bio || "Your chemistry is live. Say hi first."}
        </p>
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-white/[0.45]">Last spark</p>
        <p className="mt-2 text-sm text-white/70">
          {formatTimeAgo(match.lastMessageAt || match.matchedAt)}
        </p>
      </div>
      <Link
        to="/messages"
        className="spark-button w-full sm:w-auto"
      >
        <MessageCircleHeart size={16} className="mr-2" />
        Chat now
      </Link>
    </div>
  </div>
);

export default MatchCard;
