import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../../components/NotificationCard";
import SectionHeader from "../../components/common/SectionHeader";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../redux/slices/notificationSlice";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["All alerts", notifications.length],
          ["Unread", notifications.filter((item) => !item.isRead).length],
          ["Matches + chats", notifications.filter((item) => ["match", "message"].includes(item.type)).length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="glass-soft p-4"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-white/40">{label}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel p-5">
        <SectionHeader
          title="Notifications"
          subtitle="Followers, likes, comments, matches, and messages in one stream."
          action={
            <button
              type="button"
              onClick={() => dispatch(markAllNotificationsRead())}
              className="spark-button-ghost"
            >
              Mark all read
            </button>
          }
        />
        <div className="space-y-3">
          {notifications.length ? (
            notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onRead={(id) => dispatch(markNotificationRead(id))}
              />
            ))
          ) : (
            <div className="glass-soft p-8 text-center text-white/60">
              You're all caught up. New followers, likes, matches, and replies will land here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
