export interface MergeOptions {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  direction: 'vertical' | 'horizontal';
}

export const mergeImages = async (
  images: HTMLImageElement[],
  options: MergeOptions
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  if (options.direction === 'vertical') {
    // Set canvas size for vertical merging
    canvas.width = Math.max(...images.map((img) => img.width));
    canvas.height = images.reduce((sum, img) => sum + img.height, 0);

    let currentHeight = 0;
    images.forEach((img) => {
      ctx.drawImage(img, 0, currentHeight);
      currentHeight += img.height;
    });
  } else {
    // Set canvas size for horizontal merging
    canvas.width = images.reduce((sum, img) => sum + img.width, 0);
    canvas.height = Math.max(...images.map((img) => img.height));

    let currentWidth = 0;
    images.forEach((img) => {
      ctx.drawImage(img, currentWidth, 0);
      currentWidth += img.width;
    });
  }

  return canvas.toDataURL(options.format, options.quality);
};
