import { classNames } from "../../utils/helpers";

const PageShell = ({
  eyebrow = "Spark workspace",
  title,
  subtitle,
  stats = [],
  action,
  children,
  className,
}) => (
  <div className={classNames("mx-auto w-full max-w-6xl px-4 pb-6 pt-3 sm:px-6 lg:px-8", className)}>
    <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(160deg,rgba(16,20,30,0.98),rgba(9,12,18,0.98))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-6 lg:p-7">
      <div className="absolute left-[-40px] top-[-36px] h-44 w-44 rounded-full bg-[#3797f0]/18 blur-3xl" />
      <div className="absolute bottom-[-56px] right-[-12px] h-56 w-56 rounded-full bg-[#ff7a59]/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-[1.85rem] font-semibold leading-tight text-white sm:text-[2.35rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-[14px] leading-7 text-white/66 sm:text-[15px]">
              {subtitle}
            </p>
          ) : null}
        </div>

        {action ? <div className="relative shrink-0">{action}</div> : null}
      </div>

      {stats.length ? (
        <div className="relative mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-[26px] border border-white/10 bg-white/[0.04] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/38">
                {item.label}
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="text-[1.5rem] font-semibold leading-none text-white sm:text-[1.9rem]">
                  {item.value}
                </p>
                {item.meta ? (
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/52">
                    {item.meta}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>

    <div className="mt-5 space-y-5">{children}</div>
  </div>
);

export default PageShell;
