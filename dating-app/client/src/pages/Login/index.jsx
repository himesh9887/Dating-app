import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleAuth, loginUser } from "../../redux/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    identifier: "nova@spark.app",
    password: "password123",
  });
  const redirectPath = location.state?.from || "/home";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(loginUser(form)).unwrap();
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
        Welcome back
      </div>

      <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Log into Spark</h2>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Your feed, matches, stories, and messages are waiting exactly where you left them.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          ["Fast access", "Login and jump straight into your conversations."],
          ["Protected", "Session token and profile state stay synced securely."],
        ].map(([title, description]) => (
          <div
            key={title}
            className="glass-soft p-4"
          >
            <p className="text-sm font-medium text-white">{title}</p>
            <p className="mt-2 text-xs leading-5 text-white/52">{description}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
      >
        <label className="glass-soft block p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Email or username
          </p>
          <input
            className="mt-3 w-full bg-transparent text-[15px] text-white placeholder:text-white/30"
            placeholder="Email or username"
            value={form.identifier}
            onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))}
          />
        </label>

        <label className="glass-soft block p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Password
            </p>
            <KeyRound
              size={14}
              className="text-white/30"
            />
          </div>
          <input
            type="password"
            className="mt-3 w-full bg-transparent text-[15px] text-white placeholder:text-white/30"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </label>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/62">
          Demo access is enabled, so if backend auth is unavailable you can still enter the app and test the full flow.
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          className="spark-button w-full justify-center"
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <div className="mt-4 overflow-hidden rounded-2xl">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await dispatch(googleAuth(credentialResponse.credential)).unwrap();
                navigate(redirectPath, { replace: true });
              } catch (_error) {
                // Errors are surfaced via Redux state.
              }
            }}
            onError={() => null}
            theme="filled_black"
            shape="pill"
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-white/[0.55]">
        <button
          type="button"
          className="inline-flex items-center gap-2 hover:text-white"
        >
          <ShieldCheck size={14} />
          Forgot password
        </button>
        <Link
          to="/signup"
          className="hover:text-white"
        >
          Create account
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
