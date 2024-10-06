import React, { useState } from "react";

import ImageEncoder from "./ImageEncoder";
import ImageDecoder from "./ImageDecoder";

const ImageSwapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"encoder" | "decoder">("encoder");

  const handleTabChange = (tab: "encoder" | "decoder") => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <h1>Image Swapper</h1>

      <div>
        <button onClick={() => handleTabChange("encoder")}>
          Image Encoder
        </button>
        <button onClick={() => handleTabChange("decoder")}>
          Image Decoder
        </button>
      </div>
      <div>
        {activeTab === "encoder" && <ImageEncoder />}
        {activeTab === "decoder" && <ImageDecoder />}
      </div>
    </div>
  );
};
export default ImageSwapper;
