import React, { useState } from "react";

const Base64Image: React.FC = () => {
  const [base64Url, setBase64Url] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBase64Image = (url: string): boolean => {
    // Regular expression to check if the base64 string is an image
    const regex = /^data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,/;
    return regex.test(url);
  };

  const handleCheckAndConvert = (): void => {
    if (isBase64Image(base64Url)) {
      setImageSrc(base64Url);
      setErrorMessage(null);
    } else {
      setImageSrc(null);
      setErrorMessage("The provided Base64 string is not a valid image.");
    }
  };

  return (
    <div>
      <h2>Base64 Image Checker</h2>
      <textarea
        rows={5}
        cols={50}
        placeholder="Paste your Base64 URL here"
        value={base64Url}
        onChange={(e) => setBase64Url(e.target.value)}
      />
      <br />
      <button onClick={handleCheckAndConvert}>Check and Convert</button>
      <br />
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {imageSrc && (
        <div>
          <h3>Converted Image:</h3>
          <img
            src={imageSrc}
            alt="Converted from Base64"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default Base64Image;
