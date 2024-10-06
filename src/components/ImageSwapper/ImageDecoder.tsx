import React, { useState } from "react";
import JSZip from "jszip"; // Import JSZip for creating ZIP files
import { revertToOriginalString, SEPARATOR } from "./constant";
import saveAs from "file-saver";
import { cropCanvas } from "../../utils/canvasManipulator";

type ImageDataType = {
  originalWidth: number;
  originalHeight: number;
  count: number;
  indices: number[];
};

const ImageDecoder: React.FC = () => {
  const [swappedImages, setSwappedImages] = useState<File[]>([]);
  const [encodedText, setEncodedText] = useState<string>("");
  const [decodedImages, setDecodedImages] = useState<string[]>([]); // Store decoded images

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedImages = Array.from(files);
      setSwappedImages(uploadedImages); // Store uploaded images
    }
  };

  const decodeImages = async () => {
    if (swappedImages.length === 0 || !encodedText) return;

    const imageUrls = swappedImages.map((image) => URL.createObjectURL(image));
    // const newDecodedImages: string[] = [];

    // Decode the encoded text to get the original piece order and dimensions
    const parts = revertToOriginalString(encodedText)
      .split(SEPARATOR)
      .map((part) => part.trim());

    const pieceSize = Number(parts[0]);
    const imageDataList: ImageDataType[] = [];

    // Loop through the encoded text parts
    let i = 1;
    while (i < parts.length) {
      const originalWidth = Number(parts[i]);
      const originalHeight = Number(parts[i + 1]);
      const count = Number(parts[i + 2]);
      const startIndex = i + 3;
      const endIndex = startIndex + count;
      const indices = parts.slice(startIndex, endIndex).map(Number); // Get original indices from encoded text

      imageDataList.push({
        originalWidth,
        originalHeight,
        count,
        indices,
      });
      i = endIndex;
    }
    for (let imageIndex = 0; imageIndex < imageUrls.length; imageIndex++) {
      const img = new Image();
      img.src = imageUrls[imageIndex];
      const { originalWidth, originalHeight, count, indices } =
        imageDataList[imageIndex];

      const onloadFunc = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const width = img.width;
          const height = img.height;
          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0);

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
            const widthCount = width / pieceSize;
            const pieceX = (i % widthCount) * pieceSize;
            const pieceY = Math.floor(i / widthCount) * pieceSize;

            // Ensure we are putting the correct piece data
            const pieceIndex = indices.findIndex((ind) => ind === i); // Get the original piece index

            if (pieceIndex < imagePieces.length) {
              ctx.putImageData(imagePieces[pieceIndex], pieceX, pieceY);
            }
          }

          // Set decoded image
          const cropped = cropCanvas(canvas, {
            width: originalWidth,
            height: originalHeight,
          });
          setDecodedImages((images) => [...images, cropped]);
        }
      };

      const onerrorFunc = () => {
        console.error("Something went wrong.");
      };

      img.onload = onloadFunc;
      img.onerror = onerrorFunc;
    }
  };

  const downloadDecodedImages = async () => {
    const zip = new JSZip();

    // Add each decoded image to the ZIP
    for (let i = 0; i < decodedImages.length; i++) {
      const imgData = decodedImages[i];
      zip.file(`decoded_image_${i + 1}.png`, imgData.split(",")[1], {
        base64: true,
      });
    }

    // Generate ZIP file and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "decoded_images.zip");
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        multiple
      />
      <input
        type="text"
        placeholder="Enter Encoded Text"
        value={encodedText}
        onChange={(e) => setEncodedText(e.target.value)}
      />
      <button onClick={decodeImages}>Decode</button>
      <button onClick={downloadDecodedImages}>Download ZIP</button>
      {decodedImages.length > 0 && (
        <div>
          <h3>Decoded Images:</h3>
          {decodedImages.map((img, index) => (
            <div key={index}>
              <img
                src={img}
                alt={`Decoded ${index + 1}`}
                style={{
                  border: "2px solid green",
                  margin: "5px",
                  width: "100px",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDecoder;
