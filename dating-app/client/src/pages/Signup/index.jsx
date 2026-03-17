import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/authSlice";
import { interestOptions } from "../../utils/constants";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    await dispatch(signupUser(form)).unwrap();
    navigate("/home");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">Start your era</p>
      <h2 className="mt-3 font-display text-4xl font-semibold">Create your Spark profile</h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="spark-input" placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input className="spark-input" placeholder="Username" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
          <input className="spark-input sm:col-span-2" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <input type="password" className="spark-input" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          <input type="number" className="spark-input" placeholder="Age" value={form.age} onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))} />
          <input className="spark-input" placeholder="Gender" value={form.gender} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))} />
          <input className="spark-input" placeholder="Location" value={form.location} onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} />
        </div>
        <textarea className="spark-input min-h-24" placeholder="Bio" value={form.bio} onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} />
        <input type="file" accept="image/*" className="spark-input" onChange={(event) => setForm((current) => ({ ...current, profilePhotos: event.target.files }))} />
        <div className="flex flex-wrap gap-2">
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
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button type="submit" className="spark-button w-full">
          {status === "loading" ? "Creating account..." : "Create account"}
        </button>
      </form>
      <div className="mt-5 text-sm text-white/[0.55]">
        Already have an account?{" "}
        <Link to="/login" className="text-white">
          Login
        </Link>
      </div>
    </motion.div>
  );
};

export default SignupPage;
