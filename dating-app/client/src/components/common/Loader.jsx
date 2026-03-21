const Loader = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-sm text-white/60">
    <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-spark-cyan" />
    <span className="h-3.5 w-3.5 animate-pulse rounded-full bg-spark-coral [animation-delay:150ms]" />
    <span>{label}</span>
  </div>
);

export default Loader;
