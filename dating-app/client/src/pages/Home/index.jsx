import { AnimatePresence, motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import SectionHeader from "../../components/common/SectionHeader";
import PostCard from "../../components/PostCard";
import StoryCard from "../../components/StoryCard";
import { createStory, fetchFeed, fetchStories } from "../../redux/slices/postSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { feed, stories, page, hasMore, status } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth.user);
  const loadMoreRef = useRef(null);
  const storyInputRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);

  useEffect(() => {
    if (!feed.length) {
      dispatch(fetchFeed(1));
    }
    dispatch(fetchStories());
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
      { threshold: 0.6 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [dispatch, hasMore, page, status]);

  return (
    <div className="space-y-5">
      <div className="glass-panel p-5">
        <SectionHeader
          title="Stories"
          subtitle="Your feed opens with moments that disappear in 24 hours."
          action={
            <Link to="/create" className="spark-button">
              <Plus size={16} className="mr-2" />
              Create
            </Link>
          }
        />
        <div className="spark-scrollbar flex gap-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => storyInputRef.current?.click()}
            className="group flex w-20 flex-col items-center gap-2"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-spark-button shadow-glow">
              <Plus size={22} />
            </div>
            <span className="text-xs text-white/[0.65]">Your story</span>
          </button>
          {stories.map((story) => (
            <StoryCard key={story._id} story={story} onClick={setActiveStory} />
          ))}
        </div>
        <input
          ref={storyInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              dispatch(createStory(file));
            }
          }}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {feed.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
          {status === "loading" ? <Loader label="Loading the next wave..." /> : null}
          {hasMore ? <div ref={loadMoreRef} className="h-8" /> : null}
        </div>
        <div className="hidden xl:block">
          <div className="glass-panel sticky top-24 p-5">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-spark-mint">
              <Sparkles size={18} />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold">
              Dating mode is active
            </h3>
            <p className="mt-3 text-sm text-white/[0.65]">
              Boost your visibility, jump into Discover, and turn social chemistry into
              live chats.
            </p>
            <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                Tonight's energy
              </p>
              <p className="mt-3 text-3xl font-display font-semibold">34 people nearby</p>
              <p className="mt-2 text-sm text-white/[0.55]">
                8 likes waiting | 3 new story viewers
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeStory ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 18 }}
              className="glass-panel max-w-md overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={activeStory.media.url}
                alt={activeStory.caption}
                className="h-[70vh] w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold">@{activeStory.author.username}</h3>
                <p className="mt-2 text-sm text-white/[0.65]">{activeStory.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
