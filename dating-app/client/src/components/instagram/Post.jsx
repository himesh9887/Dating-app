import { motion } from "framer-motion";
import { Bookmark, Heart, MapPin, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { commentPost, likePost } from "../../redux/slices/postSlice";
import { classNames, formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";
import { demoUser } from "../../utils/mockData";

const formatCount = (value = 0) => new Intl.NumberFormat("en-US").format(value);

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user) || demoUser;
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const likes = post.likes || [];
  const comments = post.comments || [];
  const hashtags = post.hashtags || [];
  const isLiked = likes.includes(currentUser._id);
  const likesCount = post.displayCounts?.likes ?? likes.length;
  const commentsCount = post.displayCounts?.comments ?? comments.length;
  const sharesCount = post.displayCounts?.shares ?? post.shareCount ?? 0;
  const locationLabel = post.author?.location?.label;

  const handleCommentSubmit = (event) => {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return;
    }

    dispatch(commentPost({ postId: post._id, comment: trimmedComment }));
    setComment("");
    setShowComposer(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="glass-panel overflow-hidden p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-full bg-spark-gradient p-[2px]">
            <img
              src={getPrimaryPhoto(post.author)}
              alt={post.author.name}
              className="h-12 w-12 rounded-full border-2 border-spark-base object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/profile/${post.author.username}`}
                className="truncate text-[15px] font-semibold text-white"
              >
                {post.author.name || post.author.username}
              </Link>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                @{post.author.username}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/46">
              {locationLabel ? (
                <>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {locationLabel}
                  </span>
                  <span className="text-white/24">&bull;</span>
                </>
              ) : null}
              <span>{post.displayAge || formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="spark-button-ghost h-11 w-11 p-0"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.media?.[0] ? (
        <div className="relative mt-4 overflow-hidden rounded-[30px]">
          <img
            src={post.media[0].url}
            alt={post.caption}
            className="aspect-[4/4.25] w-full object-cover sm:aspect-[5/5.2]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="spark-badge px-3 py-1 text-white/56">Feed moment</span>
              {hashtags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-white/72 backdrop-blur-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            {
              key: "like",
              icon: Heart,
              active: isLiked,
              label: formatCount(likesCount + (isLiked ? 1 : 0)),
              onClick: () => dispatch(likePost(post._id)),
            },
            {
              key: "comment",
              icon: MessageCircle,
              active: showComposer,
              label: formatCount(commentsCount),
              onClick: () => setShowComposer((current) => !current),
            },
            {
              key: "share",
              icon: Send,
              label: formatCount(sharesCount),
            },
          ].map(({ key, icon: Icon, active, label, onClick }) => (
            <button
              key={key}
              type="button"
              onClick={onClick}
              className={classNames(
                "flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-300",
                active
                  ? "border-white/16 bg-white/[0.08] text-white"
                  : "border-white/10 bg-white/[0.04] text-white/76 hover:bg-white/[0.07]",
              )}
            >
              <Icon
                size={16}
                className={classNames(active && key === "like" ? "fill-current text-[#ff7a6c]" : "")}
              />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSaved((current) => !current)}
          className="spark-button-ghost h-11 w-11 p-0"
          aria-label={saved ? "Remove from saved" : "Save post"}
        >
          <Bookmark
            size={17}
            className={saved ? "fill-current text-white" : ""}
          />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-[15px] leading-7 text-white/82">
          <span className="font-semibold text-white">{post.author.username}</span>{" "}
          <span>{post.caption}</span>
        </p>

        {hashtags.length > 2 ? (
          <p className="text-sm leading-6 text-spark-cyan">
            {hashtags.slice(2).map((tag) => `#${tag}`).join(" ")}
          </p>
        ) : null}

        {comments.length ? (
          <button
            type="button"
            onClick={() => setShowComposer((current) => !current)}
            className="text-left text-sm text-white/54"
          >
            View {comments.length} comment{comments.length === 1 ? "" : "s"}
          </button>
        ) : null}

        {showComposer ? (
          <form
            onSubmit={handleCommentSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a thoughtful reply..."
              className="spark-input flex-1"
            />
            <button
              type="submit"
              className="spark-button justify-center sm:min-w-[116px]"
            >
              Post
            </button>
          </form>
        ) : null}
      </div>
    </motion.article>
  );
};

export default Post;
