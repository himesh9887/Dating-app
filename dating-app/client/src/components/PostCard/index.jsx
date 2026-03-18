import { motion } from "framer-motion";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Repeat2,
  Send,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentPost, likePost } from "../../redux/slices/postSlice";
import { classNames, getPrimaryPhoto } from "../../utils/helpers";
import { demoUser } from "../../utils/mockData";

const formatCount = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const formatFeedAge = (value) => {
  const date = new Date(value);
  const diffMinutes = Math.max(Math.floor((Date.now() - date.getTime()) / 60000), 1);

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const getAudioLabel = (post) =>
  post.audioTrack || post.author?.location?.label || "Original audio";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user) || demoUser;
  const viewerId = currentUser?._id || demoUser._id;
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(post.author?._id === viewerId);
  const [showComposer, setShowComposer] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const likes = post.likes || [];
  const comments = post.comments || [];
  const hashtags = post.hashtags || [];
  const mediaCount = Math.max(post.media?.length || 1, 1);
  const indicatorCount = mediaCount > 1 ? Math.min(mediaCount, 6) : 5;
  const isLiked = likes.includes(viewerId);
  const isOwnPost = post.author?._id === viewerId;

  const submitComment = (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    dispatch(commentPost({ postId: post._id, comment }));
    setComment("");
    setShowComposer(false);
  };

  const actionItems = [
    {
      key: "likes",
      icon: Heart,
      count: formatCount(likes.length),
      active: isLiked,
      onClick: () => dispatch(likePost(post._id)),
    },
    {
      key: "comments",
      icon: MessageCircle,
      count: formatCount(comments.length),
      active: showComposer,
      onClick: () => setShowComposer((current) => !current),
    },
    {
      key: "reposts",
      icon: Repeat2,
      count: formatCount(post.repostCount ?? Math.max((post.shareCount || 0) - 1, 0)),
    },
    {
      key: "shares",
      icon: Send,
      count: formatCount(post.shareCount || 0),
    },
  ];

  return (
    <motion.article
      layout
      className="overflow-hidden border-b border-white/10 bg-black text-white lg:rounded-[32px] lg:border lg:border-white/10 lg:bg-white/[0.08] lg:shadow-panel lg:backdrop-blur-2xl"
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="min-w-0 flex items-center gap-3">
          <div
            className="rounded-full p-[2px]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 52%, #6228d7 100%)",
            }}
          >
            <img
              src={getPrimaryPhoto(post.author)}
              alt={post.author.name}
              className="h-11 w-11 rounded-full border-2 border-black object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[15px] font-semibold">{post.author.username}</h3>
              {post.author.location?.label ? (
                <span className="hidden truncate text-xs text-white/40 sm:inline">
                  {post.author.location.label}
                </span>
              ) : null}
            </div>
            <p className="flex items-center gap-1 text-xs text-white/55">
              <Music2 size={12} />
              <span className="truncate">{getAudioLabel(post)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwnPost ? (
            <button
              type="button"
              onClick={() => setFollowing((current) => !current)}
              className={classNames(
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                following
                  ? "border border-white/15 bg-white/5 text-white/80"
                  : "bg-white text-black",
              )}
            >
              {following ? "Following" : "Follow"}
            </button>
          ) : null}
          <button
            type="button"
            className="instagram-icon-button h-10 w-10"
            aria-label="More options"
          >
            <MoreHorizontal size={22} />
          </button>
        </div>
      </div>

      {post.media?.[0] ? (
        <div className="relative bg-black">
          <img
            src={post.media[0].url}
            alt={post.caption}
            loading="lazy"
            className="h-[440px] w-full object-cover sm:h-[560px] lg:h-[520px] xl:h-[640px]"
          />
          <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
            1/{mediaCount}
          </div>
          <button
            type="button"
            onClick={() => setSoundOn((current) => !current)}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
            aria-label={soundOn ? "Mute post audio" : "Unmute post audio"}
          >
            <Volume2 size={18} />
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-center gap-1 px-4 pt-3">
        {Array.from({ length: indicatorCount }).map((_, index) => (
          <span
            key={`${post._id}-indicator-${index}`}
            className={classNames(
              "h-1.5 w-1.5 rounded-full",
              index === 0 ? "bg-[#4f7cff]" : "bg-white/25",
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-5 overflow-x-auto pr-2 text-[15px] font-semibold">
          {actionItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className="flex shrink-0 items-center gap-1.5 text-white"
                aria-label={item.key}
              >
                <Icon
                  size={28}
                  className={classNames(
                    item.active ? "fill-current text-[#ff3040]" : "",
                  )}
                />
                <span>{item.count}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setSaved((current) => !current)}
          className="shrink-0 text-white"
          aria-label={saved ? "Remove bookmark" : "Save post"}
        >
          <Bookmark size={28} className={saved ? "fill-current" : ""} />
        </button>
      </div>

      <div className="px-4 pb-5 pt-4 sm:px-5">
        <p className="text-sm leading-6">
          <span className="font-semibold">{post.author.username}</span>{" "}
          <span className="text-white/88">{post.caption}</span>
        </p>

        {hashtags.length ? (
          <p className="mt-1 text-sm text-[#8ec5ff]">
            {hashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        ) : null}

        {comments.length ? (
          <p className="mt-3 text-sm text-white/65">
            <span className="font-semibold text-white/90">
              {comments[comments.length - 1].user.username}
            </span>{" "}
            {comments[comments.length - 1].comment}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
          <span>{formatFeedAge(post.createdAt)}</span>
          <span>&bull;</span>
          <button type="button" className="font-medium text-white/70">
            See translation
          </button>
        </div>

        <form
          onSubmit={submitComment}
          className={classNames(
            "mt-4 flex-col gap-2 sm:flex-row",
            showComposer ? "flex" : "hidden lg:flex",
          )}
        >
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a comment..."
            className="spark-input flex-1 bg-white/5 focus:bg-white/10"
          />
          <button type="submit" className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black">
            Post
          </button>
        </form>
      </div>
    </motion.article>
  );
};

export default PostCard;
