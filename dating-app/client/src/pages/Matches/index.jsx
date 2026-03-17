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
      <div className="glass-panel p-5">
        <SectionHeader
          title="Your Matches"
          subtitle="People who matched your social vibe and dating chemistry."
        />
        <div className="grid gap-5 xl:grid-cols-2">
          {matches.map((match) => (
            <MatchCard key={match._id} match={match} />
          ))}
        </div>
      </div>

      <div className="glass-panel p-5">
        <SectionHeader
          title="Who Liked You"
          subtitle="Premium insight into people who already swiped right."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {likedYou.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
