import React, { useState } from "react";
import { saveAs } from "file-saver";
import { SEPARATOR } from "./constant";

const ImageEncoder: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [swappedImage, setSwappedImage] = useState<string | null>(null);
  const [encodedText, setEncodedText] = useState<string>("");
  const [pieceSize, setPieceSize] = useState<number>(500); // Default piece size

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedImage = files[0];
      const img = new Image();
      img.src = URL.createObjectURL(uploadedImage);

      img.onload = () => {
        // Check if width or height is smaller than default piece size
        const minPieceSize = Math.min(img.width, img.height);
        setPieceSize(minPieceSize < pieceSize ? minPieceSize : pieceSize);
        setImages([uploadedImage]); // Store the uploaded image
      };
    }
  };

  const handlePieceSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPieceSize(Number(event.target.value));
  };

  const generateSwappedImage = async () => {
    if (images.length === 0) return;

    const originalImage = images[0]; // Only using the first uploaded image for this example
    const imageUrl = URL.createObjectURL(originalImage);
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
        const pieces: ImageData[] = [];
        const indices: number[] = []; // Store the original indices for encoding

        let newWidth = width;
        let newHeight = height;
        // Break the image into pieces
        for (let y = 0; y < height; y += pieceSize) {
          newHeight = y + pieceSize;
          for (let x = 0; x < width; x += pieceSize) {
            newWidth = x + pieceSize;
            const pieceData = ctx.getImageData(x, y, pieceSize, pieceSize);
            pieces.push(pieceData);
            indices.push(pieces.length - 1); // Store the original index
          }
        }

        // Shuffle pieces
        const shuffledIndices = shuffleArray(indices.slice()); // Shuffle the original indices
        const newEncodedText = [
          width,
          height,
          pieceSize,
          pieces.length,
          shuffledIndices,
        ].join(SEPARATOR);

        // Create a new image
        ctx.clearRect(0, 0, width, height);
        ctx.canvas.width = newWidth;
        ctx.canvas.height = newHeight;
        for (let i = 0; i < pieces.length; i++) {
          const pieceX = (i % (newWidth / pieceSize)) * pieceSize;
          const pieceY = Math.floor(i / (newWidth / pieceSize)) * pieceSize;
          ctx.putImageData(pieces[shuffledIndices[i]], pieceX, pieceY);
        }

        // Set swapped image and encoded text
        setSwappedImage(canvas.toDataURL());
        setEncodedText(newEncodedText);
      }
    };
  };

  const shuffleArray = (array: number[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(encodedText).then(() => {
      alert("Encoded text copied to clipboard!");
    });
  };

  const downloadEncodedImage = () => {
    if (swappedImage) {
      const newImageFileName = `swapped_image.png`;
      saveAs(swappedImage, newImageFileName);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      <label htmlFor="piece-size">Piece Size:</label>
      <input
        type="number"
        id="piece-size"
        value={pieceSize}
        min={10} // Minimum piece size
        step={10} // Step of 10
        onChange={handlePieceSizeChange}
        disabled={images.length === 0} // Disable when no image is uploaded
      />
      <button onClick={generateSwappedImage}>Generate</button>
      <button onClick={copyToClipboard}>Copy Encoded Text</button>
      {swappedImage && (
        <div>
          <h3>Swapped Image:</h3>
          <img
            src={swappedImage}
            alt="Swapped"
            style={{
              border: "2px solid red",
            }}
          />
          <button onClick={downloadEncodedImage}>Download Encoded Image</button>
        </div>
      )}
      {encodedText && <p>Encoded Text: {encodedText}</p>}
    </div>
  );
};

export default ImageEncoder;
