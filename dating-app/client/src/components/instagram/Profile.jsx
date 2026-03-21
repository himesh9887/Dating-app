import {
  AtSign,
  ChevronLeft,
  Clapperboard,
  Grid3X3,
  Link2,
  MapPin,
  MessageCircleHeart,
  Pin,
  Plus,
  Repeat2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getPrimaryPhoto } from "../../utils/helpers";
import { demoProfileGrid, demoProfileHighlights } from "../../utils/mockData";

const profileTabs = [
  { key: "posts", label: "Posts", icon: Grid3X3 },
  { key: "reels", label: "Reels", icon: Clapperboard },
  { key: "remix", label: "Remix", icon: Repeat2 },
];

const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );

const normalizeBioLines = (bio) =>
  bio?.trim()
    ? bio
        .split(/\r?\n/)
        .map((line) => line.replace(/^[*-]\s*/, "").trim())
        .filter(Boolean)
    : [
        "Polished profile identity with better spacing.",
        "Stronger first impression across discover and chat.",
      ];

const resolveProfileLink = (user) => {
  const value =
    user?.website ||
    user?.socialLinks?.youtube ||
    user?.socialLinks?.instagram ||
    "spark.app/profile";

  return value.replace(/^https?:\/\//i, "");
};

const Profile = ({ user, resolvedUsername, isOwnProfile }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const displayName = user?.name || "Spark User";
  const bioLines = normalizeBioLines(user?.bio);
  const profileHandle = user?.username || resolvedUsername;
  const profileStats = [
    { label: "Posts", value: demoProfileGrid.length },
    { label: "Followers", value: user?.followers?.length || 523 },
    { label: "Following", value: user?.following?.length || 131 },
    { label: "Matches", value: user?.matches?.length || 0 },
  ];
  const buttons = isOwnProfile ? ["Edit profile", "Share profile"] : ["Follow", "Message"];
  const interests = user?.interests?.slice(0, 5) || [];

  return (
    <div className="px-1 pb-4 sm:px-0">
      <section className="glass-panel relative overflow-hidden p-5 sm:p-7 lg:p-8">
        <div className="absolute inset-0 spark-grid-bg opacity-[0.14]" />
        <div className="absolute inset-0">
          <img
            src={getPrimaryPhoto(user)}
            alt={displayName}
            className="h-full w-full object-cover opacity-[0.2]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,26,0.45),rgba(6,17,26,0.92))]" />
        </div>

        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/home"
              className="spark-button-ghost"
            >
              <ChevronLeft size={16} />
              Back to feed
            </Link>
            <span className="spark-badge">
              <AtSign size={12} />
              {profileHandle}
            </span>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-end">
            <div className="relative mx-auto lg:mx-0">
              <div className="rounded-full bg-spark-gradient p-[3px] shadow-glow">
                <img
                  src={getPrimaryPhoto(user)}
                  alt={displayName}
                  className="h-32 w-32 rounded-full border-[5px] border-spark-base object-cover sm:h-40 sm:w-40"
                />
              </div>
              {isOwnProfile ? (
                <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-spark-gradient text-spark-base shadow-glow">
                  <Plus size={18} strokeWidth={2.7} />
                </span>
              ) : null}
            </div>

            <div>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/34">
                    Public profile
                  </p>
                  <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
                    {displayName}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/58">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {user?.location?.label || user?.location || "Location hidden"}
                    </span>
                    <span className="text-white/24">&bull;</span>
                    <span>{user?.subscription?.plan || "free"} plan</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {buttons.map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={label === "Message" ? "spark-button" : "spark-button-ghost"}
                    >
                      {label === "Message" ? <MessageCircleHeart size={16} /> : null}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {profileStats.map((item) => (
                  <div
                    key={item.label}
                    className="spark-stat"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/36">
                      {item.label}
                    </p>
                    <p className="mt-3 font-display text-3xl font-semibold text-white">
                      {formatCompactNumber(item.value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <section className="glass-panel p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
            About
          </p>
          <div className="mt-4 space-y-4">
            <div className="glass-soft p-4">
              <p className="text-sm font-semibold text-white">Bio</p>
              <div className="mt-3 space-y-2 text-sm leading-7 text-white/66">
                {bioLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="glass-soft p-4">
              <p className="text-sm font-semibold text-white">Profile link</p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-spark-cyan">
                <Link2 size={14} />
                {resolveProfileLink(user)}
              </p>
            </div>

            <div className="glass-soft p-4">
              <p className="text-sm font-semibold text-white">Interests</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.length ? (
                  interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-white/72"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white/54">No interests added yet.</span>
                )}
              </div>
            </div>

            <div className="glass-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Highlights</p>
                <span className="text-xs uppercase tracking-[0.22em] text-white/38">
                  Stories
                </span>
              </div>
              <div className="spark-scrollbar mt-4 flex gap-4 overflow-x-auto pb-1">
                {demoProfileHighlights.map((item) => (
                  <div
                    key={item._id}
                    className="w-[84px] shrink-0 text-center"
                  >
                    {item.isAdd ? (
                      <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                        <Plus size={22} />
                      </div>
                    ) : (
                      <div className="rounded-full bg-spark-gradient p-[2px]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-[74px] w-[74px] rounded-full border-2 border-spark-base object-cover"
                        />
                      </div>
                    )}
                    <p className="mt-2 truncate text-[11px] text-white/72">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
                Content
              </p>
              <h2 className="mt-2 font-display text-[1.8rem] font-semibold text-white">
                Profile media wall
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profileTabs.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-white/16 bg-white/[0.08] text-white"
                        : "border-white/10 bg-white/[0.04] text-white/62"
                    }`}
                  >
                    <Icon size={15} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {demoProfileGrid.map((item) => (
              <article
                key={item._id}
                className="group relative aspect-square overflow-hidden rounded-[26px] border border-white/10 bg-spark-panel"
              >
                <img
                  src={item.image}
                  alt={item._id}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spark-base via-transparent to-transparent" />
                {item.pinned ? (
                  <Pin
                    size={15}
                    className="absolute right-3 top-3 fill-current text-white"
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/66 backdrop-blur-xl">
                    {formatCompactNumber(item.views)} views
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
