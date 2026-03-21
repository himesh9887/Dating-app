import { Bell } from "lucide-react";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const NotificationCard = ({ notification, onRead }) => (
  <button
    type="button"
    onClick={() => onRead?.(notification._id)}
    className={`glass-soft flex w-full items-start gap-4 rounded-[28px] border p-4 text-left transition duration-300 ${
      notification.isRead
        ? "border-white/10 bg-white/[0.03] opacity-75"
        : "border-white/14 bg-[linear-gradient(135deg,rgba(113,223,243,0.08),rgba(255,255,255,0.03))]"
    }`}
  >
    <div className="relative shrink-0">
      <img
        src={getPrimaryPhoto(notification.actor)}
        alt={notification.actor?.username}
        className="h-12 w-12 rounded-[18px] border border-white/10 object-cover"
      />
      {!notification.isRead ? (
        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-spark-base bg-spark-cyan" />
      ) : null}
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[1rem] font-semibold text-white">{notification.title}</h3>
          <p className="mt-1 text-sm leading-6 text-white/60">{notification.body}</p>
        </div>
        <div className="shrink-0 rounded-full bg-white/[0.04] p-2 text-spark-cyan">
          <Bell size={14} />
        </div>
      </div>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/[0.35]">
        {formatTimeAgo(notification.createdAt)}
      </p>
    </div>
  </button>
);

export default NotificationCard;
