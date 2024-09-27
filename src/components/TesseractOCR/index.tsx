import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

const TesseractOCR: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [texts, setTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [boundingBoxes, setBoundingBoxes] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("kor");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle image upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setBoundingBoxes([]);
      setTexts([]);
    }
  };

  // Handle language change
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value);
  };

  // Process OCR for the selected image
  const handleExtractText = async () => {
    if (!selectedFile) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;

      // Recognize text using Tesseract.js
      Tesseract.recognize(imageData, selectedLanguage, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.floor(m.progress * 100));
          }
        },
      }).then(({ data }) => {
        const { text, words } = data;
        setTexts([text]);
        setBoundingBoxes(words.map((word: any) => word.bbox));
        setLoading(false);
      });
    };

    reader.readAsDataURL(selectedFile);
  };

  // Draw image and bounding boxes on canvas
  useEffect(() => {
    if (
      canvasRef.current &&
      imageRef.current &&
      selectedFile &&
      boundingBoxes.length > 0
    ) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const image = imageRef.current;

      if (context && image) {
        // Draw image on canvas
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, image.width, image.height);

          // Draw bounding boxes around recognized text
          context.strokeStyle = "red";
          context.lineWidth = 2;
          boundingBoxes.forEach((bbox) => {
            context.strokeRect(
              bbox.x0,
              bbox.y0,
              bbox.x1 - bbox.x0,
              bbox.y1 - bbox.y0
            );
          });
        };
      }
    }
  }, [boundingBoxes, selectedFile]);

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      <div style={{ flex: 1, paddingRight: "20px" }}>
        <h1>Tesseract.js OCR TesseractOCR</h1>

        {/* Language Selection */}
        <label htmlFor="language">Select OCR Language: </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="kor">Korean</option>
          <option value="eng">English</option>
          <option value="jpn">Japanese</option>
          <option value="spa">Spanish</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
          <option value="ita">Italian</option>
          <option value="chi_sim">Simplified Chinese</option>
          <option value="chi_tra">Traditional Chinese</option>
        </select>

        {/* File Input */}
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "block", marginTop: "10px" }}
        />

        {/* Button to extract text */}
        <button
          onClick={handleExtractText}
          disabled={!selectedFile || loading}
          style={{ marginTop: "10px" }}
        >
          {loading ? `Extracting (${progress}%)...` : "Extract Text"}
        </button>

        {/* Display image and canvas */}
        {selectedFile && (
          <div style={{ marginTop: "20px" }}>
            <h2>Image Preview:</h2>
            <canvas ref={canvasRef} style={{ width: "100%" }}></canvas>
            <img
              ref={imageRef}
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded Preview"
              style={{ display: "none" }} // Hide the image but use it for drawing on canvas
            />
          </div>
        )}
      </div>

      {/* OCR Text Output */}
      <div style={{ flex: 1 }}>
        <h2>Extracted Text:</h2>
        {texts.length > 0 ? (
          texts.map((text, index) => (
            <div
              key={index}
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#f5f5f5",
                padding: "10px",
              }}
            >
              {text}
            </div>
          ))
        ) : (
          <p>No text extracted yet.</p>
        )}
      </div>
    </div>
  );
};

export default TesseractOCR;
