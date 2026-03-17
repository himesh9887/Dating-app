import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: null },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const locationSchema = new mongoose.Schema(
  {
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    label: { type: String, default: "" },
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [77.5946, 12.9716],
      },
    },
  },
  { _id: false },
);

const userLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "superlike"],
      default: "like",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    age: { type: Number, min: 18, max: 99, default: 18 },
    gender: { type: String, default: "Prefer not to say" },
    bio: { type: String, default: "" },
    interests: [{ type: String }],
    profilePhotos: { type: [photoSchema], default: [] },
    location: {
      type: locationSchema,
      default: () => ({}),
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: { type: [userLikeSchema], default: [] },
    passes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    privacy: {
      isPrivate: { type: Boolean, default: false },
      showLocation: { type: Boolean, default: true },
      showActivity: { type: Boolean, default: true },
    },
    subscription: {
      isPremium: { type: Boolean, default: true },
      plan: { type: String, enum: ["free", "gold", "platinum"], default: "gold" },
      boostedUntil: { type: Date, default: null },
    },
    oauthProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    lastActiveAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.index({ "location.coordinates": "2dsphere" });
userSchema.index({ username: 1, email: 1 });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
