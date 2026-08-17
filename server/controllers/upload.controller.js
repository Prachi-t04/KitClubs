import { uploadBufferToCloudinary } from "../services/cloudinary.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Upload single image to Cloudinary
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please select an image file to upload");
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, "kitClub");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
      },
      "Image uploaded successfully to Cloudinary"
    )
  );
});

// Upload multiple images to Cloudinary (for gallery)
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "Please select at least one image file to upload");
  }

  const uploadPromises = req.files.map((file) =>
    uploadBufferToCloudinary(file.buffer, "kitClub")
  );

  const results = await Promise.all(uploadPromises);
  const urls = results.map((r) => r.secure_url);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        urls,
        count: urls.length,
      },
      "Multiple images uploaded successfully to Cloudinary"
    )
  );
});
