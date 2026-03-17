const toRadians = (value) => (value * Math.PI) / 180;

export const calculateDistanceKm = (origin, destination) => {
  if (!origin?.length || !destination?.length) {
    return null;
  }

  const [originLng, originLat] = origin;
  const [destinationLng, destinationLat] = destination;
  const radius = 6371;
  const deltaLat = toRadians(destinationLat - originLat);
  const deltaLng = toRadians(destinationLng - originLng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(originLat)) *
      Math.cos(toRadians(destinationLat)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((radius * c).toFixed(1));
};

export const sortByDistance = (origin, users) =>
  users
    .map((user) => ({
      ...user,
      distanceKm: calculateDistanceKm(
        origin,
        user.location?.coordinates?.coordinates,
      ),
    }))
    .sort((left, right) => {
      if (left.distanceKm === null) {
        return 1;
      }

      if (right.distanceKm === null) {
        return -1;
      }

      return left.distanceKm - right.distanceKm;
    });
