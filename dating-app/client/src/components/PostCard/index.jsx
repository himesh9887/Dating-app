import { motion } from "framer-motion";
import { Heart, MapPin, MessageCircle, Send, Share2 } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { commentPost, likePost } from "../../redux/slices/postSlice";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const submitComment = (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    dispatch(commentPost({ postId: post._id, comment }));
    setComment("");
  };

  return (
    <motion.article
      layout
      className="glass-panel overflow-hidden"
    >
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <img
            src={getPrimaryPhoto(post.author)}
            alt={post.author.name}
            className="h-12 w-12 rounded-2xl object-cover"
          />
          <div>
            <h3 className="font-display text-base font-semibold">{post.author.username}</h3>
            <p className="flex items-center gap-1 text-xs text-white/[0.45]">
              <MapPin size={12} />
              {post.author.location?.label || "Nearby"} | {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
      </div>
      {post.media?.[0] ? (
        <div className="relative">
          <img
            src={post.media[0].url}
            alt={post.caption}
            loading="lazy"
            className="h-[420px] w-full object-cover"
          />
          <div className="absolute inset-x-5 bottom-5 rounded-3xl bg-black/[0.35] px-4 py-3 backdrop-blur-lg">
            <p className="text-sm text-white/90">{post.caption}</p>
          </div>
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(likePost(post._id))}
              className="spark-button-ghost p-3"
            >
              <Heart size={18} />
            </button>
            <button
              type="button"
              className="spark-button-ghost p-3"
            >
              <MessageCircle size={18} />
            </button>
            <button
              type="button"
              className="spark-button-ghost p-3"
            >
              <Send size={18} />
            </button>
          </div>
          <button
            type="button"
            className="spark-button-ghost p-3"
          >
            <Share2 size={18} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/50">
          {post.hashtags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-white/70">{post.likes.length} likes</p>
        <div className="mt-4 space-y-2">
          {post.comments.slice(-2).map((item) => (
            <div
              key={item._id}
              className="text-sm text-white/60"
            >
              <span className="font-semibold text-white/[0.85]">{item.user.username}</span>{" "}
              {item.comment}
            </div>
          ))}
        </div>
        <form
          onSubmit={submitComment}
          className="mt-4 flex gap-2"
        >
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Drop a comment..."
            className="spark-input"
          />
          <button
            type="submit"
            className="spark-button px-4"
          >
            Send
          </button>
        </form>
      </div>
    </motion.article>
  );
};

export default PostCard;
