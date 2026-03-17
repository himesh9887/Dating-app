import { calculateDistanceKm } from "../utils/distance.js";

export const withDistance = (viewer, candidate) => {
  const viewerCoords = viewer.location?.coordinates?.coordinates;
  const candidateObj = candidate.toObject ? candidate.toObject() : candidate;
  const candidateCoords = candidateObj.location?.coordinates?.coordinates;
  const distanceKm = calculateDistanceKm(viewerCoords, candidateCoords);

  return {
    ...candidateObj,
    distanceKm,
    sharedInterests: candidateObj.interests?.filter((interest) =>
      viewer.interests?.includes(interest),
    ),
  };
};
