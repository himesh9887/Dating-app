import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissLatestMatch, fetchDiscover, swipeProfile } from "../../redux/slices/matchSlice";
import { activateBoost } from "../../redux/slices/userSlice";
import { formatDistance, getPrimaryPhoto } from "../../utils/helpers";

const swipeActions = [
  { label: "Pass", action: "dislike", icon: X, className: "bg-white/10" },
  { label: "Super", action: "superlike", icon: Sparkles, className: "bg-spark-blue/80" },
  { label: "Like", action: "like", icon: Heart, className: "bg-spark-pink/90" },
];

const DiscoverPage = () => {
  const dispatch = useDispatch();
  const { discoverUsers, latestMatch } = useSelector((state) => state.matches);

  useEffect(() => {
    if (!discoverUsers.length) {
      dispatch(fetchDiscover());
    }
  }, [dispatch, discoverUsers.length]);

  const currentUser = discoverUsers[0];

  const handleSwipe = (action) => {
    if (!currentUser) {
      return;
    }

    dispatch(
      swipeProfile({
        userId: currentUser._id,
        action,
      }),
    );
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="glass-panel min-h-[720px] overflow-hidden p-4 sm:p-5">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Dating mode</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Discover nearby people</h2>
            <p className="mt-2 text-sm text-white/60">
              Swipe left to pass, right to like, or hit super like when the vibe is
              obvious.
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-6 flex max-w-md justify-center">
          {discoverUsers.slice(0, 3).reverse().map((user, index) => {
            const isTop = index === discoverUsers.slice(0, 3).length - 1;

            return (
              <motion.div
                key={user._id}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_event, info) => {
                  if (!isTop) {
                    return;
                  }

                  if (info.offset.x > 120) {
                    handleSwipe("like");
                  } else if (info.offset.x < -120) {
                    handleSwipe("dislike");
                  }
                }}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1 - index * 0.04,
                  y: index * 16,
                }}
                className="absolute w-full max-w-md"
                style={{ zIndex: 20 - index }}
              >
                <div className="glass-panel overflow-hidden">
                  <div className="relative">
                    <img
                      src={getPrimaryPhoto(user)}
                      alt={user.name}
                      className="h-[560px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/[0.85] via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-2 inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                        {formatDistance(user.distanceKm)}
                      </div>
                      <h3 className="font-display text-4xl font-semibold">
                        {user.name}, {user.age}
                      </h3>
                      <p className="mt-2 text-sm text-white/75">{user.bio}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {user.interests?.map((interest) => (
                          <span
                            key={interest}
                            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-[600px] flex items-center justify-center gap-4">
          {swipeActions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.action}
                type="button"
                onClick={() => handleSwipe(item.action)}
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-glow transition hover:scale-105 ${item.className}`}
              >
                <Icon size={22} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-5">
        <div className="glass-panel p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-white/40">Premium</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">Boost your card</h3>
          <p className="mt-3 text-sm text-white/60">
            Jump higher in nearby decks, unlock advanced filters, and see who already
            liked you.
          </p>
          <button
            type="button"
            onClick={() => dispatch(activateBoost())}
            className="spark-button mt-5 w-full"
          >
            Activate boost
          </button>
        </div>
      </div>

      <AnimatePresence>
        {latestMatch ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel max-w-lg p-6 text-center"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-spark-mint">Its a match</p>
              <h3 className="mt-3 font-display text-5xl font-semibold">You two clicked.</h3>
              <div className="mt-6 flex items-center justify-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
                  alt="You"
                  className="h-28 w-28 rounded-[32px] object-cover shadow-glow"
                />
                <img
                  src={getPrimaryPhoto(latestMatch.partner)}
                  alt={latestMatch.partner.name}
                  className="h-28 w-28 rounded-[32px] object-cover shadow-glow"
                />
              </div>
              <p className="mt-5 text-sm text-white/60">
                Start chatting while the spark is fresh.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(dismissLatestMatch())}
                  className="spark-button-ghost flex-1"
                >
                  Keep swiping
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(dismissLatestMatch())}
                  className="spark-button flex-1"
                >
                  Start chat
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DiscoverPage;
