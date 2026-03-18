import { Bell } from "lucide-react";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const NotificationCard = ({ notification, onRead }) => (
  <button
    type="button"
    onClick={() => onRead?.(notification._id)}
    className={`glass-soft flex w-full flex-col gap-3 p-4 text-left transition sm:flex-row ${
      notification.isRead ? "opacity-70" : "border-spark-pink/30 bg-spark-pink/[0.08]"
    }`}
  >
    <img
      src={getPrimaryPhoto(notification.actor)}
      alt={notification.actor?.username}
      className="h-12 w-12 rounded-2xl object-cover"
    />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="min-w-0 font-display text-base font-semibold">{notification.title}</h3>
        <Bell size={14} className="shrink-0 text-spark-pink" />
      </div>
      <p className="mt-1 text-sm text-white/60">{notification.body}</p>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/[0.35]">
        {formatTimeAgo(notification.createdAt)}
      </p>
    </div>
  </button>
);

export default NotificationCard;
