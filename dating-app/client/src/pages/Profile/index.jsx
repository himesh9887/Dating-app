import { Grid2X2, Heart, MapPin, Tag } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { fetchProfile } from "../../redux/slices/userSlice";
import { demoPosts } from "../../utils/mockData";
import { getPrimaryPhoto } from "../../utils/helpers";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const profile = useSelector((state) => state.user.profile);
  const user = profile || {};
  const posts = demoPosts.filter((post) => post.author.username === (username || "novalane"));

  useEffect(() => {
    dispatch(fetchProfile(username));
  }, [dispatch, username]);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-5">
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <img
            src={getPrimaryPhoto(user)}
            alt={user.name}
            className="h-[360px] w-full rounded-[32px] object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">@{user.username}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">
              {user.name}, {user.age}
            </h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
              <MapPin size={16} />
              {user.location?.label}
            </p>
            <p className="mt-5 max-w-2xl text-white/70">{user.bio}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Posts", posts.length],
                ["Followers", user.followers?.length || 0],
                ["Following", user.following?.length || 0],
                ["Matches", user.matches?.length || 0],
              ].map(([label, value]) => (
                <div key={label} className="glass-soft p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {(user.interests || []).map((interest) => (
                <span key={interest} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5">
        <SectionHeader title="Gallery" subtitle="Posts, tagged moments, and liked content." />
        <div className="mb-5 flex gap-2 text-sm text-white/60">
          <div className="spark-button-ghost">
            <Grid2X2 size={16} className="mr-2" />
            Posts
          </div>
          <div className="spark-button-ghost">
            <Tag size={16} className="mr-2" />
            Tagged
          </div>
          <div className="spark-button-ghost">
            <Heart size={16} className="mr-2" />
            Liked Posts
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <img
              key={post._id}
              src={post.media[0].url}
              alt={post.caption}
              className="h-72 w-full rounded-[28px] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
