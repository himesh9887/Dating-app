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
  <div className={classNames("mx-auto w-full px-4 pb-8 pt-1 sm:px-6 lg:px-8", className)}>
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(160deg,rgba(15,28,40,0.96),rgba(7,16,24,0.94))] p-5 shadow-panel sm:p-6 lg:p-8">
      <div className="absolute inset-0 spark-grid-bg opacity-[0.16]" />
      <div className="absolute left-[-30px] top-[-36px] h-48 w-48 rounded-full bg-spark-gold/14 blur-3xl" />
      <div className="absolute bottom-[-56px] right-[-12px] h-60 w-60 rounded-full bg-spark-cyan/12 blur-3xl" />
      <div className="absolute right-[18%] top-[8%] h-28 w-28 rounded-full border border-white/8 bg-white/[0.03]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="spark-badge">{eyebrow}</span>
          <h1 className="mt-5 font-display text-[2rem] font-semibold leading-tight text-white sm:text-[2.6rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/62 sm:text-[16px]">
              {subtitle}
            </p>
          ) : null}
        </div>

        {action ? <div className="relative shrink-0">{action}</div> : null}
      </div>

      {stats.length ? (
        <div className="relative mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="spark-stat"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/36">
                {item.label}
              </p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="font-display text-[1.6rem] font-semibold leading-none text-white sm:text-[2rem]">
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
