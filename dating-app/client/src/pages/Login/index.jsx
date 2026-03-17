import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleAuth, loginUser } from "../../redux/slices/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    identifier: "nova@spark.app",
    password: "password123",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await dispatch(loginUser(form)).unwrap();
    navigate("/home");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Welcome back</p>
      <h2 className="mt-3 font-display text-4xl font-semibold">Log into Spark</h2>
      <p className="mt-2 text-sm text-white/60">
        Your feed, matches, stories, and messages are waiting.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          className="spark-input"
          placeholder="Email or username"
          value={form.identifier}
          onChange={(event) => setForm((current) => ({ ...current, identifier: event.target.value }))}
        />
        <input
          type="password"
          className="spark-input"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="spark-button w-full">
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>

      {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
        <div className="mt-4 overflow-hidden rounded-2xl">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              await dispatch(googleAuth(credentialResponse.credential)).unwrap();
              navigate("/home");
            }}
            onError={() => null}
            theme="filled_black"
            shape="pill"
          />
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between text-sm text-white/[0.55]">
        <button type="button" className="hover:text-white">
          Forgot password
        </button>
        <Link to="/signup" className="hover:text-white">
          Create account
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
