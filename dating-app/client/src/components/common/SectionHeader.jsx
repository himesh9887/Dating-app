const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0">
      <span className="spark-badge px-3 py-1 text-white/54">Section</span>
      <h2 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight text-white">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/[0.58]">{subtitle}</p>
      ) : null}
    </div>
    {action}
  </div>
);

export default SectionHeader;
