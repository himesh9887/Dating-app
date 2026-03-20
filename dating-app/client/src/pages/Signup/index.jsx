import { motion } from "framer-motion";
import { ImagePlus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/authSlice";
import { interestOptions } from "../../utils/constants";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "Nova Lane",
    username: "novalane",
    email: "nova@spark.app",
    password: "password123",
    age: 23,
    gender: "Woman",
    location: "Bengaluru, India",
    bio: "Main character energy and better playlists.",
    interests: ["Music", "Travel", "Photography"],
    profilePhotos: null,
  });
  const redirectPath = location.state?.from || "/home";

  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest].slice(0, 5),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(signupUser(form)).unwrap();
      navigate(redirectPath, { replace: true });
    } catch (_error) {
      // Errors are surfaced via Redux state.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/62">
        <Sparkles size={14} />
        Start your era
      </div>

      <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
        Create your Spark profile
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Build a profile that looks intentional from day one with your vibe, bio, and key interests.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Name", "name"],
            ["Username", "username"],
            ["Email", "email", "sm:col-span-2"],
            ["Password", "password", "", "password"],
            ["Age", "age", "", "number"],
            ["Gender", "gender"],
            ["Location", "location"],
          ].map(([label, key, spanClass = "", type = "text"]) => (
            <label
              key={key}
              className={`glass-soft block p-4 ${spanClass}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                {label}
              </p>
              <input
                type={type}
                className="mt-3 w-full bg-transparent text-[15px] text-white placeholder:text-white/30"
                placeholder={label}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              />
            </label>
          ))}
        </div>

        <label className="glass-soft block p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Bio
          </p>
          <textarea
            className="mt-3 min-h-24 w-full resize-none bg-transparent text-[15px] leading-7 text-white placeholder:text-white/30"
            placeholder="Bio"
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          />
        </label>

        <label className="glass-soft flex cursor-pointer items-center gap-3 p-4">
          <ImagePlus size={18} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">Profile photos</p>
            <p className="mt-1 text-xs text-white/50">
              {form.profilePhotos?.length ? `${form.profilePhotos.length} file(s) selected` : "Upload profile photos to make your card stand out"}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => setForm((current) => ({ ...current, profilePhotos: event.target.files }))}
          />
        </label>

        <div className="glass-soft p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Interests
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  form.interests.includes(interest)
                    ? "bg-spark-button text-white shadow-glow"
                    : "border border-white/10 bg-white/5 text-white/70"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          className="spark-button w-full justify-center"
        >
          {status === "loading" ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="mt-5 text-sm text-white/[0.55]">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-white"
        >
          Login
        </Link>
      </div>
    </motion.div>
  );
};

export default SignupPage;
