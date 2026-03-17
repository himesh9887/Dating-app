import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "../../services/postService";
import { demoUser } from "../../utils/mockData";
import { normalizeError } from "../../utils/helpers";

export const fetchFeed = createAsyncThunk(
  "posts/fetchFeed",
  async (page = 1, { rejectWithValue }) => {
    try {
      return await postService.fetchFeed(page);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load feed"));
    }
  },
);

export const fetchStories = createAsyncThunk(
  "posts/fetchStories",
  async (_, { rejectWithValue }) => {
    try {
      return await postService.fetchStories();
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to load stories"));
    }
  },
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (payload, { rejectWithValue }) => {
    try {
      return await postService.createPost({
        ...payload,
        author: {
          _id: demoUser._id,
          username: demoUser.username,
          name: demoUser.name,
          profilePhotos: demoUser.profilePhotos,
        },
      });
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to create post"));
    }
  },
);

export const createStory = createAsyncThunk(
  "posts/createStory",
  async (file, { rejectWithValue }) => {
    try {
      return await postService.createStory(file);
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to post story"));
    }
  },
);

export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      await postService.likePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to like post"));
    }
  },
);

export const commentPost = createAsyncThunk(
  "posts/commentPost",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      await postService.commentOnPost(postId, comment);
      return { postId, comment };
    } catch (error) {
      return rejectWithValue(normalizeError(error, "Unable to comment"));
    }
  },
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    feed: [],
    stories: [],
    page: 1,
    hasMore: true,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feed =
          action.payload.page > 1
            ? [...state.feed, ...action.payload.posts]
            : action.payload.posts;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.stories = action.payload.stories;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload.story);
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.feed.unshift(action.payload.post);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.feed.find((item) => item._id === action.payload);

        if (post) {
          const alreadyLiked = post.likes.includes(demoUser._id);
          post.likes = alreadyLiked
            ? post.likes.filter((id) => id !== demoUser._id)
            : [...post.likes, demoUser._id];
        }
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const post = state.feed.find((item) => item._id === action.payload.postId);

        if (post) {
          post.comments.push({
            _id: `comment-${Date.now()}`,
            user: {
              username: demoUser.username,
              profilePhotos: demoUser.profilePhotos,
            },
            comment: action.payload.comment,
          });
        }
      });
  },
});

export default postSlice.reducer;
