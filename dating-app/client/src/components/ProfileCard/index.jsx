import { Crown, MapPin, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPrimaryPhoto } from "../../utils/helpers";

const ProfileCard = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return null;
  }

  return (
    <div className="glass-panel overflow-hidden p-5">
      <div className="relative">
        <img
          src={getPrimaryPhoto(user)}
          alt={user.name}
          className="h-56 w-full rounded-[24px] object-cover sm:h-64"
        />
        <div className="absolute inset-x-0 bottom-0 rounded-b-[24px] bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold">
                {user.name}, {user.age}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/70">
                <MapPin size={14} />
                {user.location?.label || "Location hidden"}
              </p>
            </div>
            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-spark-mint">
              {user.subscription?.plan || "free"}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-white/[0.65]">
        {user.bio || "Add a bio so people can catch your vibe faster."}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="glass-soft p-4">
          <div className="flex items-center gap-2 text-white/50">
            <Sparkles size={16} />
            Matches
          </div>
          <p className="mt-2 font-display text-2xl font-semibold">
            {user.matches?.length || 0}
          </p>
        </div>
        <div className="glass-soft p-4">
          <div className="flex items-center gap-2 text-white/50">
            <Crown size={16} />
            Premium
          </div>
          <p className="mt-2 font-display text-2xl font-semibold capitalize">
            {user.subscription?.plan || "free"}
          </p>
        </div>
      </div>
      <Link
        to={user?.username ? `/profile/${user.username}` : "/settings"}
        className="spark-button mt-4 w-full"
      >
        View profile
      </Link>
    </div>
  );
};

export default ProfileCard;
