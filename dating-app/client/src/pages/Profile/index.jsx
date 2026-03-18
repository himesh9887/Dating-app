import {
  AtSign,
  Camera,
  ChevronDown,
  Clapperboard,
  Grid3X3,
  Menu,
  Pin,
  Play,
  Plus,
  Repeat2,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProfile } from "../../redux/slices/userSlice";
import { getPrimaryPhoto } from "../../utils/helpers";
import {
  demoProfileGrid,
  demoProfileHighlights,
  demoUser,
} from "../../utils/mockData";

const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { username } = useParams();
  const authUser = useSelector((state) => state.auth.user);
  const profile = useSelector((state) => state.user.profile);
  const user = profile || authUser || demoUser;
  const resolvedUsername = username || user.username || demoUser.username;
  const profileStats = {
    posts: 11,
    followers: 523,
    following: 131,
    dashboardViews: "5.0K",
  };
  const bioLines = [
    '"Creator by passion | Dreamer by heart"',
    '"YouTuber | Student | Learner"',
    '"On a journey | One video at a time"',
  ];

  useEffect(() => {
    dispatch(fetchProfile(resolvedUsername));
  }, [dispatch, resolvedUsername]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 pb-24 pt-4 lg:px-8 lg:pb-10">
        <header className="mb-6 flex items-center justify-between lg:hidden">
          <button type="button" className="instagram-icon-button">
            <Plus size={34} strokeWidth={1.8} />
          </button>
          <button type="button" className="flex items-center gap-2 text-[1.15rem] font-semibold">
            <span>{resolvedUsername}</span>
            <ChevronDown size={18} />
          </button>
          <div className="flex items-center gap-2">
            <button type="button" className="relative instagram-icon-button">
              <AtSign size={28} strokeWidth={2.1} />
              <span className="absolute -right-0.5 -top-0.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-1 text-sm font-semibold">
                9+
              </span>
            </button>
            <button type="button" className="instagram-icon-button">
              <Menu size={34} strokeWidth={1.8} />
            </button>
          </div>
        </header>

        <div className="hidden items-center justify-between rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-5 lg:flex">
          <div>
            <p className="text-sm text-white/50">@{resolvedUsername}</p>
            <h1 className="mt-1 text-3xl font-semibold">{user.name || "Profile"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="spark-button-ghost">
              Edit profile
            </button>
            <button type="button" className="spark-button">Share profile</button>
          </div>
        </div>

        <section className="mt-2 lg:mt-6">
          <div className="flex gap-4">
            <div className="relative shrink-0">
              <div className="absolute -top-8 left-0 rounded-[18px] bg-[#23262d] px-4 py-2 text-sm text-white/70">
                Inspo needed...
              </div>
              <img
                src={getPrimaryPhoto(user)}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover lg:h-32 lg:w-32"
              />
              <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-black">
                <Plus size={18} strokeWidth={2.5} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[1.1rem] font-semibold lg:text-3xl">{user.name}</h2>
                  <p className="mt-1 text-sm text-white/60">{user.location?.label || "Education"}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-left lg:max-w-xl">
                {[
                  ["posts", profileStats.posts],
                  ["followers", profileStats.followers],
                  ["following", profileStats.following],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[2rem] font-semibold leading-none lg:text-[2.4rem]">
                      {value}
                    </p>
                    <p className="mt-1 text-sm text-white/75">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-1 text-[15px] leading-7 text-white/92">
            {bioLines.map((line) => (
              <p key={line}>&bull; {line}</p>
            ))}
            <p className="truncate text-[#9cb6ff]">
              youtube.com/@hr_shorts079?si=x7_0EdFBpMhtS...
            </p>
            <p className="text-[1.2rem] font-semibold">@{resolvedUsername}</p>
          </div>
        </section>

        <section className="mt-6 rounded-[24px] bg-[#23262d] p-5">
          <p className="text-[1.1rem] font-semibold">Professional dashboard</p>
          <p className="mt-1 text-lg text-white/70">
            <span className="text-emerald-400">↗</span> {profileStats.dashboardViews} views in the last 30 days.
          </p>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button type="button" className="rounded-2xl bg-[#23262d] px-4 py-4 text-lg font-semibold">
            Edit profile
          </button>
          <button type="button" className="rounded-2xl bg-[#23262d] px-4 py-4 text-lg font-semibold">
            Share profile
          </button>
        </div>

        <section className="mt-6">
          <div className="spark-scrollbar flex gap-5 overflow-x-auto pb-2">
            {demoProfileHighlights.map((item) => (
              <div key={item._id} className="w-[92px] shrink-0 text-center">
                {item.isAdd ? (
                  <div className="flex h-[92px] w-[92px] items-center justify-center rounded-full border border-white/80 text-white">
                    <Plus size={30} />
                  </div>
                ) : (
                  <div className="rounded-full border border-white/10 p-[4px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-[84px] w-[84px] rounded-full object-cover"
                    />
                  </div>
                )}
                <p className="mt-3 truncate text-[13px] text-white/85">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 border-b border-white/10">
          <div className="grid grid-cols-4">
            {[
              { key: "posts", icon: Grid3X3, active: true },
              { key: "reels", icon: Clapperboard },
              { key: "loops", icon: Repeat2 },
              { key: "tagged", icon: Camera },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  type="button"
                  className={`relative flex items-center justify-center py-4 ${
                    item.active ? "text-white" : "text-white/55"
                  }`}
                >
                  <Icon size={30} strokeWidth={1.8} />
                  {item.active ? (
                    <span className="absolute inset-x-5 bottom-0 h-1 rounded-full bg-white" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-[1px] pt-[1px]">
          {demoProfileGrid.map((item) => (
            <article key={item._id} className="relative aspect-square overflow-hidden bg-[#111]">
              <img
                src={item.image}
                alt={item._id}
                className="h-full w-full object-cover"
              />
              {item.pinned ? (
                <Pin
                  size={18}
                  className="absolute right-3 top-3 fill-current text-white"
                />
              ) : null}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                <Play size={15} className="fill-current" />
                <span className="text-[13px] font-medium">{formatCompactNumber(item.views)}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
