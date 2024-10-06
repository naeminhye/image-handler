import React, { useState } from "react";
import { SEPARATOR } from "./constant";
import { cropCanvas } from "../../utils/canvasManipulator";

const ImageDecoder: React.FC = () => {
  const [swappedImage, setSwappedImage] = useState<File | null>(null);
  const [encodedText, setEncodedText] = useState<string>("");
  const [decodedImage, setDecodedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSwappedImage(files[0]);
    }
  };

  const decodeImage = async () => {
    if (!swappedImage || !encodedText) return;

    const imageUrl = URL.createObjectURL(swappedImage);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = img.width;
        const height = img.height;
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0);

        // Decode the encoded text to get the original piece order and dimensions
        const parts = encodedText.split(SEPARATOR).map((part) => part.trim());
        const originalWidth = Number(parts[0]);
        const originalHeight = Number(parts[1]);
        const pieceSize = Number(parts[2]); // Get piece size from encoded text
        const count = Number(parts[3]); // Get piece size from encoded text
        const indices = parts.slice(4).map(Number); // Get original indices from encoded text

        // Break the image into pieces
        const imagePieces: ImageData[] = [];
        for (let y = 0; y < height; y += pieceSize) {
          for (let x = 0; x < width; x += pieceSize) {
            const pieceData = ctx.getImageData(x, y, pieceSize, pieceSize);
            imagePieces.push(pieceData);
          }
        }

        // Create the original image
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < count; i++) {
          const pieceX = (i % (width / pieceSize)) * pieceSize;
          const pieceY = Math.floor(i / (width / pieceSize)) * pieceSize;

          // Ensure we are putting the correct piece data
          const pieceIndex = indices.findIndex((ind) => ind === i); // Get the original piece index

          if (pieceIndex < imagePieces.length) {
            ctx.putImageData(imagePieces[pieceIndex], pieceX, pieceY);
          }
        }

        // Set decoded image
        setDecodedImage(
          cropCanvas(canvas, { width: originalWidth, height: originalHeight })
        );
      }
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <input
        type="text"
        placeholder="Enter Encoded Text"
        value={encodedText}
        onChange={(e) => setEncodedText(e.target.value)}
      />
      <button onClick={decodeImage}>Decode</button>
      {decodedImage && (
        <div>
          <h3>Decoded Image:</h3>
          <img src={decodedImage} alt="Decoded" />
        </div>
      )}
    </div>
  );
};

export default ImageDecoder;
