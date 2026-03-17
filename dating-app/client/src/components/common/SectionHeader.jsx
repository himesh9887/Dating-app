const SectionHeader = ({ title, subtitle, action }) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-white/[0.55]">{subtitle}</p> : null}
    </div>
    {action}
  </div>
);

export default SectionHeader;
