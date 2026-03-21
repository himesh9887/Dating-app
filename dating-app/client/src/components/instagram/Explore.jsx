import { Search, Sparkles } from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
    query.trim() ? tile.title.toLowerCase().includes(query.trim().toLowerCase()) : true,
  );

  return (
    <div className="px-1 pb-4 sm:px-0">
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="glass-panel relative h-fit overflow-hidden p-5">
          <div className="absolute inset-0 spark-grid-bg opacity-[0.12]" />

          <div className="relative">
            <span className="spark-badge">
              <Sparkles size={12} />
              Search and explore
            </span>
            <h1 className="mt-5 font-display text-[2rem] font-semibold text-white">
              Discover people, creators, and visual moments faster.
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/60">
              Search results, curated tiles, and a cleaner browsing layout keep the app feeling
              more professional than a basic grid clone.
            </p>

            <label className="mt-6 flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-3.5">
              <Search
                size={18}
                className="text-white/44"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search names, usernames, or moods"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40"
              />
            </label>

            <div className="mt-6 grid gap-3">
              {results.length && query.trim() ? (
                results.slice(0, 5).map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    className="glass-soft flex items-center justify-between gap-3 p-4 transition hover:bg-white/[0.08]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/38">
                        @{user.username}
                      </p>
                    </div>
                    <span className="spark-badge px-3 py-1 text-white/54">Open</span>
                  </Link>
                ))
              ) : (
                <div className="glass-soft p-4 text-sm leading-6 text-white/56">
                  Search results will appear here as you type. Until then, browse curated explore
                  tiles on the right.
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="glass-panel overflow-hidden p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                Explore wall
              </p>
              <h2 className="mt-2 font-display text-[1.8rem] font-semibold text-white">
                Curated visuals and profile energy
              </h2>
            </div>
            <span className="text-sm text-white/50">{filteredTiles.length} results in the grid</span>
          </div>

          <div className="mt-5 grid auto-rows-[10px] grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {filteredTiles.map((tile, index) => (
              <article
                key={tile._id}
                style={{ gridRow: `span ${tile.rows}` }}
                className={index % 5 === 0 ? "md:col-span-2" : ""}
              >
                <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-spark-panel">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-spark-base via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{tile.title}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-white/42">
                          {tile.views} views
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">
                        Trend
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
