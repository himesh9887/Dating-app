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
import { getPrimaryPhoto } from "../../utils/helpers";

const HomePage = () => {
  const dispatch = useDispatch();
  const { feed, stories, page, hasMore, status } = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.auth.user);
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

  const handleStoryUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      dispatch(createStory(file));
      event.target.value = "";
    }
  };

  const storyComposer = (
    <button
      type="button"
      onClick={() => storyInputRef.current?.click()}
      className="flex w-[92px] shrink-0 flex-col items-center gap-2 text-center font-sans"
    >
      <div className="relative">
        <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-white/10 bg-[#121212]">
          <img
            src={getPrimaryPhoto(currentUser)}
            alt={currentUser?.name || "Your story"}
            className="h-[80px] w-[80px] rounded-full object-cover"
          />
        </div>
        <span className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-black bg-white text-black">
          <Plus size={18} strokeWidth={2.8} />
        </span>
      </div>
      <span className="line-clamp-1 w-full text-[12.5px] font-medium leading-4 text-white/90">
        Your story
      </span>
    </button>
  );

  return (
    <div className="space-y-0 lg:space-y-5">
      <div className="bg-black font-sans lg:hidden">
        <section className="bg-black px-3 pb-3 pt-1">
          <div className="spark-scrollbar flex gap-[18px] overflow-x-auto pb-1 pt-1">
            {storyComposer}
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} onClick={setActiveStory} />
            ))}
          </div>
        </section>

        {!feed.length && status === "succeeded" ? (
          <div className="px-6 py-12 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/35">Feed reset</p>
            <h3 className="mt-4 font-display text-2xl font-semibold">
              Your mobile feed is ready for fresh posts.
            </h3>
            <p className="mt-3 text-sm text-white/60">
              Follow more people or create your first post to start filling this screen.
            </p>
            <Link to="/create" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black">
              Create a post
            </Link>
          </div>
        ) : null}

        <div className="space-y-0">
          {feed.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {status === "loading" ? <Loader label="Loading your feed..." /> : null}
      </div>

      <div className="hidden lg:block lg:space-y-5">
        <div className="glass-panel p-5 lg:p-6">
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
            {storyComposer}
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} onClick={setActiveStory} />
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 2xl:hidden">
          <div className="glass-soft p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">Tonight&apos;s energy</p>
            <p className="mt-2 font-display text-2xl font-semibold">34 people nearby</p>
            <p className="mt-2 text-sm text-white/[0.6]">
              New profiles are active across Discover and story views.
            </p>
          </div>
          <div className="glass-soft p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">Live momentum</p>
            <p className="mt-2 font-display text-2xl font-semibold">8 likes waiting</p>
            <p className="mt-2 text-sm text-white/[0.6]">
              3 new story viewers and 2 conversations warmed up today.
            </p>
          </div>
        </div>

        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            {!feed.length && status === "succeeded" ? (
              <div className="glass-panel p-8 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Feed reset</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">
                  Your social feed is ready for fresh moments.
                </h3>
                <p className="mt-3 text-sm text-white/[0.6]">
                  Follow more people, upload a story, or create a post to get the energy moving.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/discover" className="spark-button">
                    Explore people
                  </Link>
                  <Link to="/create" className="spark-button-ghost">
                    Make a post
                  </Link>
                </div>
              </div>
            ) : null}

            {feed.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {status === "loading" ? <Loader label="Loading the next wave..." /> : null}
          </div>

          <div className="hidden 2xl:block">
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
                  Tonight&apos;s energy
                </p>
                <p className="mt-3 text-3xl font-display font-semibold">34 people nearby</p>
                <p className="mt-2 text-sm text-white/[0.55]">
                  8 likes waiting | 3 new story viewers
                </p>
              </div>
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
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-0 sm:p-4"
            onClick={() => setActiveStory(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 18 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 18 }}
              className="h-full w-full max-w-md overflow-hidden bg-black sm:glass-panel"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex gap-1 px-4 pt-4">
                <span className="h-1 flex-1 rounded-full bg-white" />
                <span className="h-1 flex-1 rounded-full bg-white/25" />
                <span className="h-1 flex-1 rounded-full bg-white/25" />
              </div>
              <div className="flex items-center gap-3 px-4 py-4">
                <div
                  className="rounded-full p-[2px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 52%, #6228d7 100%)",
                  }}
                >
                  <img
                    src={getPrimaryPhoto(activeStory.author)}
                    alt={activeStory.author.name}
                    className="h-10 w-10 rounded-full border-2 border-black object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">@{activeStory.author.username}</h3>
                  <p className="truncate text-xs text-white/55">{activeStory.caption || "Story"}</p>
                </div>
              </div>
              <img
                src={activeStory.media.url}
                alt={activeStory.caption}
                className="h-[calc(100%-88px)] w-full object-cover sm:h-[72vh]"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <input
        ref={storyInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleStoryUpload}
      />

      {hasMore ? <div ref={loadMoreRef} className="h-10" /> : null}
    </div>
  );
};

export default HomePage;
