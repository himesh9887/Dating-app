import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MatchCard from "../../components/MatchCard";
import UserCard from "../../components/UserCard";
import Loader from "../../components/common/Loader";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import { fetchMatches } from "../../redux/slices/matchSlice";
import { fetchLikedYou } from "../../redux/slices/userSlice";

const MatchesPage = () => {
  const dispatch = useDispatch();
  const { matches, status, error } = useSelector((state) => state.matches);
  const likedYou = useSelector((state) => state.user.likedYou);

  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchLikedYou());
  }, [dispatch]);

  return (
    <PageShell
      eyebrow="Dating dashboard"
      title="Turn new matches into real conversations"
      subtitle="See who already matched your energy, who liked your profile, and which sparks are ready for a first message."
      stats={[
        { label: "Active matches", value: matches.length, meta: "Live" },
        { label: "Liked you", value: likedYou.length, meta: "Premium" },
        {
          label: "Ready to chat",
          value: matches.filter((match) => match.lastMessage || match.matchedAt).length,
          meta: "Hot",
        },
      ]}
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel p-5 lg:p-6">
          <SectionHeader
            title="Your Matches"
            subtitle="Fresh connections with enough context to help you start a better conversation."
          />

          {status === "loading" && !matches.length ? <Loader label="Loading matches..." /> : null}

          {error && !matches.length ? (
            <div className="glass-soft p-8 text-center text-white/70">
              {error}
            </div>
          ) : null}

          {matches.length ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {matches.map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                />
              ))}
            </div>
          ) : null}

          {!matches.length && status === "succeeded" ? (
            <div className="glass-soft p-8 text-center text-white/60">
              No matches yet. Keep swiping in Discover and your next conversation can start here.
            </div>
          ) : null}
        </section>

        <section className="glass-panel p-5 lg:p-6">
          <SectionHeader
            title="Who Liked You"
            subtitle="A premium-style preview of people who already showed interest in your profile."
          />

          {likedYou.length ? (
            <div className="grid gap-3">
              {likedYou.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="glass-soft p-8 text-center text-white/60">
              Premium likes will appear here as soon as someone swipes right on you.
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
};

export default MatchesPage;
