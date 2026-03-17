import Notification from "../models/Notification.js";

const createNotification = async ({
  recipient,
  actor = null,
  type,
  title,
  body = "",
  entityId = null,
  io = null,
}) => {
  if (!recipient) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    actor,
    type,
    title,
    body,
    entityId,
  });

  if (io) {
    io.to(String(recipient)).emit("notification:new", notification);
  }

  return notification;
};

export default createNotification;
