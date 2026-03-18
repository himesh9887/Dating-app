import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MatchCard from "../../components/MatchCard";
import SectionHeader from "../../components/common/SectionHeader";
import { fetchMatches } from "../../redux/slices/matchSlice";
import { fetchLikedYou } from "../../redux/slices/userSlice";
import UserCard from "../../components/UserCard";

const MatchesPage = () => {
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.matches.matches);
  const likedYou = useSelector((state) => state.user.likedYou);

  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchLikedYou());
  }, [dispatch]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Active matches", matches.length],
          ["Liked you", likedYou.length],
          ["Ready to chat", matches.filter((match) => match.lastMessage).length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="glass-soft p-4"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">{label}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-5">
        <SectionHeader
          title="Your Matches"
          subtitle="People who matched your social vibe and dating chemistry."
        />
        {matches.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {matches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        ) : (
          <div className="glass-soft p-8 text-center text-white/60">
            No matches yet. Keep swiping in Discover and your next conversation can start here.
          </div>
        )}
      </div>

      <div className="glass-panel p-5">
        <SectionHeader
          title="Who Liked You"
          subtitle="Premium insight into people who already swiped right."
        />
        {likedYou.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {likedYou.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="glass-soft p-8 text-center text-white/60">
            Premium likes will appear here as soon as someone swipes right on you.
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
