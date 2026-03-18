import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreVertical,
  Music2,
  Plus,
  Repeat2,
  Send,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import SectionHeader from "../../components/common/SectionHeader";
import StoryCard from "../../components/StoryCard";
import { createStory, fetchFeed, fetchStories, likePost } from "../../redux/slices/postSlice";
import { getPrimaryPhoto } from "../../utils/helpers";
import { demoReels } from "../../utils/mockData";

const formatReelCount = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const HomePage = () => {
  const dispatch = useDispatch();
  const { feed, stories, page, hasMore, status } = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.auth.user);
  const loadMoreRef = useRef(null);
  const storyInputRef = useRef(null);
  const [activeStory, setActiveStory] = useState(null);
  const [likedReels, setLikedReels] = useState({});
  const [followedReels, setFollowedReels] = useState({});

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

  const mobileReels = (feed.length
    ? feed.map((post) => ({
        _id: post._id,
        sourcePostId: post._id,
        author: post.author,
        media: { url: post.media?.[0]?.url || getPrimaryPhoto(post.author), type: "image" },
        caption: post.caption,
        audio: post.author?.location?.label || "Original audio",
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0,
        remixes: post.shareCount || 0,
        shares: post.shareCount || 0,
      }))
    : demoReels
  ).filter((item) => item.media?.url);

  const storyComposer = (
    <button
      type="button"
      onClick={() => storyInputRef.current?.click()}
      className="flex w-[88px] shrink-0 flex-col items-center gap-2 text-center"
    >
      <div className="relative">
        <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-white/10 bg-[#121212]">
          <img
            src={getPrimaryPhoto(currentUser)}
            alt={currentUser?.name || "Your story"}
            className="h-[76px] w-[76px] rounded-full object-cover"
          />
        </div>
        <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#0095f6] text-white">
          <Plus size={16} strokeWidth={2.5} />
        </span>
      </div>
      <span className="line-clamp-1 w-full text-[13px] text-white/85">Your story</span>
    </button>
  );

  return (
    <div className="space-y-0 lg:space-y-5">
      <div className="lg:hidden">
        {mobileReels.length ? (
          <div className="snap-y snap-mandatory">
            {mobileReels.map((reel) => {
              const isLiked = Boolean(likedReels[reel._id]);
              const isFollowed = Boolean(followedReels[reel._id]);

              return (
                <section
                  key={reel._id}
                  className="relative h-[calc(100vh-88px)] snap-start overflow-hidden bg-black"
                >
                  <img
                    src={reel.media.url}
                    alt={reel.caption}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />

                  <div className="absolute bottom-32 right-3 z-10 flex flex-col items-center gap-5">
                    <button
                      type="button"
                      onClick={() => {
                        setLikedReels((current) => ({ ...current, [reel._id]: !current[reel._id] }));
                        if (reel.sourcePostId) {
                          dispatch(likePost(reel.sourcePostId));
                        }
                      }}
                      className="flex flex-col items-center gap-1 text-white"
                    >
                      <Heart size={34} className={isLiked ? "fill-current text-[#ff3040]" : ""} />
                      <span className="text-sm font-semibold">
                        {formatReelCount(reel.likes + (isLiked ? 1 : 0))}
                      </span>
                    </button>

                    <button type="button" className="flex flex-col items-center gap-1 text-white">
                      <MessageCircle size={34} />
                      <span className="text-sm font-semibold">
                        {formatReelCount(reel.comments)}
                      </span>
                    </button>

                    <button type="button" className="flex flex-col items-center gap-1 text-white">
                      <Repeat2 size={34} />
                      <span className="text-sm font-semibold">
                        {formatReelCount(reel.remixes)}
                      </span>
                    </button>

                    <button type="button" className="flex flex-col items-center gap-1 text-white">
                      <Send size={34} />
                    </button>

                    <button type="button" className="flex flex-col items-center gap-1 text-white">
                      <Bookmark size={34} />
                      <span className="text-sm font-semibold">
                        {formatReelCount(reel.shares)}
                      </span>
                    </button>

                    <button type="button" className="text-white">
                      <MoreVertical size={28} />
                    </button>

                    <div className="h-11 w-11 overflow-hidden rounded-xl border border-white/30">
                      <img
                        src={getPrimaryPhoto(reel.author)}
                        alt={reel.author.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-7 z-10 px-4 text-white">
                    <div className="max-w-[calc(100%-78px)]">
                      <div className="flex items-center gap-3">
                        <img
                          src={getPrimaryPhoto(reel.author)}
                          alt={reel.author.name}
                          className="h-11 w-11 rounded-full border border-white/20 object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold">
                            {reel.author.username}
                          </p>
                          <p className="flex items-center gap-1 text-sm text-white/80">
                            <Music2 size={14} />
                            <span className="truncate">{reel.audio}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFollowedReels((current) => ({
                              ...current,
                              [reel._id]: !current[reel._id],
                            }))
                          }
                          className="rounded-2xl border border-white/70 px-5 py-2 text-base font-semibold text-white"
                        >
                          {isFollowed ? "Following" : "Follow"}
                        </button>
                      </div>
                      <p className="mt-3 line-clamp-2 pr-2 text-[15px] text-white/92">
                        {reel.caption}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[calc(100vh-88px)] items-center justify-center bg-black text-white/60">
            Loading reels...
          </div>
        )}

        {status === "loading" ? <Loader label="Loading reels..." /> : null}
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

            <div className="grid gap-4 xl:grid-cols-2">
              {mobileReels.map((reel) => (
                <div key={`desktop-${reel._id}`} className="glass-panel overflow-hidden">
                  <div className="relative h-[420px]">
                    <img
                      src={reel.media.url}
                      alt={reel.caption}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                        <Sparkles size={12} className="mr-2" />
                        Reel
                      </div>
                      <h3 className="text-lg font-semibold">@{reel.author.username}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-white/75">{reel.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
