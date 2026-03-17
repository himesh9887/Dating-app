const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-sm text-white/60">
    <span className="h-3 w-3 animate-pulse rounded-full bg-spark-pink" />
    <span>{label}</span>
  </div>
);

export default Loader;
