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
        {notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
            onRead={(id) => dispatch(markNotificationRead(id))}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
