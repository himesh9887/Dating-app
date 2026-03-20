import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../../components/NotificationCard";
import Loader from "../../components/common/Loader";
import PageShell from "../../components/common/PageShell";
import SectionHeader from "../../components/common/SectionHeader";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../redux/slices/notificationSlice";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { items: notifications, status, error } = useSelector((state) => state.notifications);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <PageShell
      eyebrow="Activity center"
      title="Everything happening around your profile"
      subtitle="Followers, likes, comments, matches, and messages stay organized in one clean stream so nothing important gets missed."
      action={
        <button
          type="button"
          onClick={() => dispatch(markAllNotificationsRead())}
          className="spark-button-ghost"
        >
          Mark all read
        </button>
      }
      stats={[
        { label: "All alerts", value: notifications.length, meta: "Now" },
        { label: "Unread", value: unreadCount, meta: unreadCount ? "New" : "Clear" },
        {
          label: "Matches + chats",
          value: notifications.filter((item) => ["match", "message"].includes(item.type)).length,
          meta: "Social",
        },
      ]}
    >
      <section className="glass-panel p-5 lg:p-6">
        <SectionHeader
          title="Notifications"
          subtitle="Tap any alert to mark it as seen and keep your inbox feeling tidy."
        />

        {status === "loading" && !notifications.length ? (
          <Loader label="Loading notifications..." />
        ) : null}

        {error && !notifications.length ? (
          <div className="glass-soft p-8 text-center text-white/70">
            {error}
          </div>
        ) : null}

        {notifications.length ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onRead={(id) => dispatch(markNotificationRead(id))}
              />
            ))}
          </div>
        ) : null}

        {!notifications.length && status === "succeeded" ? (
          <div className="glass-soft p-8 text-center text-white/60">
            You're all caught up. New followers, likes, matches, and replies will land here.
          </div>
        ) : null}
      </section>
    </PageShell>
  );
};

export default NotificationsPage;
