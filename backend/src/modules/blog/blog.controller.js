import { uploadImage, deleteImage } from "../../config/cloudinary.js";
import { HttpError } from "../../utils/http-error.js";
import * as blogService from "./blog.service.js";
import { validateBlog } from "./blog.validation.js";

const COVER_FOLDER = "portfolio/blogs";

// Best-effort: a leftover image in Cloudinary shouldn't fail the request.
const removeImage = (publicId) =>
  publicId && deleteImage(publicId).catch((err) => console.error("Cloudinary delete failed", err));

async function uploadCover(file) {
  if (!file) return {};
  try {
    const { secure_url, public_id } = await uploadImage(file.buffer, COVER_FOLDER);
    return { coverImage: secure_url, coverImageId: public_id };
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    throw new HttpError(502, "Image upload failed");
  }
}

export async function list(_req, res) {
  res.json({ blogs: await blogService.listBlogs() });
}

export async function getOne(req, res) {
  const blog = await blogService.getBlog(req.params.slug);
  if (!blog) throw new HttpError(404, "Blog not found");
  res.json({ blog });
}

export async function create(req, res) {
  const data = validateBlog(req.body);
  const cover = await uploadCover(req.file);
  try {
    const blog = await blogService.createBlog({ ...data, ...cover });
    res.status(201).json({ blog });
  } catch (err) {
    await removeImage(cover.coverImageId); // don't orphan the upload
    throw err;
  }
}

export async function update(req, res) {
  const existing = await blogService.getBlogRow(req.params.slug);
  if (!existing) throw new HttpError(404, "Blog not found");

  const data = validateBlog(req.body, { partial: true });
  const cover = await uploadCover(req.file);
  if (!Object.keys(data).length && !cover.coverImage)
    throw new HttpError(400, "Nothing to update");

  let blog;
  try {
    blog = await blogService.updateBlog(req.params.slug, { ...data, ...cover });
  } catch (err) {
    await removeImage(cover.coverImageId);
    throw err;
  }
  if (cover.coverImageId) await removeImage(existing.cover_image_id); // replaced
  res.json({ blog });
}

export async function remove(req, res) {
  const coverImageId = await blogService.deleteBlog(req.params.slug);
  if (coverImageId === undefined) throw new HttpError(404, "Blog not found");
  await removeImage(coverImageId);
  res.status(204).end();
}
