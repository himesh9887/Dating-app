export const classNames = (...values) => values.filter(Boolean).join(" ");

export const formatTimeAgo = (value) => {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "now";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d`;
};

export const formatDistance = (value) =>
  value === null || value === undefined ? "Nearby" : `${value.toFixed(1)} km away`;

export const getPrimaryPhoto = (user) =>
  user?.profilePhotos?.find((photo) => photo.isPrimary)?.url ||
  user?.profilePhotos?.[0]?.url ||
  "https://placehold.co/600x800/png?text=Spark";

export const toHashtagArray = (value) =>
  value
    .split(",")
    .map((item) => item.trim().replace(/^#/, ""))
    .filter(Boolean);

export const getInitials = (value = "") =>
  value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const buildFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(key, file));
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, value);
  });

  return formData;
};

export const normalizeError = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message || error?.message || fallback;
