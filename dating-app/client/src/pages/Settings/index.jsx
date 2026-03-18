import { Crown, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionHeader from "../../components/common/SectionHeader";
import { activateBoost, updateProfile } from "../../redux/slices/userSlice";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const boostUntil = useSelector((state) => state.user.boostUntil);
  const [form, setForm] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    location: authUser?.location?.label || "",
    isPrivate: false,
    showLocation: true,
    showActivity: true,
  });

  return (
    <div className="space-y-5">
      <div className="glass-panel p-5 lg:p-6">
        <SectionHeader title="Settings" subtitle="Edit your profile, privacy, and premium tools." />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              dispatch(updateProfile(form));
            }}
            className="glass-soft space-y-4 p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="spark-input"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Name"
              />
              <input
                className="spark-input"
                value={form.location}
                onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                placeholder="Location"
              />
            </div>
            <textarea
              className="spark-input min-h-28"
              value={form.bio}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              placeholder="Bio"
            />
            {[
              ["Private profile", "isPrivate"],
              ["Show location", "showLocation"],
              ["Show activity", "showActivity"],
            ].map(([label, key]) => (
              <label key={key} className="glass-soft flex items-center justify-between p-4">
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))}
                  className="h-4 w-4 accent-pink-500"
                />
              </label>
            ))}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="spark-button">
                Save changes
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    name: authUser?.name || "",
                    bio: authUser?.bio || "",
                    location: authUser?.location?.label || "",
                    isPrivate: false,
                    showLocation: true,
                    showActivity: true,
                  })
                }
                className="spark-button-ghost"
              >
                Reset
              </button>
            </div>
          </form>
          <div className="space-y-4">
            <div className="glass-soft p-5">
              <div className="inline-flex rounded-2xl bg-spark-button p-3 shadow-glow">
                <Crown size={18} />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">Spark Gold</h3>
              <p className="mt-2 text-sm text-white/60">
                Unlimited likes, advanced filters, profile boost, and who-liked-you
                insights.
              </p>
              <button
                type="button"
                onClick={() => dispatch(activateBoost())}
                className="spark-button mt-5 w-full"
              >
                <Zap size={16} className="mr-2" />
                Boost profile
              </button>
              {boostUntil ? (
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-spark-mint">
                  Active until {new Date(boostUntil).toLocaleTimeString()}
                </p>
              ) : null}
            </div>
            <div className="glass-soft p-5">
              <div className="inline-flex rounded-2xl bg-white/10 p-3 text-spark-blue">
                <Shield size={18} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">Safety controls</h3>
              <p className="mt-2 text-sm text-white/60">
                Manage blocked users, change your password, and control visibility.
              </p>
              <div className="mt-5 grid gap-3">
                <button type="button" className="spark-button-ghost w-full justify-center">
                  Blocked users
                </button>
                <button type="button" className="spark-button-ghost w-full justify-center">
                  Change password
                </button>
              </div>
            </div>
            <div className="glass-soft p-5">
              <h3 className="font-display text-xl font-semibold">Account snapshot</h3>
              <p className="mt-2 text-sm text-white/60">
                Profile edits update your app identity across feed, discover, and chat.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  ["Current plan", authUser?.subscription?.plan || "free"],
                  ["Followers", authUser?.followers?.length || 0],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/40">{label}</p>
                    <p className="mt-2 font-display text-2xl font-semibold capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
