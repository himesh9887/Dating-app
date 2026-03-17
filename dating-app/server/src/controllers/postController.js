import Post from "../models/Post.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotification.js";
import { uploadFiles } from "../utils/uploadMedia.js";

const parseArrayField = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    return [];
  }
};

export const getFeed = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const authors = [req.user._id, ...req.user.following];

  const posts = await Post.find({ author: { $in: authors } })
    .populate("author", "name username profilePhotos location")
    .populate("comments.user", "username profilePhotos")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit + 1);

  const hasMore = posts.length > limit;

  res.json({
    posts: hasMore ? posts.slice(0, limit) : posts,
    page,
    hasMore,
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const uploads = await uploadFiles(req.files || [], "spark/posts");

  const post = await Post.create({
    author: req.user._id,
    media: uploads,
    caption: req.body.caption || "",
    hashtags: parseArrayField(req.body.hashtags),
  });

  const populatedPost = await Post.findById(post._id).populate(
    "author",
    "name username profilePhotos",
  );

  res.status(201).json({
    message: "Post created",
    post: populatedPost,
  });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "username profilePhotos",
  );

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  const userId = String(req.user._id);
  const liked = post.likes.some((id) => String(id) === userId);

  if (liked) {
    post.likes = post.likes.filter((id) => String(id) !== userId);
  } else {
    post.likes.push(req.user._id);

    if (String(post.author._id) !== userId) {
      await createNotification({
        recipient: post.author._id,
        actor: req.user._id,
        type: "like",
        title: `${req.user.username} liked your post`,
        entityId: post._id,
        io: req.app.get("io"),
      });
    }
  }

  await post.save();

  res.json({
    message: liked ? "Post unliked" : "Post liked",
    likes: post.likes.length,
  });
});

export const commentOnPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "username");

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  post.comments.push({
    user: req.user._id,
    comment: req.body.comment,
  });

  await post.save();

  if (String(post.author._id) !== String(req.user._id)) {
    await createNotification({
      recipient: post.author._id,
      actor: req.user._id,
      type: "comment",
      title: `${req.user.username} commented on your post`,
      body: req.body.comment,
      entityId: post._id,
      io: req.app.get("io"),
    });
  }

  const populated = await Post.findById(post._id).populate(
    "comments.user",
    "username profilePhotos",
  );

  res.json({
    message: "Comment added",
    post: populated,
  });
});

export const sharePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { shareCount: 1 } },
    { new: true },
  );

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: "Post shared", shareCount: post.shareCount });
});

export const createStory = asyncHandler(async (req, res) => {
  const uploads = await uploadFiles(req.files || [], "spark/stories");

  if (!uploads.length) {
    const error = new Error("Story media is required");
    error.statusCode = 400;
    throw error;
  }

  const story = await Story.create({
    author: req.user._id,
    media: uploads[0],
    caption: req.body.caption || "",
  });

  const populatedStory = await Story.findById(story._id).populate(
    "author",
    "name username profilePhotos",
  );

  res.status(201).json({
    message: "Story uploaded",
    story: populatedStory,
  });
});

export const getStories = asyncHandler(async (req, res) => {
  const authors = [req.user._id, ...req.user.following];

  const stories = await Story.find({
    author: { $in: authors },
    expiresAt: { $gt: new Date() },
  })
    .populate("author", "name username profilePhotos")
    .sort({ createdAt: -1 });

  res.json({ stories });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const posts = await Post.find({ author: user._id })
    .populate("author", "name username profilePhotos")
    .sort({ createdAt: -1 });

  res.json({ posts });
});
