import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistance, getPrimaryPhoto } from "../../utils/helpers";

const UserCard = ({ user, compact = false }) => (
  <div className="glass-soft h-full rounded-[28px] p-4">
    <div className="flex h-full items-start gap-3">
      <img
        src={getPrimaryPhoto(user)}
        alt={user.name}
        className={
          compact
            ? "h-12 w-12 rounded-[18px] border border-white/10 object-cover"
            : "h-16 w-16 rounded-[22px] border border-white/10 object-cover"
        }
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/profile/${user.username}`}
              className="truncate text-[1rem] font-semibold text-white"
            >
              {user.name}
            </Link>
            <p className="mt-1 text-sm text-white/[0.52]">@{user.username}</p>
          </div>
          <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
            New
          </span>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/[0.48]">
          <MapPin size={12} />
          {formatDistance(user.distanceKm)}
        </p>

        {!compact ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/[0.6]">
            {user.bio || "Fresh profile energy and ready to connect."}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className="spark-button-ghost self-center rounded-[18px] px-3 py-2"
      >
        <Heart size={15} />
      </button>
    </div>
  </div>
);

export default UserCard;
