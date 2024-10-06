import React, { useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip"; // Import JSZip for creating ZIP files
import { replaceDashesWithRandomChars, SEPARATOR } from "./constant";

const ImageEncoder: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [swappedImages, setSwappedImages] = useState<string[]>([]); // Store swapped images
  const [encodedText, setEncodedText] = useState<string>("");
  const [pieceSize, setPieceSize] = useState<number>(500); // Default piece size

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedImages = Array.from(files);
      const img = new Image();
      img.src = URL.createObjectURL(uploadedImages[0]);

      img.onload = () => {
        // Check if width or height is smaller than default piece size
        const minPieceSize = Math.min(img.width, img.height);
        setPieceSize(minPieceSize < pieceSize ? minPieceSize : pieceSize);
        setImages(uploadedImages); // Store the uploaded images
      };
    }
  };

  const handlePieceSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPieceSize(Number(event.target.value));
  };

  const generateSwappedImages = async () => {
    if (images.length === 0) return;

    const allEncodedTexts: string[] = []; // Store encoded texts for all images
    const newSwappedImages: string[] = []; // Store swapped images

    // Loop through each uploaded image
    for (const originalImage of images) {
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
            pieces.length,
            shuffledIndices.join("-"),
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

          // Set swapped images and encoded text
          newSwappedImages.push(canvas.toDataURL());
          allEncodedTexts.push(newEncodedText);

          // Update swapped images state
          setSwappedImages(newSwappedImages);
          setEncodedText(
            replaceDashesWithRandomChars(
              [pieceSize, ...allEncodedTexts].join(SEPARATOR)
            )
          ); // Include piece size once
        }
      };
    }
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
      // alert("Encoded text copied to clipboard!");
    });
  };

  const downloadEncodedImages = async () => {
    const zip = new JSZip();

    // Add each swapped image to the ZIP
    for (let i = 0; i < swappedImages.length; i++) {
      const imgData = swappedImages[i];
      zip.file(`swapped_image_${i + 1}.png`, imgData.split(",")[1], {
        base64: true,
      });
    }

    // Generate ZIP file and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "swapped_images.zip");
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
      <button onClick={generateSwappedImages}>Generate</button>
      <button onClick={copyToClipboard}>Copy Encoded Text</button>
      <button onClick={downloadEncodedImages}>Download ZIP</button>

      {swappedImages.length > 0 && (
        <div>
          <h3>Swapped Images:</h3>
          <div
            style={{
              display: "flex",
            }}
          >
            {swappedImages.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Swapped ${index + 1}`}
                  style={{
                    border: "2px solid red",
                    margin: "5px",
                    width: "100px", // Set a fixed width for preview
                    height: "auto", // Maintain aspect ratio
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {encodedText && <p>Encoded Text: {encodedText}</p>}
    </div>
  );
};

export default ImageEncoder;
