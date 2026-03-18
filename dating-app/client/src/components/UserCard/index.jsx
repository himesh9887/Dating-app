import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistance, getPrimaryPhoto } from "../../utils/helpers";

const UserCard = ({ user, compact = false }) => (
  <div className="glass-soft h-full p-3 sm:p-4">
    <div className="flex h-full items-start gap-3">
      <img
        src={getPrimaryPhoto(user)}
        alt={user.name}
        className={compact ? "h-12 w-12 rounded-2xl object-cover" : "h-16 w-16 rounded-3xl object-cover"}
      />
      <div className="min-w-0 flex-1">
        <Link
          to={`/profile/${user.username}`}
          className="truncate font-display text-base font-semibold"
        >
          {user.name}
        </Link>
        <p className="text-sm text-white/[0.55]">@{user.username}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-white/[0.45]">
          <MapPin size={12} />
          {formatDistance(user.distanceKm)}
        </p>
        {!compact ? (
          <p className="mt-2 line-clamp-2 text-sm text-white/[0.55]">
            {user.bio || "Fresh profile energy and ready to connect."}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        className="spark-button-ghost self-center rounded-2xl px-3 py-2"
      >
        <Heart size={15} />
      </button>
    </div>
  </div>
);

export default UserCard;
