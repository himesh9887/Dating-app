import { motion } from "framer-motion";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentPost, likePost } from "../../redux/slices/postSlice";
import { classNames, formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";
import { demoUser } from "../../utils/mockData";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user) || demoUser;
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const likes = post.likes || [];
  const comments = post.comments || [];
  const isLiked = likes.includes(currentUser._id);
  const likesCount = post.displayCounts?.likes ?? likes.length;
  const displayedLikes = (likesCount + (isLiked ? 1 : 0)).toLocaleString();

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
      className="mb-5 border-b border-[#262626] bg-black pb-4"
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex min-w-0 items-center">
          <img
            src={getPrimaryPhoto(post.author)}
            alt={post.author.name}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="ml-2 truncate text-[13px] font-semibold text-white">
            {post.author.username}
          </span>
        </div>
        <button
          type="button"
          className="text-white transition-all duration-300 active:scale-95"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.media?.[0] ? (
        <img
          src={post.media[0].url}
          alt={post.caption}
          className="aspect-square w-full object-cover"
        />
      ) : null}

      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => dispatch(likePost(post._id))}
            className="text-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Like post"
          >
            <Heart
              size={23}
              className={classNames(isLiked ? "fill-current text-[#ed4956]" : "")}
            />
          </button>
          <button
            type="button"
            onClick={() => setShowComposer((current) => !current)}
            className="text-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Comment on post"
          >
            <MessageCircle size={23} />
          </button>
          <button
            type="button"
            className="text-white transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Share post"
          >
            <Send size={23} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSaved((current) => !current)}
          className="text-white transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label={saved ? "Remove from saved" : "Save post"}
        >
          <Bookmark size={23} className={saved ? "fill-current" : ""} />
        </button>
      </div>

      <p className="px-3 text-[13px] font-semibold text-white">
        {displayedLikes} likes
      </p>

      <p className="px-3 pt-1 text-[13px] leading-5 text-white">
        <span className="font-semibold">{post.author.username}</span>{" "}
        <span>{post.caption}</span>
      </p>

      {comments.length ? (
        <button
          type="button"
          onClick={() => setShowComposer((current) => !current)}
          className="px-3 pt-1 text-left text-[13px] text-[#a8a8a8]"
        >
          View all {comments.length} comments
        </button>
      ) : null}

      <p className="px-3 pt-1 text-[10px] uppercase tracking-[0.08em] text-[#a8a8a8]">
        {post.displayAge || formatTimeAgo(post.createdAt)}
      </p>

      {showComposer ? (
        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center gap-2 px-3 pt-3"
        >
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a comment..."
            className="min-w-0 flex-1 border-none bg-transparent p-0 text-[13px] text-white placeholder:text-[#a8a8a8]"
          />
          <button
            type="submit"
            className="text-[13px] font-semibold text-[#0095f6] transition-all duration-300 active:scale-95"
          >
            Post
          </button>
        </form>
      ) : null}
    </motion.article>
  );
};

export default Post;
