const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
        Section
      </p>
      <h2 className="mt-2 font-display text-[1.65rem] font-semibold leading-tight text-white">
        {title}
      </h2>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-6 text-white/[0.55]">{subtitle}</p> : null}
    </div>
    {action}
  </div>
);

export default SectionHeader;
