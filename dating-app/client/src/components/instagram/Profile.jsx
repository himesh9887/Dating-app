import {
  AtSign,
  Camera,
  ChevronDown,
  Clapperboard,
  Grid3X3,
  Link2,
  Menu,
  Pin,
  Play,
  Plus,
  Repeat2,
} from "lucide-react";
import { getPrimaryPhoto } from "../../utils/helpers";
import { demoProfileGrid, demoProfileHighlights } from "../../utils/mockData";

const fallbackBioLines = [
  '"Creator by passion | Dreamer by heart"',
  '"YouTuber | Student | Learner"',
  '"On a journey - One video at a time"',
];

const profileTabs = [
  { key: "posts", icon: Grid3X3, active: true },
  { key: "reels", icon: Clapperboard, active: false },
  { key: "remix", icon: Repeat2, active: false },
  { key: "tagged", icon: Camera, active: false },
];

const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );

const normalizeBioLines = (bio) => {
  if (!bio?.trim()) {
    return fallbackBioLines;
  }

  return bio
    .split(/\r?\n/)
    .map((line) => line.replace(/^[*-]\s*/, "").trim())
    .filter(Boolean);
};

const resolveProfileLink = (user) => {
  const value =
    user?.website ||
    user?.socialLinks?.youtube ||
    user?.socialLinks?.instagram ||
    "youtube.com/@hr_shorts079";

  return value.replace(/^https?:\/\//i, "");
};

const Profile = ({ user, resolvedUsername, isOwnProfile }) => {
  const displayName = user?.name || "Instagram User";
  const bioLines = normalizeBioLines(user?.bio);
  const profileHandle = user?.username || resolvedUsername;
  const profileStats = [
    { label: "posts", value: 11 },
    { label: "followers", value: 523 },
    { label: "following", value: 131 },
  ];
  const buttons = isOwnProfile ? ["Edit profile", "Share profile"] : ["Follow", "Message"];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#262626] bg-black/95 px-4 py-3 backdrop-blur-xl">
        <button
          type="button"
          className="instagram-icon-button"
          aria-label="Add profile content"
        >
          <Plus size={25} strokeWidth={2} />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 text-[1rem] font-semibold"
        >
          <span>{profileHandle}</span>
          <ChevronDown size={18} />
        </button>

        <button
          type="button"
          className="instagram-icon-button"
          aria-label="Profile menu"
        >
          <Menu size={25} strokeWidth={2} />
        </button>
      </header>

      <section className="px-4 py-4">
        <div className="flex items-center gap-6">
          <div className="relative shrink-0">
            <img
              src={getPrimaryPhoto(user)}
              alt={displayName}
              className="h-[78px] w-[78px] rounded-full object-cover"
            />
            <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-white text-black">
              <Plus size={13} strokeWidth={3} />
            </span>
          </div>

          <div className="flex w-full justify-between text-center">
            {profileStats.map((item) => (
              <div key={item.label}>
                <p className="text-[17px] font-semibold leading-none text-white">{item.value}</p>
                <p className="mt-1 text-[13px] text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <p className="text-[14px] font-semibold text-white">{displayName}</p>
          <p className="text-[13px] text-[#a8a8a8]">Education</p>
          <div className="mt-2 space-y-1 text-[14px] leading-5 text-white">
            {bioLines.map((line) => (
              <p key={line}>&bull; {line}</p>
            ))}
          </div>
          <p className="mt-2 inline-flex items-center gap-2 text-[14px] text-[#e0f1ff]">
            <Link2 size={14} />
            {resolveProfileLink(user)}
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-[14px] font-semibold text-white">
            <AtSign size={14} />
            {profileHandle}
          </p>
        </div>

        <div className="mt-3 flex gap-2">
          {buttons.map((label) => (
            <button
              key={label}
              type="button"
              className="flex-1 rounded-md border border-[#4b4b4b] py-1.5 text-[14px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>

        <div className="spark-scrollbar mt-4 flex gap-4 overflow-x-auto">
          {demoProfileHighlights.map((item) => (
            <div
              key={item._id}
              className="w-[68px] shrink-0 text-center"
            >
              {item.isAdd ? (
                <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border border-[#4b4b4b]">
                  <Plus size={22} />
                </div>
              ) : (
                <div className="rounded-full border border-[#262626] p-[2px]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[60px] w-[60px] rounded-full object-cover"
                  />
                </div>
              )}
              <p className="mt-1 truncate text-[11px] text-white">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[#262626] border-b border-[#262626]">
        <div className="grid grid-cols-4">
          {profileTabs.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                className={`relative flex items-center justify-center py-3 ${
                  item.active ? "text-white" : "text-[#a8a8a8]"
                }`}
                aria-label={item.key}
              >
                <Icon size={20} strokeWidth={1.9} />
                {item.active ? (
                  <span className="absolute inset-x-5 bottom-0 h-0.5 bg-white" />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-[2px]">
        {demoProfileGrid.map((item) => (
          <article
            key={item._id}
            className="relative aspect-square overflow-hidden bg-[#0f0f0f]"
          >
            <img
              src={item.image}
              alt={item._id}
              className="h-full w-full object-cover"
            />
            {item.pinned ? (
              <Pin
                size={15}
                className="absolute right-2 top-2 fill-current text-white"
              />
            ) : null}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
              <Play size={12} className="fill-current" />
              <span className="text-[10px] font-semibold">{formatCompactNumber(item.views)}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Profile;
