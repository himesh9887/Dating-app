import { Search, Sparkles } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../../redux/slices/userSlice";
import { demoExploreTiles } from "../../utils/mockData";

const Explore = () => {
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
      <div className="sticky top-0 z-20 border-b border-[#262626] bg-black/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-full bg-[#262626] px-4 py-2.5">
          <Search size={18} className="text-[#a8a8a8]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-white placeholder:text-[#a8a8a8]"
          />
          <Sparkles size={16} className="text-[#a8a8a8]" />
        </div>
      </div>

      {results.length && query.trim() ? (
        <div className="spark-scrollbar flex gap-3 overflow-x-auto border-b border-[#262626] px-4 py-3">
          {results.slice(0, 5).map((user) => (
            <div
              key={user._id}
              className="shrink-0 rounded-full border border-[#262626] px-3 py-1.5 text-xs text-white"
            >
              @{user.username}
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-[2px]">
        {filteredTiles.map((tile) => (
          <article
            key={tile._id}
            className="aspect-square overflow-hidden bg-[#0f0f0f]"
          >
            <img
              src={tile.image}
              alt={tile.title}
              className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
            />
          </article>
        ))}
      </div>
    </div>
  );
};

export default Explore;
