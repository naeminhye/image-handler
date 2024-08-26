import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Base64Image from "./components/Base64Image";
import CaseConverter from "./components/CaseConverter";
import ImageMerger from "./components/ImageMerger";
import ImageSplitter from "./components/ImageSplitter";

import { ThemeProvider } from "./contexts/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<ImageMerger />} />
            <Route path="/split" element={<ImageSplitter />} />
            <Route path="/case-converter" element={<CaseConverter />} />
            <Route path="/base64" element={<Base64Image />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
