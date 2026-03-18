import { Play, Search, Sparkles } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../../redux/slices/userSlice";
import { demoExploreTiles } from "../../utils/mockData";

const SearchPage = () => {
  const dispatch = useDispatch();
  const results = useSelector((state) => state.user.searchResults);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    dispatch(searchUsers({ q: deferredQuery }));
  }, [deferredQuery, dispatch]);

  const filteredTiles = demoExploreTiles.filter((tile) =>
    query.trim()
      ? tile.title.toLowerCase().includes(query.trim().toLowerCase())
      : true,
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 bg-black/95 px-4 pb-4 pt-4 backdrop-blur-xl lg:px-6">
        <div className="flex h-14 items-center gap-3 rounded-[20px] bg-[#23262d] px-4 text-white/70">
          <Search size={24} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search with Meta AI"
            className="h-full w-full bg-transparent text-[18px] text-white placeholder:text-white/60"
          />
          <Sparkles size={20} className="text-white/35" />
        </div>
      </div>

      <div className="px-[1px] pb-24 lg:px-6 lg:pb-10">
        <div className="grid grid-cols-3 gap-[1px] [grid-auto-rows:8px] lg:gap-2">
          {filteredTiles.map((tile) => (
            <article
              key={tile._id}
              className="group relative overflow-hidden bg-[#0f1117]"
              style={{ gridRow: `span ${tile.rows} / span ${tile.rows}` }}
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                <Play size={15} className="fill-current" />
                <span className="text-[13px] font-medium">{tile.views}</span>
              </div>
            </article>
          ))}
        </div>

        {!filteredTiles.length ? (
          <div className="px-6 py-12 text-center text-white/60">
            No explore results matched this search yet.
          </div>
        ) : null}

        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 lg:px-1 lg:pt-6">
          {results.slice(0, 3).map((user) => (
            <div key={user._id} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="mt-1 text-sm text-white/55">@{user.username}</p>
              <p className="mt-3 text-sm text-white/70">
                Search results still stay connected to the original data underneath this visual layout.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
