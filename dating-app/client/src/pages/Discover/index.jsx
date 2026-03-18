import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreVertical,
  Music2,
  Repeat2,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dismissLatestMatch, fetchDiscover, swipeProfile } from "../../redux/slices/matchSlice";
import { activateBoost } from "../../redux/slices/userSlice";
import { formatDistance, getPrimaryPhoto } from "../../utils/helpers";
import { demoReels } from "../../utils/mockData";

const swipeActions = [
  { label: "Pass", action: "dislike", icon: X, className: "bg-white/10" },
  { label: "Super", action: "superlike", icon: Sparkles, className: "bg-spark-blue/80" },
  { label: "Like", action: "like", icon: Heart, className: "bg-spark-pink/90" },
];

const formatCount = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const DiscoverPage = () => {
  const dispatch = useDispatch();
  const { discoverUsers, latestMatch } = useSelector((state) => state.matches);
  const deckUsers = discoverUsers.slice(0, 3);
  const currentUser = deckUsers[0];
  const [likedReels, setLikedReels] = useState({});
  const [followedReels, setFollowedReels] = useState({});

  useEffect(() => {
    if (!discoverUsers.length) {
      dispatch(fetchDiscover());
    }
  }, [dispatch, discoverUsers.length]);

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
    <div>
      <div className="lg:hidden">
        {demoReels.map((reel) => {
          const isLiked = Boolean(likedReels[reel._id]);
          const isFollowed = Boolean(followedReels[reel._id]);

          return (
            <section
              key={reel._id}
              className="relative h-[calc(100vh-88px)] overflow-hidden bg-black"
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
                  onClick={() => setLikedReels((current) => ({ ...current, [reel._id]: !current[reel._id] }))}
                  className="flex flex-col items-center gap-1 text-white"
                >
                  <Heart size={34} className={isLiked ? "fill-current text-[#ff3040]" : ""} />
                  <span className="text-sm font-semibold">
                    {formatCount(reel.likes + (isLiked ? 1 : 0))}
                  </span>
                </button>

                <button type="button" className="flex flex-col items-center gap-1 text-white">
                  <MessageCircle size={34} />
                  <span className="text-sm font-semibold">{formatCount(reel.comments)}</span>
                </button>

                <button type="button" className="flex flex-col items-center gap-1 text-white">
                  <Repeat2 size={34} />
                  <span className="text-sm font-semibold">{formatCount(reel.remixes)}</span>
                </button>

                <button type="button" className="flex flex-col items-center gap-1 text-white">
                  <Send size={34} />
                </button>

                <button type="button" className="flex flex-col items-center gap-1 text-white">
                  <Bookmark size={34} />
                  <span className="text-sm font-semibold">{formatCount(reel.shares)}</span>
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
                      <p className="truncate text-[15px] font-semibold">{reel.author.username}</p>
                      <p className="flex items-center gap-1 text-sm text-white/80">
                        <Music2 size={14} />
                        <span className="truncate">{reel.audio}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFollowedReels((current) => ({ ...current, [reel._id]: !current[reel._id] }))
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

      <div className="hidden lg:grid lg:gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="glass-panel overflow-hidden p-4 sm:p-5 lg:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Dating mode</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">Discover nearby people</h2>
              <p className="mt-2 text-sm text-white/60">
                Swipe left to pass, right to like, or hit super like when the vibe is
                obvious.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:w-[360px]">
              {[
                ["Nearby", `${discoverUsers.length || 0} live`],
                ["Filters", "Premium ready"],
                ["Boost", "1 tap"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="glass-soft p-3 text-center"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                    {label}
                  </p>
                  <p className="mt-2 font-display text-base font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
              <div className="relative w-full max-w-xl">
                <div className="relative h-[520px] w-full sm:h-[600px] lg:h-[680px]">
                  {deckUsers.length ? (
                    deckUsers.map((user, index) => {
                      const isTop = index === 0;

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
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{
                            opacity: 1,
                            scale: 1 - index * 0.035,
                            y: index * 14,
                            rotate: index === 1 ? -1.5 : index === 2 ? 1.5 : 0,
                          }}
                          className="absolute inset-0"
                          style={{ zIndex: 30 - index }}
                        >
                          <div className="glass-panel h-full overflow-hidden">
                            <div className="relative h-full">
                              <img
                                src={getPrimaryPhoto(user)}
                                alt={user.name}
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.88] via-black/[0.1] to-transparent" />
                              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                  <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                                    {formatDistance(user.distanceKm)}
                                  </div>
                                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/70">
                                    {user.subscription?.plan || "free"}
                                  </div>
                                </div>
                                <h3 className="font-display text-3xl font-semibold sm:text-4xl">
                                  {user.name}, {user.age}
                                </h3>
                                <p className="mt-2 max-w-md text-sm text-white/75 sm:text-base">
                                  {user.bio}
                                </p>
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
                    })
                  ) : (
                    <div className="glass-soft flex h-full items-center justify-center p-8 text-center">
                      <div>
                        <p className="text-xs uppercase tracking-[0.26em] text-white/40">
                          All caught up
                        </p>
                        <h3 className="mt-3 font-display text-3xl font-semibold">
                          No new profiles right now
                        </h3>
                        <p className="mt-3 text-sm text-white/60">
                          Come back in a bit or boost your profile to refresh the deck.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {swipeActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.action}
                      type="button"
                      onClick={() => handleSwipe(item.action)}
                      className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-glow transition hover:scale-105 sm:h-16 sm:w-16 ${item.className}`}
                    >
                      <Icon size={22} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-soft p-5">
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
              <div className="glass-soft p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">
                  Suggested opener
                </p>
                <p className="mt-3 text-base text-white/80">
                  "Your playlist is either elite or chaotic. Which one?"
                </p>
              </div>
              <div className="glass-soft p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">Next move</p>
                <Link
                  to="/matches"
                  className="spark-button mt-4 w-full"
                >
                  Go to matches
                </Link>
              </div>
            </div>
          </div>
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
              <h3 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                You two clicked.
              </h3>
              <div className="mt-6 flex items-center justify-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
                  alt="You"
                  className="h-24 w-24 rounded-[28px] object-cover shadow-glow sm:h-28 sm:w-28"
                />
                <img
                  src={getPrimaryPhoto(latestMatch.partner)}
                  alt={latestMatch.partner.name}
                  className="h-24 w-24 rounded-[28px] object-cover shadow-glow sm:h-28 sm:w-28"
                />
              </div>
              <p className="mt-5 text-sm text-white/60">
                Start chatting while the spark is fresh.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => dispatch(dismissLatestMatch())}
                  className="spark-button-ghost flex-1"
                >
                  Keep swiping
                </button>
                <Link
                  to="/messages"
                  onClick={() => dispatch(dismissLatestMatch())}
                  className="spark-button flex-1"
                >
                  Start chat
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default DiscoverPage;
