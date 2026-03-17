import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const hasCloudinaryConfig =
  Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
  Boolean(process.env.CLOUDINARY_API_KEY) &&
  Boolean(process.env.CLOUDINARY_API_SECRET);

const uploadBuffer = (buffer, folder, resourceType = "image") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

export const uploadFiles = async (files = [], folder = "spark") => {
  if (!files.length) {
    return [];
  }

  if (!hasCloudinaryConfig) {
    return files.map((file, index) => ({
      url: `https://placehold.co/1200x1400/png?text=${encodeURIComponent(
        `Spark Upload ${index + 1}`,
      )}`,
      publicId: null,
      type: file.mimetype?.startsWith("video") ? "video" : "image",
    }));
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const result = await uploadBuffer(
        file.buffer,
        folder,
        file.mimetype?.startsWith("video") ? "video" : "image",
      );

      return {
        url: result.secure_url,
        publicId: result.public_id,
        type: result.resource_type === "video" ? "video" : "image",
      };
    }),
  );

  return uploads;
};
