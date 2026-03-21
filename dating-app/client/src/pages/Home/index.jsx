import { AnimatePresence, motion } from "framer-motion";
import { Compass, PlusCircle, Sparkles, UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../components/ProfileCard";
import UserCard from "../../components/UserCard";
import Loader from "../../components/common/Loader";
import Post from "../../components/instagram/Post";
import Stories from "../../components/instagram/Stories";
import { createStory, fetchFeed, fetchStories } from "../../redux/slices/postSlice";
import { fetchSuggestions } from "../../redux/slices/userSlice";
import { getPrimaryPhoto } from "../../utils/helpers";
import { demoSuggestions } from "../../utils/mockData";

const HomePage = () => {
  const dispatch = useDispatch();
  const { feed, stories, page, hasMore, status } = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.auth.user);
  const suggestions = useSelector((state) => state.user.suggestions);
  const loadMoreRef = useRef(null);
  const storyInputRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);
  const suggestedPeople = suggestions.length ? suggestions : demoSuggestions;

  useEffect(() => {
    if (!feed.length) {
      dispatch(fetchFeed(1));
    }

    dispatch(fetchStories());
    dispatch(fetchSuggestions());
  }, [dispatch, feed.length]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || status === "loading") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(fetchFeed(page + 1));
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [dispatch, hasMore, page, status]);

  const handleStoryUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    dispatch(createStory(file));
    event.target.value = "";
  };

  return (
    <div className="px-1 pb-4 sm:px-0">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className="glass-panel relative overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
            <div className="absolute inset-0 spark-grid-bg opacity-[0.14]" />
            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <span className="spark-badge">
                    <Sparkles size={12} />
                    Social feed
                  </span>
                  <h1 className="mt-5 font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.6rem]">
                    Stories, moments, and people that keep your app feeling alive.
                  </h1>
                  <p className="mt-4 text-sm leading-7 text-white/60 sm:text-[15px]">
                    A cleaner feed layout with faster scanability, better spacing, and stronger
                    profile presentation across every post.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:w-[420px]">
                  {[
                    { label: "Stories", value: stories.length || 0, icon: PlusCircle },
                    { label: "Feed posts", value: feed.length || 0, icon: Compass },
                    { label: "Suggestions", value: suggestedPeople.length || 0, icon: UsersRound },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="spark-stat"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/36">
                          {label}
                        </p>
                        <Icon
                          size={15}
                          className="text-spark-cyan"
                        />
                      </div>
                      <p className="mt-4 font-display text-[1.8rem] font-semibold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Stories
                  stories={stories}
                  currentUser={currentUser}
                  onCreateStory={() => storyInputRef.current?.click()}
                  onStoryClick={setActiveStory}
                />
              </div>
            </div>
          </section>

          <div className="space-y-5">
            {feed.map((post) => (
              <Post
                key={post._id}
                post={post}
              />
            ))}

            {status === "loading" ? <Loader label="Loading feed..." /> : null}

            {!feed.length && status === "succeeded" ? (
              <div className="glass-panel px-6 py-16 text-center text-white/62">
                No posts yet. Start by creating your first post.
              </div>
            ) : null}
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-6 space-y-5">
            <ProfileCard />

            <div className="glass-panel p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                    Recommended
                  </p>
                  <h2 className="mt-2 font-display text-[1.7rem] font-semibold text-white">
                    People worth opening
                  </h2>
                </div>
                <span className="spark-badge px-3 py-1 text-white/54">Nearby</span>
              </div>

              <div className="mt-5 grid gap-3">
                {suggestedPeople.slice(0, 3).map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="glass-panel p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                Quick notes
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Profiles with updated photos and bios usually convert better in Discover.",
                  "Fresh stories help your account feel active before someone opens chat.",
                  "Short captions and stronger images keep your feed posts easier to scan.",
                ].map((note) => (
                  <div
                    key={note}
                    className="glass-soft p-4 text-sm leading-6 text-white/62"
                  >
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {activeStory ? (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveStory(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              className="glass-panel w-full max-w-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-5">
                <img
                  src={getPrimaryPhoto(activeStory.author)}
                  alt={activeStory.author.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-semibold text-white">
                    {activeStory.author.username}
                  </p>
                  <p className="truncate text-xs uppercase tracking-[0.22em] text-white/38">
                    Story preview
                  </p>
                </div>
              </div>
              <img
                src={activeStory.media.url}
                alt={activeStory.caption}
                className="max-h-[70vh] w-full object-cover"
              />
              <div className="px-5 py-4 text-left text-sm leading-6 text-white/64">
                {activeStory.caption || "Story"}
              </div>
            </motion.div>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <input
        ref={storyInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleStoryUpload}
      />

      {hasMore ? (
        <div
          ref={loadMoreRef}
          className="h-8"
        />
      ) : null}
    </div>
  );
};

export default HomePage;
