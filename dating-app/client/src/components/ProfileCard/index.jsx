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
      <div className="relative overflow-hidden rounded-[28px]">
        <img
          src={getPrimaryPhoto(user)}
          alt={user.name}
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-spark-base via-black/20 to-transparent" />
        <div className="absolute left-4 top-4">
          <span className="spark-badge px-3 py-1 text-white/54">
            <Crown size={12} />
            {user.subscription?.plan || "free"}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-[2rem] font-semibold leading-none text-white">
            {user.name}, {user.age}
          </h3>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-white/70">
            <MapPin size={14} />
            {user.location?.label || "Location hidden"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/[0.65]">
        {user.bio || "Add a bio so people can catch your vibe faster."}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="spark-stat">
          <div className="flex items-center gap-2 text-white/50">
            <Sparkles size={16} className="text-spark-cyan" />
            Matches
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-white">
            {user.matches?.length || 0}
          </p>
        </div>
        <div className="spark-stat">
          <div className="flex items-center gap-2 text-white/50">
            <Crown size={16} className="text-spark-gold" />
            Plan
          </div>
          <p className="mt-3 font-display text-2xl font-semibold capitalize text-white">
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
