export const cropCanvas = (
  canvas: HTMLCanvasElement,
  {
    x = 0,
    y = 0,
    width,
    height,
  }: { x?: number; y?: number; width: number; height: number }
): string => {
  const tempCanvas = document.createElement("canvas"),
    tempContext = tempCanvas.getContext("2d");

  tempCanvas.width = width;
  tempCanvas.height = height;

  tempContext?.drawImage(canvas, x, y);
  return tempCanvas.toDataURL();
};
