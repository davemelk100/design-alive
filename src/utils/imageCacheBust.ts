// Cache busting utility for images
const BUILD_TIME = Date.now(); // This will be the same for the entire build

export const getCacheBustedImageUrl = (imagePath: string): string => {
  // If it's already a full URL, don't modify it
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Add cache busting parameter
  return `${imagePath}?v=${BUILD_TIME}`;
};

// Alternative: Use environment variable for more control
export const getVersionedImageUrl = (imagePath: string): string => {
  const version = import.meta.env.VITE_IMAGE_VERSION || BUILD_TIME;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${imagePath}?v=${version}`;
};
