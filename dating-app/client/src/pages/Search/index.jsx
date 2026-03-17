import { useDeferredValue, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "../../components/common/SectionHeader";
import UserCard from "../../components/UserCard";
import { searchUsers } from "../../redux/slices/userSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const results = useSelector((state) => state.user.searchResults);
  const [filters, setFilters] = useState({
    q: "",
    interest: "",
    location: "",
    gender: "",
    ageMin: 18,
    ageMax: 30,
    distance: 50,
  });
  const deferredQuery = useDeferredValue(filters);

  useEffect(() => {
    dispatch(searchUsers(deferredQuery));
  }, [deferredQuery, dispatch]);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-5">
        <SectionHeader
          title="Search"
          subtitle="Filter by username, interests, age range, distance, and gender."
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input
            className="spark-input"
            placeholder="Search username or name"
            value={filters.q}
            onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
          />
          <input
            className="spark-input"
            placeholder="Interest"
            value={filters.interest}
            onChange={(event) => setFilters((current) => ({ ...current, interest: event.target.value }))}
          />
          <input
            className="spark-input"
            placeholder="Location"
            value={filters.location}
            onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))}
          />
          <input
            className="spark-input"
            placeholder="Gender"
            value={filters.gender}
            onChange={(event) => setFilters((current) => ({ ...current, gender: event.target.value }))}
          />
          <input
            type="number"
            className="spark-input"
            placeholder="Min age"
            value={filters.ageMin}
            onChange={(event) => setFilters((current) => ({ ...current, ageMin: event.target.value }))}
          />
          <input
            type="number"
            className="spark-input"
            placeholder="Max age"
            value={filters.ageMax}
            onChange={(event) => setFilters((current) => ({ ...current, ageMax: event.target.value }))}
          />
          <input
            type="number"
            className="spark-input"
            placeholder="Distance in km"
            value={filters.distance}
            onChange={(event) => setFilters((current) => ({ ...current, distance: event.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
