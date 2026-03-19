import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import Post from "../../components/instagram/Post";
import Stories from "../../components/instagram/Stories";
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
    <div className="min-h-screen bg-black text-white">
      <Stories
        stories={stories}
        currentUser={currentUser}
        onCreateStory={() => storyInputRef.current?.click()}
        onStoryClick={setActiveStory}
      />

      <div className="px-0 pb-4">
        {feed.map((post) => (
          <Post
            key={post._id}
            post={post}
          />
        ))}

        {status === "loading" ? <Loader label="Loading feed..." /> : null}

        {!feed.length && status === "succeeded" ? (
          <div className="px-6 py-16 text-center text-[#a8a8a8]">
            No posts yet. Start by creating your first post.
          </div>
        ) : null}
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
              className="w-full overflow-hidden rounded-[28px] border border-[#262626] bg-black"
            >
              <div className="flex items-center gap-3 px-4 py-4">
                <img
                  src={getPrimaryPhoto(activeStory.author)}
                  alt={activeStory.author.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-semibold text-white">
                    {activeStory.author.username}
                  </p>
                  <p className="truncate text-xs text-[#a8a8a8]">
                    {activeStory.caption || "Story"}
                  </p>
                </div>
              </div>
              <img
                src={activeStory.media.url}
                alt={activeStory.caption}
                className="max-h-[70vh] w-full object-cover"
              />
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

      {hasMore ? <div ref={loadMoreRef} className="h-8" /> : null}
    </div>
  );
};

export default HomePage;
