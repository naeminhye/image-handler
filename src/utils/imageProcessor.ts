import { Accept } from 'react-dropzone';

export interface MergeOptions {
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  direction: 'vertical' | 'horizontal';
}

export interface SplitOptions {
  splitDirection: 'vertical' | 'horizontal' | 'both';
  splitBy: 'quantity' | 'dimension';
  quantity: number;
  dimension: number;
}

// Specify the accept type properly
export const accept: Accept = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

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
export const splitImage = async (
  image: HTMLImageElement,
  options: SplitOptions
): Promise<HTMLCanvasElement[]> => {
  const { splitDirection, splitBy, quantity, dimension } = options;
  const canvasWidth =
    splitDirection === 'horizontal' ? image.width / quantity : image.width;
  const canvasHeight =
    splitDirection === 'vertical' ? image.height / quantity : image.height;

  const splits: HTMLCanvasElement[] = [];

  for (let i = 0; i < quantity; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = splitBy === 'dimension' ? dimension : canvasWidth;
    canvas.height = splitBy === 'dimension' ? dimension : canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(
        image,
        splitDirection === 'horizontal' ? i * canvasWidth : 0,
        splitDirection === 'vertical' ? i * canvasHeight : 0,
        canvasWidth,
        canvasHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      splits.push(canvas);
    }
  }

  return splits;
};
