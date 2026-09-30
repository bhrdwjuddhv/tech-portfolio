import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload a multer memory-storage file buffer. Resolves to { secure_url, public_id, ... }.
export function uploadImage(buffer, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, result) =>
        err ? reject(err) : resolve(result),
      )
      .end(buffer);
  });
}

export function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId);
}
