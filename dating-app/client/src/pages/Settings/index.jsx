import { Crown, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import { activateBoost, updateProfile } from "../../redux/slices/userSlice";

const buildInitialForm = (authUser) => ({
  name: authUser?.name || "",
  bio: authUser?.bio || "",
  location: authUser?.location?.label || authUser?.location || "",
  isPrivate: false,
  showLocation: true,
  showActivity: true,
});

const SettingsPage = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const boostUntil = useSelector((state) => state.user.boostUntil);
  const [form, setForm] = useState(() => buildInitialForm(authUser));
  const [saveState, setSaveState] = useState("idle");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    setForm(buildInitialForm(authUser));
  }, [authUser]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaveState("loading");
    setSaveMessage("");

    try {
      await dispatch(updateProfile(form)).unwrap();
      setSaveState("succeeded");
      setSaveMessage("Profile changes saved successfully.");
    } catch (_error) {
      setSaveState("failed");
      setSaveMessage("We could not save your changes right now.");
    }
  };

  const handleBoost = async () => {
    try {
      await dispatch(activateBoost()).unwrap();
      setSaveMessage("Boost activated. Your profile is getting extra reach now.");
    } catch (_error) {
      setSaveMessage("Boost could not be activated right now.");
    }
  };

  return (
    <PageShell
      eyebrow="Profile studio"
      title="Control how your profile looks and feels"
      subtitle="Update the identity people see across feed, discover, matches, and chat while keeping premium tools and privacy controls within reach."
      stats={[
        { label: "Current plan", value: authUser?.subscription?.plan || "free", meta: "Plan" },
        { label: "Followers", value: authUser?.followers?.length || 0, meta: "Audience" },
        {
          label: "Boost status",
          value: boostUntil ? "Active" : "Inactive",
          meta: boostUntil ? "Live" : "Ready",
        },
      ]}
    >
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="glass-panel p-5 lg:p-6">
          <SectionHeader
            title="Edit profile"
            subtitle="Fine-tune your basics, public bio, and visibility preferences from one place."
          />

          <form
            onSubmit={handleSave}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="glass-soft p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Name
                </p>
                <input
                  className="mt-3 w-full bg-transparent text-[15px] text-white placeholder:text-white/30"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Your display name"
                />
              </label>
              <label className="glass-soft p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Location
                </p>
                <input
                  className="mt-3 w-full bg-transparent text-[15px] text-white placeholder:text-white/30"
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                  placeholder="City or area"
                />
              </label>
            </div>

            <label className="glass-soft block p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Bio
              </p>
              <textarea
                className="mt-3 min-h-32 w-full resize-none bg-transparent text-[15px] leading-7 text-white placeholder:text-white/30"
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                placeholder="Tell people what kind of energy you bring."
              />
            </label>

            <div className="grid gap-3">
              {[
                ["Private profile", "Only approved followers can see everything.", "isPrivate"],
                ["Show location", "Let people see how close you are.", "showLocation"],
                ["Show activity", "Surface your recent app activity and momentum.", "showActivity"],
              ].map(([label, description, key]) => (
                <label
                  key={key}
                  className="glass-soft flex items-center justify-between gap-4 p-4"
                >
                  <div>
                    <p className="text-[15px] font-medium text-white">{label}</p>
                    <p className="mt-1 text-sm text-white/50">{description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.checked }))}
                    className="h-4 w-4 accent-pink-500"
                  />
                </label>
              ))}
            </div>

            {saveMessage ? (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
                {saveMessage}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="spark-button"
              >
                {saveState === "loading" ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(buildInitialForm(authUser));
                  setSaveMessage("Profile form reset to current account values.");
                  setSaveState("idle");
                }}
                className="spark-button-ghost"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-5">
          <section className="glass-panel p-5">
            <div className="inline-flex rounded-2xl bg-spark-button p-3 shadow-glow">
              <Crown size={18} />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">Spark Gold</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Unlimited likes, advanced filters, profile boost, and visibility into who already likes you.
            </p>
            <button
              type="button"
              onClick={handleBoost}
              className="spark-button mt-5 w-full"
            >
              <Zap
                size={16}
                className="mr-2"
              />
              Boost profile
            </button>
            {boostUntil ? (
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-spark-mint">
                Active until {new Date(boostUntil).toLocaleTimeString()}
              </p>
            ) : null}
          </section>

          <section className="glass-panel p-5">
            <div className="inline-flex rounded-2xl bg-white/10 p-3 text-spark-blue">
              <Shield size={18} />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">Safety controls</h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Manage visibility, account access, and the boundaries that make your app experience feel safe.
            </p>
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                className="spark-button-ghost w-full justify-center"
              >
                Blocked users
              </button>
              <button
                type="button"
                className="spark-button-ghost w-full justify-center"
              >
                Change password
              </button>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
};

export default SettingsPage;
